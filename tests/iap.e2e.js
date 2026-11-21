// Run: npm i playwright && node tests/iap.e2e.js   Checks diamonds: Play packs (js/iap.js) and spending them in the shop, with a fake Billing plugin.
const {chromium}=require('playwright'),assert=require('assert'),path=require('path');
const URL='file://'+path.resolve(__dirname,'../web/index.html');
// fake plugin: Play knows gem50/gem100; `owned` = paid but not delivered; finishFails makes finish() reject
const fake=(opt)=>`window.__calls=[];window.__opt=${JSON.stringify(opt)};
window.Capacitor={isNativePlatform:()=>true,Plugins:{Billing:{
 setup:async()=>({prices:{gem50:'₩p50',gem100:'₩p100',gem200:'₩p200',gem300:'₩p300'},owned:window.__opt.owned||[]}),
 buy:async({id})=>{if(window.__opt.cancel)throw Object.assign(new Error('x'),{code:'cancel'});return{id,token:'tok-'+id,acked:false}},
 finish:async(a)=>{window.__calls.push(a);if(window.__opt.finishFails)throw new Error('x')}}}};`;
(async()=>{const b=await chromium.launch();
const open=async(opt)=>{const p=await b.newPage({viewport:{width:430,height:900}});await p.addInitScript(fake(opt));await p.goto(URL);await p.waitForTimeout(900);return p};
const ev=(p,f)=>p.evaluate(f);
let p=await open({});
assert.deepStrictEqual(await ev(p,()=>{shopTab='store';return shopItems().filter(i=>i.real).map(i=>i.real)}),['₩p50','₩p100','₩p200','₩p300'],'four packs, Play prices');
assert.strictEqual(await ev(p,()=>shopItems().filter(i=>i.gem).length),7,'7 items priced in diamonds');
await ev(p,()=>buy('gem50'));await p.waitForTimeout(200);
assert.strictEqual(await ev(p,()=>S.gem),50,'50 diamonds granted');
assert.deepStrictEqual(await ev(p,()=>__calls),[{token:'tok-gem50',consume:true}],'pack consumed after grant');
assert.deepStrictEqual(await ev(p,()=>S.iapTok),[],'token cleared');
// spending needs a confirmation tap
await ev(p,()=>buy('bake'));assert.ok(await p.locator('[data-act="gemok"]').isVisible(),'confirm popup shown');
assert.deepStrictEqual(await ev(p,()=>[S.gem,S.bake||0]),[50,0],'nothing spent before confirming');
await p.click('[data-act="gemno"]');assert.deepStrictEqual(await ev(p,()=>[S.gem,S.bake||0]),[50,0],'cancel spends nothing');
await ev(p,()=>buy('bake'));await p.click('[data-act="gemok"]');assert.deepStrictEqual(await ev(p,()=>[S.gem,S.bake]),[10,20],'confirm: bake pack costs 40');
await ev(p,()=>buy('ice'));assert.deepStrictEqual(await ev(p,()=>[S.gem,S.ice||0]),[10,0],'too few diamonds: nothing spent');
assert.ok(!(await p.locator('[data-act="gemok"]').isVisible()),'no confirm popup when too poor');
await ev(p,()=>{S.gem=100;buy('minibag')});await ev(p,()=>{gemSpend();gemSpend()});assert.strictEqual(await ev(p,()=>S.gem),80,'double tap spends once');
await ev(p,()=>{S.gem=50;buy('noads')});await ev(p,()=>gemSpend());assert.ok(await ev(p,()=>S.noads)&&await ev(p,()=>S.gem)===0,'permanent item for 50');
await ev(p,()=>{S.gem=100;buy('noads')});assert.ok(!(await p.locator('[data-act="gemok"]').isVisible()),'already owned: no charge, no popup');
await p.close();
p=await open({cancel:true});await ev(p,()=>buy('gem100'));await p.waitForTimeout(200);
assert.strictEqual(await ev(p,()=>S.gem||0),0,'cancel grants nothing');await p.close();
// paid before a crash: delivered once even if consume keeps failing across restarts
p=await open({owned:[{id:'gem100',token:'t9',acked:false}],finishFails:true});
assert.strictEqual(await ev(p,()=>S.gem),100,'undelivered pack granted at start');
await ev(p,()=>iapInit());await p.waitForTimeout(200);
assert.strictEqual(await ev(p,()=>S.gem),100,'not granted twice');
assert.deepStrictEqual(await ev(p,()=>S.iapTok),['t9'],'token kept until consume works');await p.close();
p=await open({owned:[{id:'bake',token:'t1',acked:true}]});
assert.strictEqual(await ev(p,()=>S.bake||0),0,'unknown Play product grants nothing');await p.close();
// no plugin (web / Toss): nothing is hidden; packs show list prices; buying says payment is not open and grants nothing
p=await b.newPage();await p.goto(URL);await p.waitForTimeout(800);
assert.deepStrictEqual(await ev(p,()=>{shopTab='store';return shopItems().filter(i=>i.real).map(i=>i.real)}),['₩4,900','₩8,900','₩17,500','₩24,500'],'packs shown with list prices');
assert.strictEqual(await ev(p,()=>shopItems().filter(i=>i.gem).length),7,'diamond items shown');
await ev(p,()=>buy('gem300'));assert.ok((await p.locator('#sheet').innerText()).length>0&&(await ev(p,()=>S.gem||0))===0,'notice shown, nothing granted');
console.log('diamond flow ok');await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
