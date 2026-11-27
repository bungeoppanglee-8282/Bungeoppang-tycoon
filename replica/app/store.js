// 데이터 로직(브라우저 + node 테스트 공용). 저장소: localStorage, 서버 없음.
const STATUSES = [
  { id: 'wait', name: '대기', color: '#9ca3af' },
  { id: 'doing', name: '진행', color: '#ca8a04' },
  { id: 'feedback', name: '피드백', color: '#ea580c' },
  { id: 'done', name: '완료', color: '#2563eb' },
]; // shortcut: 상태 4개 고정, 프로젝트별 커스텀 상태가 필요하면 project.statuses로 이동
const KEY = 'flowlite.v1';
const empty = () => ({ me: '', projects: [], tasks: [] });

function valid(d) {
  return d && typeof d === 'object' && Array.isArray(d.projects) && Array.isArray(d.tasks)
    && d.projects.every(p => typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.members))
    && d.tasks.every(t => typeof t.id === 'string' && typeof t.title === 'string' && Array.isArray(t.comments));
}
function load(storage) {
  try { const d = JSON.parse(storage.getItem(KEY)); if (valid(d)) return d; } catch {}
  return empty();
}
function save(storage, d) { storage.setItem(KEY, JSON.stringify(d)); }
function parseImport(text) {
  let d; try { d = JSON.parse(text); } catch { throw new Error('JSON 파일이 아닙니다'); }
  if (!valid(d)) throw new Error('이 앱의 백업 파일 형식이 아닙니다');
  return d;
}
function addDays(day, n) {
  const x = new Date(day + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10);
}
// 담당자별 집계. today = 'YYYY-MM-DD'
function dashboard(tasks, today) {
  const week = addDays(today, 7), rows = {};
  for (const t of tasks) {
    if (t.kind !== 'task') continue;
    const r = rows[t.assignee || '미지정'] ??= { open: 0, overdue: 0, thisWeek: 0, done: 0 };
    if (t.status === 'done') { r.done++; continue; }
    r.open++;
    if (t.due && t.due < today) r.overdue++;
    else if (t.due && t.due <= week) r.thisWeek++;
  }
  return rows;
}
const diffDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
// 간트 범위: 날짜 있는 업무의 최소 시작~최대 마감 (+앞뒤 여유 1일)
function ganttRange(tasks) {
  const ds = tasks.flatMap(t => [t.start, t.due]).filter(Boolean).sort();
  if (!ds.length) return null;
  const from = addDays(ds[0], -1), to = addDays(ds[ds.length - 1], 1);
  return { from, to, days: diffDays(from, to) + 1 };
}
// 월 달력 칸: 일요일 시작, 앞쪽 빈칸은 ''
function monthCells(ym) {
  const first = ym + '-01', pad = new Date(first + 'T00:00:00Z').getUTCDay();
  const n = new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5), 0)).getUTCDate(); // 다음 달 0일 = 이번 달 말일
  return [...Array(pad).fill(''), ...Array.from({ length: n }, (_, i) => addDays(first, i))];
}
if (typeof module !== 'undefined') module.exports = { STATUSES, load, save, parseImport, dashboard, addDays, diffDays, ganttRange, monthCells, KEY };
