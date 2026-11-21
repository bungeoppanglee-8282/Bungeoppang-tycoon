// Run: npm i playwright && node tests/iap.e2e.js   Diamonds end to end: Google Play packs, server wallet, spending with confirmation, interrupted requests.
// A small fake wallet server (same rules as server/functions/wallet.js) stands in for Firebase; a fake plugin stands in for Google Play.
const {chromium}=require('playwright'),assert=require('assert'),path=require('path');
const URL='file://'+path.resolve(__dirname,'../web/index.html');
const COST={minibag:20,attpack:50,bake:40,ice:30,noads:50,pat2:40,rack2:30},PACK={gem50:50,gem100:100,gem200:200,gem300:300};
const fakePlay=opt=>`window.__calls=[];window.__opt=${JSON.stringify(opt)};
window.Capacitor={isNativePlatform:()=>true,Plugins:{Billing:{
 setup:async()=>({prices:{gem50:'₩p50',gem100:'₩p100',gem200:'₩p200',gem300:'₩p300'},owned:window.__opt.owned||[]}),
 buy:async({id})=>{if(window.__opt.cancel)throw Object.assign(new Error('x'),{code:'cancel'});return{id,token:'tok-'+id+'-'+'0'.repeat(30),acked:false}},
 finish:async a=>{window.__calls.push(a);if(window.__opt.finishFails)throw new Error('x')}}}};`;
const server=()=>{const st={gems:0,done:new Set(),log:[],down:false,loseNext:false};
  const reply=(r,code,json)=>r.fulfill({status:code,json});
  return {st,attach:async p=>{
    await p.route('**/accounts:signUp*',r=>r.fulfill({json:{idToken:'tok',refreshToken:'r',localId:'u1',expiresIn:'3600'}}));
    await p.route(/cloudfunctions\.net\/(\w+)$/,r=>{const fn=r.request().url().split('/').pop(),b=JSON.parse(r.request().postData()||'{}');
      if(st.down)return r.abort();
      if(fn==='walletGet')return reply(r,200,{gems:st.gems});
      if(fn==='walletPlay'){const id='play_'+b.token;if(!PACK[b.productId])return reply(r,400,{error:'unknown pack'});
        if(st.done.has(id))return reply(r,200,{gems:PACK[b.productId],balance:st.gems,already:true});
        st.done.add(id);st.gems+=PACK[b.productId];st.log.push(['buy',PACK[b.productId]]);return reply(r,200,{gems:PACK[b.productId],balance:st.gems})}
      if(fn==='walletSpend'){const id='spend_'+b.reqId;if(!COST[b.itemId])return reply(r,400,{error:'unknown item'});
        if(st.done.has(id))return reply(r,200,{balance:st.gems,already:true});
        if(st.gems<COST[b.itemId])return reply(r,402,{error:'not enough diamonds'});
        st.done.add(id);st.gems-=COST[b.itemId];st.log.push(['spend',-COST[b.itemId]]);
        if(st.loseNext){st.loseNext=false;return r.abort()}                       // charged, but the answer never arrives
        return reply(r,200,{balance:st.gems})}
      if(fn==='walletLog')return reply(r,200,{entries:st.log.map(([type,delta],i)=>({type,delta,source:type==='buy'?'play':'game',item:type==='buy'?'gem50':'bake',at:Date.now()-i}))});
      r.fulfill({status:404,json:{}})})}}};
