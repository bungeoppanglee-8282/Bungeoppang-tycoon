-- 실행: tests/run.sh (로컬 Postgres에 Supabase auth 스텁을 깔고 검증)
\set ON_ERROR_STOP 1
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@x.com'),
  ('00000000-0000-0000-0000-00000000000b', 'b@x.com'),
  ('00000000-0000-0000-0000-00000000000c', 'c@x.com');
set role authenticated;

-- A가 프로젝트 생성 → owner 멤버 + 상태 4개 자동
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
insert into projects (id, name) values ('11111111-1111-1111-1111-111111111111', 'P');
do $$ begin assert (select count(*) from task_statuses) = 4, 'default statuses'; end $$;
insert into project_members (project_id, user_id) values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000b');
insert into tasks (project_id, title, assignee_id, due_date, status_id)
  select '11111111-1111-1111-1111-111111111111', '지연업무', '00000000-0000-0000-0000-00000000000b', current_date - 1, id
  from task_statuses where name = '진행';

-- B: 멤버라 보임, 배정 알림 받음, 대시보드 지연 1
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
do $$ begin
  assert (select count(*) from tasks) = 1, 'member sees task';
  assert (select count(*) from notifications where type = 'assigned') = 1, 'assigned notification';
  assert (select overdue from dashboard) = 1, 'dashboard overdue';
end $$;
insert into comments (task_id, body) select id, '확인' from tasks;
-- B는 owner가 아니라 초대 불가
do $$ begin
  begin
    insert into project_members (project_id, user_id) values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000c');
    raise exception 'non-owner invited';
  exception when insufficient_privilege then null; end;
end $$;

-- C: 비멤버라 아무것도 안 보임, 쓰기 불가
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$ begin
  assert (select count(*) from projects) = 0, 'outsider sees project';
  assert (select count(*) from tasks) = 0, 'outsider sees task';
  assert (select count(*) from comments) = 0, 'outsider sees comment';
  assert (select count(*) from dashboard) = 0, 'outsider sees dashboard';
  begin
    insert into tasks (project_id, title) values ('11111111-1111-1111-1111-111111111111', 'x');
    raise exception 'outsider wrote task';
  exception when insufficient_privilege then null; end;
end $$;
\echo ALL RLS TESTS PASSED
