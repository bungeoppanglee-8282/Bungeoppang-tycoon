-- 팀 공유: 워크스페이스 1개 = 앱 데이터 JSON 1개. Supabase SQL Editor에 그대로 붙여넣어 실행.
-- shortcut: 데이터를 jsonb 한 덩어리로 저장(3인 팀 규모), 수백 건 이상이면 테이블 분리(git 94b1e7d 설계)로 전환
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null default '{"me":"","projects":[],"tasks":[]}',
  version int not null default 1, -- 동시 수정 충돌 감지용
  updated_at timestamptz not null default now(),
  check (pg_column_size(data) < 5000000));

create table public.workspace_members (
  workspace_id uuid references public.workspaces on delete cascade,
  user_id uuid references auth.users on delete cascade,
  primary key (workspace_id, user_id));

create table public.workspace_invites (
  workspace_id uuid references public.workspaces on delete cascade,
  email text not null check (email = lower(email)),
  primary key (workspace_id, email));

create index on public.workspace_members (user_id);
create index on public.workspace_invites (email);

-- RLS 재귀 방지용 조회 함수. API에 노출되지 않는 private 스키마, 호출자 본인(auth.uid())만 검사
create schema if not exists private;
create function private.is_member(ws uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.workspace_members where workspace_id = ws and user_id = (select auth.uid())) $$;
revoke all on function private.is_member from public;
grant usage on schema private to authenticated;
grant execute on function private.is_member to authenticated;

-- 워크스페이스 만든 사람을 자동으로 멤버로 (트리거 전용이라 RPC로 호출 불가)
create function private.add_owner() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.workspace_members values (new.id, new.owner_id);
  return new;
end $$;
create trigger add_owner after insert on public.workspaces for each row execute function private.add_owner();

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invites enable row level security;

create policy own_rows on public.workspace_members for select to authenticated
  using (user_id = (select auth.uid()));
-- 가입: 본인을, 초대받은(로그인으로 검증된 이메일) 워크스페이스에만
create policy join_ws on public.workspace_members for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.workspace_invites i
    where i.workspace_id = workspace_members.workspace_id and i.email = lower((select auth.jwt()) ->> 'email')));
create policy leave on public.workspace_members for delete to authenticated
  using (user_id = (select auth.uid()));

create policy read on public.workspaces for select to authenticated using (
  owner_id = (select auth.uid())
  or private.is_member(id)
  or id in (select workspace_id from public.workspace_invites where email = lower((select auth.jwt()) ->> 'email')));
create policy add on public.workspaces for insert to authenticated with check (owner_id = (select auth.uid()));
create policy edit on public.workspaces for update to authenticated
  using (private.is_member(id))
  with check (private.is_member(id));
create policy del on public.workspaces for delete to authenticated using (owner_id = (select auth.uid()));

create policy read on public.workspace_invites for select to authenticated using (
  email = lower((select auth.jwt()) ->> 'email')
  or private.is_member(workspace_id));
create policy invite on public.workspace_invites for insert to authenticated
  with check (private.is_member(workspace_id));
create policy uninvite on public.workspace_invites for delete to authenticated
  using (private.is_member(workspace_id));

-- owner/version/생성일은 클라이언트가 바꿀 수 없게: version은 1씩만 증가
create function public.guard_workspace() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.owner_id <> old.owner_id then raise exception 'owner cannot change'; end if;
  if new.version <> old.version + 1 then raise exception 'stale version' using errcode = '40001'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger guard before update on public.workspaces for each row execute function public.guard_workspace();

grant select, insert, update, delete on public.workspaces, public.workspace_members, public.workspace_invites to authenticated;
revoke all on public.workspaces, public.workspace_members, public.workspace_invites from anon;

-- 실시간 반영
alter publication supabase_realtime add table public.workspaces;
