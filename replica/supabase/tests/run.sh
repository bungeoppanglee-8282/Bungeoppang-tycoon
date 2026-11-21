#!/usr/bin/env bash
# 임시 Postgres를 띄워 migration + RLS 테스트 실행. 필요: postgres 16 바이너리
set -euo pipefail
cd "$(dirname "$0")/.."
BIN=$(ls -d /usr/lib/postgresql/*/bin | tail -1)
DIR=$(mktemp -d); AS=""; [ "$(id -u)" = 0 ] && { chown postgres "$DIR"; AS="runuser -u postgres --"; }  # initdb는 root 실행 불가
trap '$AS $BIN/pg_ctl -D $DIR/db stop -m immediate >/dev/null 2>&1; rm -rf $DIR' EXIT
$AS $BIN/initdb -D $DIR/db -U postgres >/dev/null
$AS $BIN/pg_ctl -D $DIR/db -o "-k $DIR -c listen_addresses=''" -l $DIR/log start >/dev/null
P="psql -h $DIR -U postgres -q -v ON_ERROR_STOP=1"
# Supabase auth 스텁
$P -c "create role authenticated; create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
  create function auth.uid() returns uuid language sql stable as \$\$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid \$\$;
  grant usage on schema auth, public to authenticated; grant execute on function auth.uid() to authenticated;"
$P -f migrations/0001_init.sql
$P -c "grant select, insert, update, delete on all tables in schema public to authenticated;"
$P -f tests/rls_test.sql
