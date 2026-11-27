\set ON_ERROR_STOP 1
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@x.com'),
  ('00000000-0000-0000-0000-00000000000b', 'b@x.com'),
  ('00000000-0000-0000-0000-00000000000c', 'c@x.com');
set role authenticated;
-- A: 생성 + 본인 가입 + B 초대
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","email":"a@x.com"}', false);
insert into public.workspaces (id, name) values ('11111111-1111-1111-1111-111111111111', 'W');
insert into public.workspace_invites values ('11111111-1111-1111-1111-111111111111', 'b@x.com');
update public.workspaces set data = '{"me":"","projects":[],"tasks":[]}', version = 2;
do $$ begin
  begin update public.workspaces set version = 2; raise exception 'stale update allowed';
  exception when serialization_failure then null; end;
end $$;
-- C: 초대 없음 → 안 보이고 가입 불가
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000c","email":"c@x.com"}', false);
do $$ begin
  assert (select count(*) from public.workspaces) = 0, 'outsider sees workspace';
  begin insert into public.workspace_members values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000c');
    raise exception 'outsider joined'; exception when insufficient_privilege then null; end;
  update public.workspaces set version = 3; assert not found, 'outsider updated';
end $$;
-- B: 초대 보고 가입 → 수정 가능, 다른 사람 대신 가입 불가
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","email":"B@X.com"}', false);
do $$ begin
  assert (select count(*) from public.workspaces) = 1, 'invitee sees workspace';
  update public.workspaces set version = 3; assert not found, 'invitee updated before joining';
  begin insert into public.workspace_members values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000c');
    raise exception 'joined as someone else'; exception when insufficient_privilege then null; end;
end $$;
insert into public.workspace_members values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000b');
update public.workspaces set data = data || '{"me":"b"}', version = 3;
do $$ begin
  assert (select version from public.workspaces) = 3, 'member update';
  delete from public.workspaces; assert found = false, 'non-owner deleted';
end $$;
\echo ALL RLS TESTS PASSED
