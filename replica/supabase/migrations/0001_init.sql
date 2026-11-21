-- 3인 스타트업 협업툴: 엔터티 7개 + RLS. Supabase(auth.users, auth.uid()) 기준.

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  owner_id uuid not null references profiles default auth.uid(),
  created_at timestamptz not null default now());

create table project_members (
  project_id uuid references projects on delete cascade,
  user_id uuid references profiles on delete cascade,
  role text not null default 'member' check (role in ('owner','member','guest')),
  primary key (project_id, user_id));

create table task_statuses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name text not null, color text, position int not null default 0,
  is_done boolean not null default false);

create table tasks (  -- 글/업무/할일 통합. shortcut: 하위업무 없음, 필요하면 parent_id 추가
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  kind text not null default 'task' check (kind in ('post','task','todo')),
  title text not null check (length(title) between 1 and 200), body text,
  status_id uuid references task_statuses on delete set null,
  assignee_id uuid references profiles on delete set null,
  priority smallint not null default 0 check (priority between 0 and 3),
  progress smallint not null default 0 check (progress between 0 and 100),
  start_date date, due_date date check (due_date >= start_date),
  created_by uuid not null references profiles default auth.uid(),
  created_at timestamptz not null default now());

create table comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks on delete cascade,
  author_id uuid not null references profiles default auth.uid(),
  body text not null check (length(body) between 1 and 5000),
  created_at timestamptz not null default now());

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  task_id uuid references tasks on delete cascade,
  type text not null check (type in ('mention','assigned','due_soon','overdue')),
  read_at timestamptz, created_at timestamptz not null default now());

create index on project_members (user_id);
create index on tasks (project_id, status_id);
create index on tasks (assignee_id, due_date);
create index on comments (task_id);
create index on notifications (user_id, read_at);

-- security definer: project_members 정책이 자기 자신을 조회할 때 RLS 무한재귀 방지
create function is_member(p uuid) returns boolean language sql stable security definer set search_path = public as
  $$ select exists (select 1 from project_members where project_id = p and user_id = auth.uid()) $$;
create function is_owner(p uuid) returns boolean language sql stable security definer set search_path = public as
  $$ select exists (select 1 from projects where id = p and owner_id = auth.uid()) $$;

-- 가입 시 profile 생성
create function on_signup() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger on_signup after insert on auth.users for each row execute function on_signup();

-- 프로젝트 생성 시 owner 멤버 + 기본 상태 4개
create function on_project_created() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into project_members (project_id, user_id, role) values (new.id, new.owner_id, 'owner');
  insert into task_statuses (project_id, name, color, position, is_done) values
    (new.id, '대기', '#9ca3af', 0, false), (new.id, '진행', '#facc15', 1, false),
    (new.id, '피드백', '#fb923c', 2, false), (new.id, '완료', '#3b82f6', 3, true);
  return new;
end $$;
create trigger on_project_created after insert on projects for each row execute function on_project_created();

-- 담당자 지정 알림 (본인 지정은 제외)
create function on_task_assigned() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.assignee_id is not null and new.assignee_id is distinct from auth.uid()
     and (tg_op = 'INSERT' or new.assignee_id is distinct from old.assignee_id) then
    insert into notifications (user_id, task_id, type) values (new.assignee_id, new.id, 'assigned');
  end if;
  return new;
end $$;
create trigger on_task_assigned after insert or update of assignee_id on tasks for each row execute function on_task_assigned();

-- RLS
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table task_statuses enable row level security;
alter table tasks enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;

create policy read on profiles for select to authenticated using (true);
create policy own on profiles for update to authenticated using (id = auth.uid());

create policy read on projects for select to authenticated using (is_member(id));
create policy add on projects for insert to authenticated with check (owner_id = auth.uid());
create policy edit on projects for update to authenticated using (owner_id = auth.uid());
create policy del on projects for delete to authenticated using (owner_id = auth.uid());

create policy read on project_members for select to authenticated using (is_member(project_id));
create policy invite on project_members for insert to authenticated with check (is_owner(project_id) and role <> 'owner');
create policy kick on project_members for delete to authenticated using (is_owner(project_id) and role <> 'owner');

create policy member on task_statuses for all to authenticated using (is_member(project_id)) with check (is_member(project_id));

create policy member on tasks for all to authenticated using (is_member(project_id))
  with check (is_member(project_id) and (assignee_id is null or exists
    (select 1 from project_members m where m.project_id = tasks.project_id and m.user_id = assignee_id)));

create policy read on comments for select to authenticated
  using (exists (select 1 from tasks t where t.id = task_id and is_member(t.project_id)));
create policy add on comments for insert to authenticated
  with check (author_id = auth.uid() and exists (select 1 from tasks t where t.id = task_id and is_member(t.project_id)));
create policy del on comments for delete to authenticated using (author_id = auth.uid());

create policy own on notifications for select to authenticated using (user_id = auth.uid());
create policy mark on notifications for update to authenticated using (user_id = auth.uid());

-- 대시보드(S1): 호출자 권한으로 실행되어 RLS 그대로 적용
create view dashboard with (security_invoker = true) as
select t.project_id, t.assignee_id,
  count(*) filter (where not coalesce(s.is_done, false))                                          as open,
  count(*) filter (where not coalesce(s.is_done, false) and t.due_date < current_date)            as overdue,
  count(*) filter (where not coalesce(s.is_done, false) and t.due_date between current_date and current_date + 7) as this_week,
  count(*) filter (where coalesce(s.is_done, false))                                              as done,
  round(avg(t.progress))                                                         as avg_progress
from tasks t left join task_statuses s on s.id = t.status_id
where t.kind = 'task'
group by t.project_id, t.assignee_id;
