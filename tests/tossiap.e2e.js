// Run: npm i playwright && node tests/tossiap.e2e.js   Toss app build in the browser: fake Toss SDK (window.TossSDK) + fake server (same rules as server/functions/tossiap.js).
// The page is served over http with build.js swapped to BUILD='toss'; nothing real is called.
const {chromium}=require('playwright'),assert=require('assert'),path=require('path'),fs=require('fs'),http=require('http');
const WEB=path.resolve(__dirname,'../web'),MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.ogg':'audio/ogg'};
const web=http.createServer((q,r)=>{const f=path.join(WEB,decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/,'/index.html'));
  if(!f.startsWith(WEB)||!fs.existsSync(f)){r.statusCode=404;return r.end()}
  r.setHeader('Content-Type',MIME[path.extname(f)]||'application/octet-stream');
  r.end(f.endsWith('build.js')?"const BUILD='toss';":fs.readFileSync(f))});
const PACK={gem50:50,gem100:100,gem200:200,gem300:300};
// the Toss account's wallet lives on the fake server, like the real one
const server=()=>{const st={gems:0,paid:{},done:new Set(),calls:[],signUps:0,customSignIns:0,down:false,codes:0};
  return {st,attach:async p=>{
    await p.route('**/accounts:signUp*',r=>{st.signUps++;r.fulfill({json:{idToken:'anon',refreshToken:'ra',localId:'anon1',expiresIn:'3600'}})});
    await p.route('**/accounts:signInWithCustomToken*',r=>{st.customSignIns++;const b=JSON.parse(r.request().postData());st.lastToken=b.token;r.fulfill({json:{idToken:'tid',refreshToken:'rt',localId:'toss_abc',expiresIn:'3600'}})});
    await p.route('**/securetoken.googleapis.com/**',r=>r.fulfill({json:{id_token:'tid',refresh_token:'rt',user_id:'toss_abc',expires_in:'3600'}}));
    await p.route(/cloudfunctions\.net\/(\w+)$/,r=>{const fn=r.request().url().split('/').pop(),b=JSON.parse(r.request().postData()||'{}'),auth=r.request().headers().authorization;
      st.calls.push([fn,b,auth]);
      if(st.down)return r.abort();
      if(fn==='tossLogin')return r.fulfill({json:{token:'custom-'+b.code,uid:'toss_abc'}});
      if(auth!=='Bearer tid')return r.fulfill({status:401,json:{error:'sign in first'}});
      if(fn==='walletGet')return r.fulfill({json:{gems:st.gems}});
      if(fn==='tossGrant'){const o=st.paid[b.orderId];if(!o)return r.fulfill({status:404,json:{error:'no such order'}});
        if(o.status==='REFUNDED')return r.fulfill({status:402,json:{error:'order is not paid'}});
        if(st.done.has(b.orderId))return r.fulfill({json:{gems:PACK[o.pack],balance:st.gems,already:true}});
        st.done.add(b.orderId);st.gems+=PACK[o.pack];return r.fulfill({json:{gems:PACK[o.pack],balance:st.gems}})}
      r.fulfill({status:404,json:{}})})}}};
// fake Toss SDK. opt: orders the "payment screen" creates, pending / completed lists, cancel
const fakeSdk=opt=>`window.__t={sdk:[],grantReturn:null};const O=${JSON.stringify(opt)};
window.__music=[];window.TossSDK={
 User:{createAnonymousKeyAuthCode:async()=>{__t.sdk.push('code');return{code:'code'+__t.sdk.length+'xx',expiresIn:300}}},
 IAP:{
  getProductItemList:async()=>({products:[{sku:'sku50',displayAmount:'4,900원',displayName:'다이아 50개',iconUrl:'',description:''}]}),
  createOneTimePurchaseOrder:p=>{__t.sdk.push('order:'+p.options.sku);__t.heldDuringOrder=BGM.hold;
    setTimeout(async()=>{
      if(O.cancel)return p.onError(Object.assign(new Error('x'),{code:'USER_CANCELED'}));
      __t.grantReturn=p.options.processProductGrant({orderId:O.orderId});   // must answer at once: the payment screen waits for it
      await Promise.resolve(__t.grantReturn);
      p.onEvent({type:'success',data:{orderId:O.orderId,displayName:'x',displayAmount:'4,900원',amount:4900,currency:'KRW',fraction:0,miniAppIconUrl:null}})},20);
    return()=>__t.sdk.push('cleanup')},
  getPendingOrders:async()=>({orders:O.pending||[]}),
  completeProductGrant:async a=>{__t.sdk.push('complete:'+a.params.orderId);return true},
  getCompletedOrRefundedOrders:async a=>({hasNext:false,nextKey:null,orders:O.completed||[]})}}`;
