// Run: npm i playwright && node tests/iap.e2e.js   Checks the Play-billing flow in js/iap.js against a fake Billing plugin.
const {chromium}=require('playwright'),assert=require('assert'),path=require('path');
const URL='file://'+path.resolve(__dirname,'../web/index.html')+'?authtest=1';
// fake plugin: prices for every id; `owned` is what Play says is paid but not delivered; finishFails makes finish() reject
const fake=(opt)=>`window.__calls=[];window.__opt=${JSON.stringify(opt)};
window.Capacitor={isNativePlatform:()=>true,Plugins:{Billing:{
 setup:async()=>({prices:Object.fromEntries(['noads','pat2','rack2','minibag','attpack','bake','ice'].map(i=>[i,'₩'+i])),owned:window.__opt.owned||[]}),
 buy:async({id})=>{if(window.__opt.cancel)throw Object.assign(new Error('x'),{code:'cancel'});return{id,token:'tok-'+id,acked:false}},
 finish:async(a)=>{window.__calls.push(a);if(window.__opt.finishFails)throw new Error('x')}}}};`;
(async()=>{const b=await chromium.launch();
const open=async(opt,pre)=>{const p=await b.newPage({viewport:{width:430,height:900}});await p.addInitScript(fake(opt));if(pre)await p.addInitScript(pre);await p.goto(URL);await p.waitForTimeout(900);return p};
let p=await open({});
assert.strictEqual(await p.evaluate(()=>{shopTab='store';return shopItems().filter(i=>i.real).length}),7,'7 paid items shown');
assert.strictEqual(await p.evaluate(()=>shopItems().find(i=>i.id==='bake').real),'₩bake','Play price replaces label');
await p.evaluate(()=>buy('bake'));await p.waitForTimeout(200);
assert.strictEqual(await p.evaluate(()=>S.bake),20,'bake pack granted');
assert.deepStrictEqual(await p.evaluate(()=>__calls),[{token:'tok-bake',consume:true}],'pack consumed after grant');
assert.deepStrictEqual(await p.evaluate(()=>S.iapTok),[],'token cleared after consume');
await p.evaluate(()=>buy('noads'));await p.waitForTimeout(200);
assert.ok(await p.evaluate(()=>S.noads),'perk granted');assert.strictEqual((await p.evaluate(()=>__calls)).pop().consume,false,'perk acknowledged, not consumed');
await p.close();
p=await open({cancel:true});const before=await p.evaluate(()=>S.ice||0);await p.evaluate(()=>buy('ice'));await p.waitForTimeout(200);
assert.strictEqual(await p.evaluate(()=>S.ice||0),before,'cancel grants nothing');await p.close();
// paid before a crash: delivered once even if consume keeps failing across restarts
p=await open({owned:[{id:'ice',token:'t9',acked:false}],finishFails:true});
assert.strictEqual(await p.evaluate(()=>S.ice),3,'undelivered pack granted at start');
await p.evaluate(()=>iapInit());await p.waitForTimeout(200);
assert.strictEqual(await p.evaluate(()=>S.ice),3,'not granted twice');
assert.deepStrictEqual(await p.evaluate(()=>S.iapTok),['t9'],'token kept until consume works');await p.close();
// restore: permanent item bought earlier, flag lost (reinstall)
p=await open({owned:[{id:'rack2',token:'t1',acked:true}]});
assert.ok(await p.evaluate(()=>S.rack2),'permanent item restored');assert.strictEqual((await p.evaluate(()=>__calls)).length,0,'already acknowledged: no finish call');await p.close();
// no plugin: paid items hidden
p=await b.newPage();await p.goto(URL);await p.waitForTimeout(800);
assert.strictEqual(await p.evaluate(()=>{shopTab='store';return shopItems().filter(i=>i.real).length}),0,'hidden without Play');
console.log('iap flow ok');await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
