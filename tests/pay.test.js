// Run: node tests/pay.test.js   (no install). Web checkout server logic with an in-memory order book and a fake Toss.
const assert=require('assert'),fs=require('fs');
const {PACKS,makeOrder,confirmOrder}=require('../server/functions/pay');
const book=()=>{const m=new Map(),snap=p=>({exists:m.has(p),data:()=>m.get(p)});
  return {m,doc:p=>({path:p,get:async()=>snap(p),set:async o=>{m.set(p,{...o})},update:async o=>{m.set(p,{...m.get(p),...o})}}),
    runTransaction:async f=>f({get:async r=>snap(r.path),update:(r,o)=>m.set(r.path,{...m.get(r.path),...o})})}};
const rej=async(p,status)=>{try{await p}catch(e){return assert.strictEqual(e.status,status,e.message)}assert.fail('should have failed')};
(async()=>{
  // price list equals the client's
  const js=fs.readFileSync('web/js/data.js','utf8').match(/GEM_PACKS=\{([^}]*)\}/)[1];
  for(const [,id,g,w] of [...js.matchAll(/(gem\d+):\[(\d+),'₩([\d,]+)'\]/g)])assert.deepStrictEqual(PACKS[id],[+g,+w.replace(',','')],id);
  assert.strictEqual(Object.keys(PACKS).length,[...js.matchAll(/gem\d+:/g)].length,'same number of packs');
  const db=book();
  await rej(makeOrder(db,'u1','gem999'),400);
  const o=await makeOrder(db,'u1','gem100');assert.deepStrictEqual([o.amount,o.gems],[8900,100]);assert.match(o.orderId,/^[A-Za-z0-9_=-]{6,64}$/);
  const done=(over)=>async b=>({status:'DONE',orderId:b.orderId,totalAmount:b.amount,method:'간편결제',...over});
  let calls=0;const okToss=async b=>{calls++;return done()(b)};
  const pk={paymentKey:'pk',orderId:o.orderId,amount:8900};
  await rej(confirmOrder(db,okToss,'u2',pk),403);                                   // someone else's order
  await rej(confirmOrder(db,okToss,'u1',{...pk,amount:100}),400);                  // tampered amount in the return URL
  await rej(confirmOrder(db,okToss,'u1',{...pk,orderId:'nope_nope'}),404);
  assert.strictEqual(calls,0,'Toss never called for bad requests');
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',pk),{gems:100});
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',pk),{gems:100,already:true});
  assert.strictEqual(calls,1,'paid once, replay answered from the book');
  assert.strictEqual(db.m.get('orders/'+o.orderId).status,'paid');
  // Toss error: order goes back to ready so the player can retry
  const o2=await makeOrder(db,'u1','gem50'),k2={paymentKey:'pk2',orderId:o2.orderId,amount:4900};
  await rej(confirmOrder(db,async()=>{throw Object.assign(new Error('x'),{status:502})},'u1',k2),502);
  assert.strictEqual(db.m.get('orders/'+o2.orderId).status,'ready');
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',k2),{gems:50});
  // Toss says something else than a finished payment for this order: nothing is granted
  const o3=await makeOrder(db,'u1','gem200'),k3={paymentKey:'pk3',orderId:o3.orderId,amount:17500};
  await rej(confirmOrder(db,done({orderId:'other_order'}),'u1',k3),402);
  assert.strictEqual(db.m.get('orders/'+o3.orderId).status,'failed');
  // a second confirm while the first is still running
  const o4=await makeOrder(db,'u1','gem300'),k4={paymentKey:'pk4',orderId:o4.orderId,amount:24500};
  let release;const slow=b=>new Promise(r=>{release=()=>r(done()(b))});
  const first=confirmOrder(db,slow,'u1',k4);await new Promise(r=>setTimeout(r,10));
  await rej(confirmOrder(db,okToss,'u1',k4),409);release();assert.deepStrictEqual(await first,{gems:300});
  console.log('pay server ok');
})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
