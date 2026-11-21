// Run: node tests/pay.test.js   (no install). Server money logic (web checkout, Play credit, wallet) with an in-memory Firestore and fake Toss / Play.
const assert=require('assert'),fs=require('fs');
const {PACKS,COSTS}=require('../server/functions/catalog');
const {makeOrder,confirmOrder}=require('../server/functions/pay');
const W=require('../server/functions/wallet');
const book=()=>{const m=new Map(),snap=p=>({exists:m.has(p),data:()=>m.get(p)}),
  doc=p=>({path:p,get:async()=>snap(p),set:async o=>{m.set(p,{...o})},update:async o=>{m.set(p,{...m.get(p),...o})}});
  return {m,doc,
    collection:p=>({orderBy:()=>({limit:n=>({get:async()=>({docs:[...m].filter(([k])=>k.startsWith(p+'/')).map(([,v])=>({data:()=>v})).sort((a,b)=>b.data().at-a.data().at).slice(0,n)})})})}),
    runTransaction:async f=>{const w=[],r=await f({get:async ref=>snap(ref.path),set:(ref,o)=>w.push([ref.path,o]),update:(ref,o)=>w.push([ref.path,{...m.get(ref.path),...o}])});w.forEach(([k,v])=>m.set(k,{...v}));return r}}};
