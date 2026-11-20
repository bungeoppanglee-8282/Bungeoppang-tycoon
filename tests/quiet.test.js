// Run: node tests/quiet.test.js   (no install needed). Checks the allowed notification windows, server and in-game, stay in sync.
const fs=require('fs'),assert=require('assert');
const cut=(f,re)=>fs.readFileSync(f,'utf8').match(re)[0];
const server=new Function(cut('server/functions/index.js',/const kst=[^\n]*\n/)+cut('server/functions/index.js',/const WINDOWS=[^\n]*\nfunction quiet[^\n]*\n/)+'return quiet')();
const local=new Function(cut('web/js/live.js',/\/\/#quiet\n[\s\S]*?\/\/#end/)+'\nreturn outOfQuiet')();
const kst=(h,m)=>Date.UTC(2026,10,20,h-9,m);            // Korean clock -> UTC ms
for(const [h,m,quiet] of [[7,59,true],[8,0,false],[8,49,false],[8,50,true],[11,54,true],[11,55,false],[13,0,false],[13,1,true],[17,59,true],[18,0,false],[22,29,false],[22,30,true],[3,0,true]])
  assert.strictEqual(server(kst(h,m)),quiet,`server ${h}:${m}`);
const at=(h,m)=>new Date(2026,10,20,h,m).getTime(), day=(n,h,m)=>new Date(2026,10,20+n,h,m).getTime();
assert.strictEqual(local(at(12,30)),at(12,30));          // inside a window: unchanged
assert.strictEqual(local(at(9,30)),at(11,55));           // work hours: wait for lunch
assert.strictEqual(local(at(14,0)),at(18,0));            // afternoon: wait for evening
assert.strictEqual(local(at(23,0)),day(1,8,0));          // night: tomorrow morning
assert.strictEqual(local(at(3,0)),at(8,0));              // early morning: this morning
console.log('quiet windows ok');
