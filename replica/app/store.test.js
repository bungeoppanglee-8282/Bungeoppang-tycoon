// 실행: node store.test.js
const assert = require('assert');
const { load, save, parseImport, dashboard, KEY } = require('./store.js');
const mem = { s: {}, getItem(k) { return this.s[k] ?? null; }, setItem(k, v) { this.s[k] = v; } };

assert.deepStrictEqual(load(mem), { me: '', projects: [], tasks: [] }, '빈 저장소');
mem.s[KEY] = '{broken'; assert.deepStrictEqual(load(mem).tasks, [], '깨진 데이터는 빈 값');
const d = { me: 'A', projects: [{ id: 'p', name: 'P', members: ['A', 'B'] }], tasks: [
  { id: '1', kind: 'task', title: '지연', status: 'doing', assignee: 'B', due: '2026-11-20', comments: [] },
  { id: '2', kind: 'task', title: '이번주', status: 'wait', assignee: 'B', due: '2026-11-25', comments: [] },
  { id: '3', kind: 'task', title: '완료', status: 'done', assignee: 'A', due: '2026-11-01', comments: [] },
  { id: '4', kind: 'post', title: '글', status: 'wait', comments: [] },
  { id: '5', kind: 'task', title: '미배정', status: 'wait', comments: [] }] };
save(mem, d); assert.deepStrictEqual(load(mem), d, '저장 왕복');
assert.deepStrictEqual(dashboard(d.tasks, '2026-11-21'), {
  B: { open: 2, overdue: 1, thisWeek: 1, done: 0 },
  A: { open: 0, overdue: 0, thisWeek: 0, done: 1 },
  미지정: { open: 1, overdue: 0, thisWeek: 0, done: 0 } });
assert.throws(() => parseImport('nope'), /JSON/);
assert.throws(() => parseImport('{"projects":[]}'), /형식/);
assert.deepStrictEqual(parseImport(JSON.stringify(d)), d);
console.log('ALL STORE TESTS PASSED');
const { ganttRange, monthCells } = require('./store.js');
assert.deepStrictEqual(ganttRange([{ start: '2026-11-03', due: '2026-11-05' }, { due: '2026-11-10' }, {}]), { from: '2026-11-02', to: '2026-11-11', days: 10 });
assert.strictEqual(ganttRange([{}]), null);
const nov = monthCells('2026-11'); // 2026-11-01 = 일요일
assert.strictEqual(nov[0], '2026-11-01'); assert.strictEqual(nov.length, 30);
const feb = monthCells('2028-02'); // 윤년, 2028-02-01 = 화요일
assert.deepStrictEqual(feb.slice(0, 3), ['', '', '2028-02-01']); assert.strictEqual(feb.at(-1), '2028-02-29');
assert.strictEqual(monthCells('2026-12').at(-1), '2026-12-31');
console.log('ALL VIEW HELPER TESTS PASSED');