const rej=async(p,status)=>{try{await p}catch(e){return assert.strictEqual(e.status,status,e.message)}assert.fail('should have failed')};
(async()=>{
  // the server's price lists equal the client's
  const data=fs.readFileSync('web/js/data.js','utf8');
  for(const [,id,g,w] of data.matchAll(/(gem\d+):\[(\d+),'₩([\d,]+)'\]/g))assert.deepStrictEqual(PACKS[id],[+g,+w.replace(',','')],id);
  assert.strictEqual(Object.keys(PACKS).length,[...data.matchAll(/gem\d+:\[/g)].length,'same number of packs');
  const cost=data.match(/GEM_COST=\{([^}]*)\}/)[1],perks=data.match(/PERKS=\{(.*)\};/)[1];
  const client={...Object.fromEntries([...cost.matchAll(/(\w+):(\d+)/g)].map(m=>[m[1],+m[2]])),...Object.fromEntries([...perks.matchAll(/(\w+):\['\w+',(\d+),/g)].map(m=>[m[1],+m[2]]))};
  assert.deepStrictEqual(COSTS,client,'item prices equal the client');

  // ---- web checkout: Toss
  const db=book();
  await rej(makeOrder(db,'u1','gem999'),400);
  const o=await makeOrder(db,'u1','gem100');assert.deepStrictEqual([o.amount,o.gems],[8900,100]);assert.match(o.orderId,/^[A-Za-z0-9_=-]{6,64}$/);
  const done=over=>async b=>({status:'DONE',orderId:b.orderId,totalAmount:b.amount,method:'간편결제',...over});
  let calls=0;const okToss=async b=>{calls++;return done()(b)};
  const pk={paymentKey:'pk',orderId:o.orderId,amount:8900};
  await rej(confirmOrder(db,okToss,'u2',pk),403);await rej(confirmOrder(db,okToss,'u1',{...pk,amount:100}),400);await rej(confirmOrder(db,okToss,'u1',{...pk,orderId:'nope_nope'}),404);
  assert.strictEqual(calls,0,'Toss never called for bad requests');
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',pk),{gems:100,balance:100});
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',pk),{gems:100,balance:100,already:true});
  assert.strictEqual(calls,1,'paid once; replay answered from the book');assert.strictEqual(db.m.get('wallets/u1').gems,100,'credited once');
  const o2=await makeOrder(db,'u1','gem50'),k2={paymentKey:'pk2',orderId:o2.orderId,amount:4900};
  await rej(confirmOrder(db,async()=>{throw Object.assign(new Error('x'),{status:502})},'u1',k2),502);
  assert.strictEqual(db.m.get('orders/'+o2.orderId).status,'ready');assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',k2),{gems:50,balance:150});
  const o3=await makeOrder(db,'u1','gem200'),k3={paymentKey:'pk3',orderId:o3.orderId,amount:17500};
  await rej(confirmOrder(db,done({orderId:'other_order'}),'u1',k3),402);assert.strictEqual(db.m.get('orders/'+o3.orderId).status,'failed');assert.strictEqual(db.m.get('wallets/u1').gems,150,'nothing credited');
  const o4=await makeOrder(db,'u1','gem300'),k4={paymentKey:'pk4',orderId:o4.orderId,amount:24500};
  let release;const slow=b=>new Promise(r=>{release=()=>r(done()(b))});
  const first=confirmOrder(db,slow,'u1',k4);await new Promise(r=>setTimeout(r,10));
  await rej(confirmOrder(db,okToss,'u1',k4),409);release();assert.deepStrictEqual(await first,{gems:300,balance:450});
  // the server died after Toss took the money but before the order closed: after a minute the claim can be retaken and the wallet is not credited twice
  const o5=await makeOrder(db,'u1','gem50');db.m.set('orders/'+o5.orderId,{...db.m.get('orders/'+o5.orderId),status:'paying',payingAt:Date.now()-120000});
  await W.credit(db,'u1',{id:'toss_'+o5.orderId,delta:50,source:'toss'});          // the half-done step that did happen
  assert.deepStrictEqual(await confirmOrder(db,okToss,'u1',{paymentKey:'pk5',orderId:o5.orderId,amount:4900}),{gems:50,balance:500});

  // ---- spending
  await rej(W.spend(db,'u1',{reqId:'abcdefgh',itemId:'nope'}),400);await rej(W.spend(db,'u1',{reqId:'x',itemId:'bake'}),400);
  assert.strictEqual((await W.spend(db,'u1',{reqId:'req-0001',itemId:'bake'})).balance,460);
  assert.deepStrictEqual(await W.spend(db,'u1',{reqId:'req-0001',itemId:'bake'}),{balance:460,already:true});   // a retry is not charged twice
  assert.strictEqual(db.m.get('wallets/u1').gems,460);
  await rej(W.spend(db,'poor',{reqId:'req-0002',itemId:'noads'}),402);assert.ok(!db.m.has('wallets/poor'),'a refused spend writes nothing');
  assert.deepStrictEqual(await W.balance(db,'nobody'),{gems:0});

  // ---- Google Play
  const play=async(pid,tok)=>({purchaseState:0,orderId:'GPA.1'});let asked=0;const verify=async(p,t)=>{asked++;return play(p,t)};
  const T='x'.repeat(40);
  await rej(W.playCredit(db,verify,'u3',{productId:'bake',token:T}),400);await rej(W.playCredit(db,verify,'u3',{productId:'gem50',token:'short'}),400);
  assert.deepStrictEqual(await W.playCredit(db,verify,'u3',{productId:'gem50',token:T}),{gems:50,balance:50,already:false});
  assert.deepStrictEqual(await W.playCredit(db,verify,'u3',{productId:'gem50',token:T}),{gems:50,balance:50,already:true});
  assert.strictEqual(asked,1,'Google asked once; the replay comes from our book');
  await rej(W.playCredit(db,verify,'u4',{productId:'gem50',token:T}),403);                                   // the same token on another account
  assert.ok(!db.m.has('wallets/u4'));
  await rej(W.playCredit(db,async()=>({purchaseState:2}),'u3',{productId:'gem100',token:'y'.repeat(40)}),402);   // pending / cancelled: nothing credited
  assert.strictEqual(db.m.get('wallets/u3').gems,50);
  const h=await W.history(db,'u1');assert.ok(h.entries.length===5&&h.entries.every(e=>e.delta&&e.source&&e.at));
  console.log('server money logic ok');
})().catch(e=>{console.error('FAIL',e.stack||e.message);process.exit(1)});
