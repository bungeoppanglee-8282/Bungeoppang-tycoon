// Run: npm i playwright && node tests/webpay.e2e.js   Web checkout in the browser with a fake Toss window and a fake server.
const {chromium}=require('playwright'),assert=require('assert'),path=require('path');
const URL='file://'+path.resolve(__dirname,'../web/index.html');
const fakeToss=`window.TossPayments=()=>({widgets:()=>({setAmount:async()=>{},renderPaymentMethods:async()=>{},renderAgreement:async()=>{},requestPayment:async a=>{window.__req=a}})});TossPayments.ANONYMOUS='ANON';`;
(async()=>{const b=await chromium.launch();
// server: sign-in, order, confirm. confirm answers come from the `confirm` queue ([status, body]); the last one repeats
const open=async(url,confirm=[[200,{gems:50,balance:50}]],keep)=>{
  const ctx=keep||await b.newContext({viewport:{width:430,height:900}}),p=await ctx.newPage();p.seen=[];
  await p.route('**/accounts:signUp*',r=>r.fulfill({json:{idToken:'tok',refreshToken:'r',localId:'u1',expiresIn:'3600'}}));
  await p.route('**/payOrder',r=>{p.seen.push(['payOrder',r.request().headers().authorization,r.request().postData()]);r.fulfill({json:{orderId:'o1',amount:4900,gems:50,orderName:'다이아 50개'}})});
  await p.route('**/payConfirm',r=>{const [st,body]=confirm.length>1?confirm.shift():confirm[0];p.seen.push(['payConfirm',r.request().postData()]);r.fulfill({status:st,json:body})});
  await p.addInitScript(fakeToss);await p.goto(url);await p.waitForTimeout(900);return p};
const ev=(p,f)=>p.evaluate(f);
// 1. no merchant key yet: pack stays on the shelf, buying says "not open", nothing is called
let p=await open(URL);
assert.strictEqual(await ev(p,()=>{shopTab='store';return shopItems().filter(i=>i.real).length}),4,'packs shown');
await ev(p,()=>buy('gem50'));await p.waitForTimeout(200);
assert.deepStrictEqual(p.seen,[],'no server call without a key');assert.ok(!(await p.locator('#pay-go').count()),'no payment window');
// 2. with a key: order from the server, then the Toss window opens with that order
await ev(p,()=>{PAY.clientKey='test_gck_x'});await ev(p,()=>buy('gem50'));await p.waitForTimeout(400);
assert.strictEqual(p.seen[0][0],'payOrder');assert.strictEqual(p.seen[0][1],'Bearer tok','signed-in request');assert.deepStrictEqual(JSON.parse(p.seen[0][2]),{packId:'gem50'},'client sends only the pack id, never a price');
await p.click('#pay-go');await p.waitForTimeout(100);
assert.strictEqual(await ev(p,()=>__req.orderId),'o1');assert.strictEqual(await ev(p,()=>S.gem||0),0,'nothing granted before the server confirms');
await p.context().close();
// 3. back from the payment window: server confirms, diamonds granted once, URL cleaned, reload does not grant again
let ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open(URL+'?paymentKey=pk&orderId=o1&amount=4900',undefined,ctx);await p.waitForTimeout(300);
assert.deepStrictEqual(JSON.parse(p.seen[0][1]),{paymentKey:'pk',orderId:'o1',amount:4900});
assert.strictEqual(await ev(p,()=>S.gem),50,'granted');assert.strictEqual(await ev(p,()=>location.search),'','URL cleaned');
await p.reload();await p.waitForTimeout(600);assert.strictEqual(await ev(p,()=>S.gem),50,'reload: no double grant');
await p.context().close();
// 4. connection lost on the way back: the order is kept and delivered at the next start, once
ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open(URL+'?paymentKey=pk&orderId=o1&amount=4900',[[503,{error:'x'}]],ctx);await p.waitForTimeout(300);
assert.ok(await ev(p,()=>!!S.payPend)&&(await ev(p,()=>S.gem||0))===0,'kept, not granted');
await p.close();p=await open(URL,[[200,{gems:50,balance:50}]],ctx);await p.waitForTimeout(400);
assert.strictEqual(await ev(p,()=>[S.gem,S.payPend]).then(x=>x.join()),'50,','delivered on the next start');await p.context().close();
// 5. server refuses for good (403): dropped, nothing granted, no endless retry
ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open(URL+'?paymentKey=pk&orderId=o1&amount=4900',[[403,{error:'not your order'}]],ctx);await p.waitForTimeout(300);
assert.deepStrictEqual(await ev(p,()=>[S.gem||0,S.payPend]),[0,null]);await p.context().close();
// 6. failed / cancelled in the window (no paymentKey): nothing is sent
ctx=await b.newContext({viewport:{width:430,height:900}});
p=await open(URL+'?code=PAY_PROCESS_CANCELED&message=x&orderId=o1',undefined,ctx);await p.waitForTimeout(300);
assert.deepStrictEqual(p.seen,[],'no confirm call');assert.strictEqual(await ev(p,()=>location.search),'');
console.log('web checkout ok');await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