(async()=>{await new Promise(r=>web.listen(0,'127.0.0.1',r));const URL='http://127.0.0.1:'+web.address().port+'/index.html';
const b=await chromium.launch();
const open=async(opt,srv,ctx,sdk=true)=>{ctx=ctx||await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();await srv.attach(p);if(sdk)await p.addInitScript(fakeSdk(opt));await p.goto(URL);await p.waitForTimeout(900);return p};
const ev=(p,f,a)=>p.evaluate(f,a);
const ORD='11111111-2222-4333-8444-555555555555';
let srv=server(),p=await open({orderId:ORD},srv);srv.st.paid[ORD]={pack:'gem50'};
assert.strictEqual(await ev(p,()=>BUILD),'toss');
// 1. the product id is not registered yet: the pack stays on the shelf, buying says "preparing", the Toss payment screen is never opened
assert.strictEqual(await ev(p,()=>{shopTab='store';return shopItems().filter(i=>i.real).length}),4,'four packs shown');
await ev(p,()=>buy('gem50'));await p.waitForTimeout(200);
assert.ok((await ev(p,()=>__t.sdk)).every(x=>!x.startsWith('order:')),'no payment opened without a product id');
assert.match(await p.locator('.pause .sub').first().innerText(),/준비|prepared/,'says it is being prepared');
assert.ok(srv.st.calls.every(c=>c[0]!=='tossGrant'));
// the console price replaces the list price once the id is known (tossRecover loads it at start; here set the id, then the next start picks it up)
// 2. buy: signs in with Toss (never an anonymous account), the payment screen takes the sku, the grant callback answers at once, then the server credits once
await ev(p,()=>{TOSS_SKU.gem50='sku50';closeSheet(true)});
await ev(p,()=>buy('gem50'));await p.waitForTimeout(700);
assert.strictEqual(await ev(p,()=>__t.heldDuringOrder),true,'music held while the payment screen is open');assert.strictEqual(await ev(p,()=>BGM.hold),false,'music resumes after the payment');assert.strictEqual(srv.st.signUps,0,'no anonymous sign-up in the Toss build');assert.strictEqual(srv.st.customSignIns,1);assert.match(srv.st.lastToken,/^custom-code/,'signed in with the token our server minted');
assert.ok((await ev(p,()=>__t.sdk)).includes('order:sku50'),'payment opened with the product id');
assert.strictEqual(await ev(p,()=>__t.grantReturn),true,'the grant callback answers true at once (not a promise waiting for the server)');
assert.deepStrictEqual(srv.st.calls.filter(c=>c[0]==='tossGrant').map(c=>c[1]),[{orderId:ORD}],'the app sends only the order id, never a price or a pack');
assert.strictEqual(srv.st.gems,50);assert.strictEqual(await ev(p,()=>S.gem),50,'phone copy follows the server');assert.deepStrictEqual(await ev(p,()=>S.tossPend),[],'nothing left pending');
assert.ok((await ev(p,()=>__t.sdk)).includes('cleanup'),'SDK resources released');
await p.context().close();
// 3. the payment went through but our server was unreachable: kept, "will arrive" message, delivered once at the next start
srv=server();srv.st.paid[ORD]={pack:'gem50'};srv.st.down=false;
let ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open({orderId:ORD},srv,ctx);await ev(p,()=>{TOSS_SKU.gem50='sku50';shopTab='store'});
srv.st.down=true;await ev(p,()=>buy('gem50'));await p.waitForTimeout(700);
assert.deepStrictEqual(await ev(p,()=>[S.gem||0,S.tossPend]),[0,[ORD]],'paid order kept, nothing shown as delivered');
srv.st.down=false;await p.close();p=await open({orderId:ORD},srv,ctx);
assert.deepStrictEqual(await ev(p,()=>[S.gem,S.tossPend]),[50,[]],'delivered at the next start');assert.strictEqual(srv.st.gems,50,'once');
await p.close();p=await open({orderId:ORD},srv,ctx);assert.strictEqual(srv.st.gems,50,'a later start does not deliver again');
await p.context().close();
// 4. app closed right after paying (no pending record on the phone): Toss' completed list brings the order back; refunded ones are ignored
srv=server();srv.st.paid[ORD]={pack:'gem100'};srv.st.paid['22222222-2222-4333-8444-555555555555']={pack:'gem50',status:'REFUNDED'};
p=await open({completed:[{orderId:ORD,sku:'s',status:'COMPLETED',date:'2026-11-21T10:00:00'},{orderId:'22222222-2222-4333-8444-555555555555',sku:'s',status:'REFUNDED',date:'2026-11-21T11:00:00'}]},srv);
assert.strictEqual(srv.st.gems,100,'the completed order was delivered');assert.strictEqual(await ev(p,()=>S.gem),100);
assert.ok(!srv.st.calls.some(c=>c[0]==='tossGrant'&&c[1].orderId.startsWith('2222')),'refunded order is not even asked about');
// 5. paid but not delivered on Toss' side (pending list): delivered by us, then Toss is told
srv=server();srv.st.paid[ORD]={pack:'gem200'};
p=await open({pending:[{orderId:ORD,sku:'s'}]},srv);
assert.strictEqual(srv.st.gems,200);assert.ok((await ev(p,()=>__t.sdk)).includes('complete:'+ORD),'Toss told the delivery is complete');
await p.context().close();
// 6. reinstall / new phone: empty phone storage, the Toss account is the same, the balance comes back from the server
srv=server();srv.st.gems=350;
p=await open({},srv);assert.strictEqual(await ev(p,()=>S.gem),350,'balance restored from the server');
await p.context().close();
// 7. cancel in the payment screen: nothing is asked of the server, no error message
srv=server();p=await open({cancel:true},srv);await ev(p,()=>{TOSS_SKU.gem50='sku50';shopTab='store'});
await ev(p,()=>buy('gem50'));await p.waitForTimeout(400);
assert.ok(srv.st.calls.every(c=>c[0]!=='tossGrant'),'no grant call');assert.strictEqual(await ev(p,()=>document.querySelectorAll('.toast.show,#toast:not([hidden])').length>0&&/결제하지|Purchase failed/.test(document.body.innerText)),false,'no failure message for a cancel');
await p.context().close();
// 8. console price on the shelf: after the id is known, the next start shows Toss' own price
srv=server();ctx=await b.newContext({viewport:{width:430,height:900}});
await ctx.addInitScript(()=>{});p=await open({},srv,ctx);
await ev(p,()=>{TOSS_SKU.gem50='sku50';shopTab='store'});await ev(p,()=>tossRecover());
assert.strictEqual(await ev(p,()=>{shopTab='store';return shopItems().find(i=>i.id==='gem50').real}),'4,900원','price from the Toss console');
assert.strictEqual(await ev(p,()=>shopItems().find(i=>i.id==='gem100').real),'₩8,900','other packs keep the list price until their id is known');
await p.context().close();
// 9. outside the Toss app (no SDK): packs shown, buying says "preparing", nothing is called and no account is made
srv=server();p=await open({},srv,null,false);await ev(p,()=>{TOSS_SKU.gem50='sku50';shopTab='store'});
await ev(p,()=>buy('gem50'));await p.waitForTimeout(300);
assert.deepStrictEqual([srv.st.calls.length,srv.st.signUps,srv.st.customSignIns],[0,0,0],'no calls without the Toss SDK');
await p.context().close();
console.log('toss app purchase ok');await b.close();web.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