(async()=>{const b=await chromium.launch();
const open=async(opt,srv,ctx)=>{ctx=ctx||await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();await srv.attach(p);await p.addInitScript(fakePlay(opt));await p.goto(URL);await p.waitForTimeout(900);return p};
const ev=(p,f,a)=>p.evaluate(f,a);
let srv=server(),p=await open({},srv);
assert.deepStrictEqual(await ev(p,()=>{shopTab='store';return shopItems().filter(i=>i.real).map(i=>i.real)}),['₩p50','₩p100','₩p200','₩p300'],'four packs, Play prices');
assert.strictEqual(await ev(p,()=>shopItems().filter(i=>i.gem).length),7,'7 items priced in diamonds');
// buy a pack: the server holds the diamonds, the phone shows its copy
await ev(p,()=>buy('gem50'));await p.waitForTimeout(400);
assert.strictEqual(srv.st.gems,50,'server wallet credited');assert.strictEqual(await ev(p,()=>S.gem),50,'phone copy follows the server');
assert.deepStrictEqual(await ev(p,()=>__calls.map(c=>c.consume)),[true],'pack consumed in Play after the server counted it');
// spend: needs a confirmation tap; the server charges, then the item is given
await ev(p,()=>buy('bake'));assert.ok(await p.locator('[data-act="gemok"]').isVisible(),'confirm popup');
assert.strictEqual(srv.st.gems,50,'nothing charged before confirming');
await p.click('[data-act="gemno"]');assert.strictEqual(srv.st.gems,50);
await ev(p,()=>buy('bake'));await p.click('[data-act="gemok"]');await p.waitForTimeout(400);
assert.deepStrictEqual([srv.st.gems,await ev(p,()=>[S.gem,S.bake])],[10,[10,20]],'server charged 40, item given, copy updated');
await ev(p,()=>buy('ice'));assert.ok(!(await p.locator('[data-act="gemok"]').isVisible()),'too poor: no popup');assert.strictEqual(srv.st.gems,10);
await ev(p,()=>{buy('minibag');gemSpend();gemSpend()});await p.waitForTimeout(400);assert.strictEqual(srv.st.gems,10,'double tap: charged at most once (10 < 20, refused)');
// history sheet
await ev(p,()=>gemLog());await p.waitForTimeout(300);assert.ok((await p.locator('.logrow').count())>=2,'history rows shown');
await p.context().close();
// the answer to a spend is lost: the same request is retried at the next start, charged once, item given once
srv=server();srv.st.gems=100;let ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open({},srv,ctx);await ev(p,()=>{S.walletOn=true;S.gem=100;save()});srv.st.loseNext=true;
await ev(p,()=>{shopTab='store';buy('bake')});await p.click('[data-act="gemok"]');await p.waitForTimeout(500);
assert.deepStrictEqual([srv.st.gems,await ev(p,()=>S.bake||0),await ev(p,()=>!!S.spendPend)],[60,0,true],'charged on the server, item still pending on the phone');
await p.close();p=await open({},srv,ctx);await p.waitForTimeout(400);
assert.deepStrictEqual([srv.st.gems,await ev(p,()=>S.bake),await ev(p,()=>S.spendPend),await ev(p,()=>S.gem)],[60,20,null,60],'retry: not charged twice, item given once');
await p.context().close();
// offline: spending needs the server, nothing is given for free, the request is kept
srv=server();srv.st.gems=100;srv.st.down=true;
p=await open({},srv);await ev(p,()=>{S.walletOn=true;S.gem=100;shopTab='store';buy('bake')});await p.click('[data-act="gemok"]');await p.waitForTimeout(400);
assert.deepStrictEqual([await ev(p,()=>S.bake||0),await ev(p,()=>!!S.spendPend),srv.st.gems],[0,true,100],'offline: nothing given, request kept, nothing charged');
await p.context().close();
// Play cancel; and a purchase paid before the app died, delivered once even if consume keeps failing
srv=server();p=await open({cancel:true},srv);await ev(p,()=>buy('gem100'));await p.waitForTimeout(300);assert.strictEqual(srv.st.gems,0,'cancel: nothing');await p.context().close();
srv=server();ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open({owned:[{id:'gem100',token:'t'.repeat(40),acked:false}],finishFails:true},srv,ctx);await p.waitForTimeout(300);
assert.deepStrictEqual([srv.st.gems,await ev(p,()=>S.gem)],[100,100],'undelivered purchase credited at start');
await ev(p,()=>iapInit());await p.waitForTimeout(300);assert.strictEqual(srv.st.gems,100,'not credited twice');await p.context().close();
srv=server();p=await open({owned:[{id:'bake',token:'t'.repeat(40),acked:true}]},srv);assert.strictEqual(srv.st.gems,0,'unknown Play product grants nothing');await p.context().close();
// paid but the server is down: the purchase stays in Play (not consumed) and the player is told
srv=server();srv.st.down=true;p=await open({},srv);await ev(p,()=>buy('gem50'));await p.waitForTimeout(400);
assert.deepStrictEqual(await ev(p,()=>__calls),[],'server down: Play purchase left unconsumed');await p.context().close();
// no Play plugin and no wallet yet: nothing is hidden, nothing is asked of the server
srv=server();let calls=0;const pg=await (await b.newContext()).newPage();pg.on('request',r=>/cloudfunctions|identitytoolkit/.test(r.url())&&calls++);
await pg.goto(URL);await pg.waitForTimeout(800);
assert.strictEqual(await ev(pg,()=>{shopTab='store';return shopItems().filter(i=>i.real||i.gem).length}),11,'4 packs + 7 items shown');assert.strictEqual(calls,0,'no account is created just for looking');
console.log('diamond wallet flow ok');await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
