# 3인 스타트업 협업툴 설계 (채팅 제외, S~M)

## 스택 (관리형만)
Next.js(App Router) + Supabase(Postgres·Auth·RLS·Storage) + Vercel. 이메일 알림은 Resend.
- 별도 백엔드 없음: 읽기/쓰기는 Supabase 클라이언트 + RLS가 권한 처리.
- 실시간 없음(채팅 제외). 새로고침/재검증으로 충분.

## 화면 → 라우트
| ID | 화면 | 라우트 |
|---|---|---|
| S1 | 대시보드 | `/` |
| S2 | 프로젝트 피드 | `/p/[id]` |
| S3 | 업무 상세 | `/p/[id]/t/[taskId]` |
| S4 | 간트 | `/p/[id]/gantt` |
| S5 | 캘린더 | `/p/[id]/calendar` |
| S6 | 알림 | `/notifications` |

## 스키마 (엔터티 7개)
```sql
create table profiles (id uuid primary key references auth.users, name text not null);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null, owner_id uuid not null references profiles);

create table project_members (
  project_id uuid references projects on delete cascade,
  user_id uuid references profiles,
  role text not null default 'member' check (role in ('owner','member','guest')),
  primary key (project_id, user_id));

create table task_statuses (            -- 기본: 대기/진행/완료/피드백
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name text not null, color text, position int not null default 0,
  is_done boolean not null default false);

create table tasks (                    -- Post와 Task 통합
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  kind text not null default 'task' check (kind in ('post','task','todo')),
  title text not null, body text,
  status_id uuid references task_statuses,
  assignee_id uuid references profiles,
  priority smallint default 0, progress smallint default 0 check (progress between 0 and 100),
  start_date date, due_date date,
  created_by uuid not null references profiles, created_at timestamptz default now());

create table comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks on delete cascade,
  author_id uuid not null references profiles,
  body text not null, created_at timestamptz default now());

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles,
  task_id uuid references tasks on delete cascade,
  type text not null check (type in ('mention','assigned','due_soon','overdue')),
  read_at timestamptz, created_at timestamptz default now());

create index on tasks (project_id, status_id);
create index on tasks (assignee_id, due_date);
```

## 권한 (RLS 한 규칙)
`project_id in (select project_id from project_members where user_id = auth.uid())` 를 tasks·comments·task_statuses·projects에 동일 적용. guest도 멤버 행이 있으면 같은 규칙으로 접근(범위는 해당 프로젝트로 한정).

## 대시보드 쿼리 (S1)
```sql
-- 숫자 카드 + 담당자별 진행
select assignee_id,
  count(*) filter (where not s.is_done)                          as open,
  count(*) filter (where not s.is_done and due_date < current_date) as overdue,
  count(*) filter (where not s.is_done and due_date <= current_date + 7) as this_week,
  avg(progress)                                                  as avg_progress
from tasks t join task_statuses s on s.id = t.status_id
where t.kind = 'task' group by assignee_id;
```
칸반 = `tasks` 를 `status_id` 로 묶기만 하면 됨.

## 알림
- 멘션·담당 지정: 댓글/업무 insert 트리거로 `notifications` 생성.
- 마감 임박·지연: Vercel Cron 하루 1회가 쿼리 후 insert + Resend 메일.

## 빌드 순서 (수직 슬라이스 먼저)
1. 인증 + 프로젝트 + 멤버 초대 (+ RLS)
2. 업무 생성/상세/댓글 → 피드(S2, S3)
3. 대시보드(S1) — 집계 쿼리 1개
4. 간트(S4) — 가장 어려움, 마지막
5. 캘린더(S5), 알림(S6)

## 의도적으로 뺀 것
채팅, 하위업무, 커스텀 필드, 투표, 반복, 파일 탭, 감사/보안, 조직도. `shortcut: kind 컬럼 하나로 글/업무/할일 통합, 하위업무가 필요해지면 tasks.parent_id 추가`.
