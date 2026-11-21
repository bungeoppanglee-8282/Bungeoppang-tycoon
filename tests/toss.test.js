// Run: node tests/toss.test.js   (no install). Toss app (Apps in Toss) purchase + sign-in on the server: in-memory Firestore, fake Toss partner API, plus a real mTLS round trip.
const assert=require('assert'),fs=require('fs'),https=require('https'),cp=require('child_process'),os=require('os'),path=require('path');
const C=require('../server/functions/catalog');
const {tossLogin,tossGrant,mtlsPost,uidOf}=require('../server/functions/tossiap');
const book=()=>{const m=new Map(),snap=p=>({exists:m.has(p),data:()=>m.get(p)}),
  doc=p=>({path:p,get:async()=>snap(p),set:async o=>{m.set(p,{...o})},update:async o=>{m.set(p,{...m.get(p),...o})}});
  return {m,doc,runTransaction:async f=>{const w=[],r=await f({get:async ref=>snap(ref.path),set:(ref,o)=>w.push([ref.path,o]),update:(ref,o)=>w.push([ref.path,{...m.get(ref.path),...o}])});w.forEach(([k,v])=>m.set(k,{...v}));return r}}};
const rej=async(p,status)=>{try{await p}catch(e){return assert.strictEqual(e.status,status,e.message)}assert.fail('should have failed')};
const ok=success=>({resultType:'SUCCESS',success});
(async()=>{
  // the client's product ids equal the server's
  const cl=fs.readFileSync('web/js/tossiap.js','utf8').match(/const TOSS_SKU=\{([^}]*)\}/)[1];
  assert.deepStrictEqual(Object.fromEntries([...cl.matchAll(/(\w+):'([^']*)'/g)].map(m=>[m[1],m[2]])),C.TOSS_SKU,'client and server TOSS_SKU are the same');
  assert.deepStrictEqual(Object.keys(C.TOSS_SKU),Object.keys(C.PACKS),'one product id slot per pack');

  // product id -> pack: a registered id, or (if the console lets us pick the id) the pack id itself; never an unknown one
  assert.strictEqual(C.packOfSku('gem50'),'gem50');assert.strictEqual(C.packOfSku('nope'),null);assert.strictEqual(C.packOfSku(''),null);
  C.TOSS_SKU.gem100='ait.100.abc';assert.strictEqual(C.packOfSku('ait.100.abc'),'gem100');assert.strictEqual(C.packOfSku('gem100'),null,'once registered, only the console id counts');

  // ---- sign-in
  const db=book();let asked=[];
  const post=async(p,b,h)=>{asked.push([p,b,h]);return post.next(p,b,h)};
  post.next=(p,b)=>ok({anonKey:'anon-'+b.code});
  const minted=[];const mint=async uid=>{minted.push(uid);return 'custom-'+uid};
  const r1=await tossLogin(db,post,mint,{code:'abcd1234'});
  assert.strictEqual(r1.uid,uidOf('anon-abcd1234'));assert.match(r1.uid,/^toss_[0-9a-f]{40}$/);assert.strictEqual(r1.token,'custom-'+r1.uid);
  assert.strictEqual(asked[0][0],'/api-partner/v1/apps-in-toss/users/anon-key/exchange');
  assert.strictEqual(db.m.get('tossUsers/'+r1.uid).anonKey,'anon-abcd1234','anon key kept on the server');
  post.next=()=>ok({anonKey:'anon-abcd1234'});assert.strictEqual((await tossLogin(db,post,mint,{code:'other-code'})).uid,r1.uid,'same player = same account, any phone');
  await rej(tossLogin(db,post,mint,{code:'x'}),400);await rej(tossLogin(db,post,mint,{code:5}),400);
  post.next=()=>({resultType:'FAIL',error:{errorCode:'4011',reason:'bad code'}});await rej(tossLogin(db,post,mint,{code:'abcd1234'}),401);
  assert.strictEqual(minted.length,2,'no token for a refused code');

  // ---- granting
  const U=r1.uid,ORD='13c9a1ff-2baa-4495-bbfa-a0826ba8c7c0';
  const status=(over={})=>()=>ok({orderId:ORD,sku:'ait.100.abc',status:'PURCHASED',purchaserMatched:true,reason:'x',...over});
  asked=[];post.next=status();
  await rej(tossGrant(db,post,U,{orderId:'a'}),400);await rej(tossGrant(db,post,U,{orderId:'x'.repeat(65)}),400);await rej(tossGrant(db,post,'toss_nobody',{orderId:ORD}),403);
  assert.strictEqual(asked.length,0,'bad requests never reach Toss');
  assert.deepStrictEqual(await tossGrant(db,post,U,{orderId:ORD}),{gems:100,balance:100,already:false});
  assert.deepStrictEqual([asked[0][0],asked[0][1],asked[0][2]],['/api-partner/v1/apps-in-toss/order/get-order-status',{orderId:ORD},{'x-anon-key':'anon-abcd1234'}],'Toss is asked with the stored anon key, so it can say whether this player bought it');
  assert.deepStrictEqual(await tossGrant(db,post,U,{orderId:ORD}),{gems:100,balance:100,already:true});
  assert.strictEqual(asked.length,1,'a replay is answered from our own book');assert.strictEqual(db.m.get('wallets/'+U).gems,100,'credited once');
  const led=db.m.get(`wallets/${U}/ledger/tossiap_${ORD}`);assert.deepStrictEqual([led.type,led.delta,led.source,led.item,led.ref],['buy',100,'tossapp','gem100',ORD]);
  // paid but delivery not confirmed on Toss' side: the money is taken, so it counts
  const O2='aaaaaaaa-0000-4000-8000-000000000002';post.next=status({orderId:O2,status:'PAYMENT_COMPLETED',sku:'gem50'});
  assert.deepStrictEqual(await tossGrant(db,post,U,{orderId:O2}),{gems:50,balance:150,already:false});
  // the order of another player, or one nobody paid: nothing is credited
  const bad=async(over,status,id)=>{post.next=()=>ok({orderId:id,sku:'gem50',status:'PURCHASED',purchaserMatched:true,reason:'x',...over});await rej(tossGrant(db,post,U,{orderId:id}),status);assert.strictEqual(db.m.get('wallets/'+U).gems,150,JSON.stringify(over))};
  await bad({purchaserMatched:false},403,'bbbbbbbb-0000-4000-8000-000000000001');
  await bad({purchaserMatched:undefined},403,'bbbbbbbb-0000-4000-8000-000000000002');   // "no answer" is not "yes"
  await bad({status:'REFUNDED'},402,'bbbbbbbb-0000-4000-8000-000000000003');
  await bad({status:'FAILED'},402,'bbbbbbbb-0000-4000-8000-000000000004');
  await bad({status:'ORDER_IN_PROGRESS'},409,'bbbbbbbb-0000-4000-8000-000000000005');
  await bad({status:'NOT_FOUND'},404,'bbbbbbbb-0000-4000-8000-000000000006');
  await bad({status:'MINIAPP_MISMATCH'},403,'bbbbbbbb-0000-4000-8000-000000000007');
  await bad({status:'ERROR'},502,'bbbbbbbb-0000-4000-8000-000000000008');
  await bad({sku:'something-else'},400,'bbbbbbbb-0000-4000-8000-000000000009');
  post.next=()=>({resultType:'FAIL',error:{errorCode:'4010',reason:'x'}});await rej(tossGrant(db,post,U,{orderId:'bbbbbbbb-0000-4000-8000-000000000010'}),502);
  post.next=async()=>{throw Object.assign(new Error('x'),{status:502})};await rej(tossGrant(db,post,U,{orderId:'bbbbbbbb-0000-4000-8000-000000000011'}),502);
  // an order can be credited to one account only, even if another account's request also looks fine to Toss
  const r2=await tossLogin(db,async()=>ok({anonKey:'anon-second'}),mint,{code:'second-code'});
  post.next=status({orderId:'cccccccc-0000-4000-8000-000000000001',sku:'gem50'});
  assert.strictEqual((await tossGrant(db,post,U,{orderId:'cccccccc-0000-4000-8000-000000000001'})).balance,200);
  await rej(tossGrant(db,post,r2.uid,{orderId:'cccccccc-0000-4000-8000-000000000001'}),403);assert.ok(!db.m.has('wallets/'+r2.uid),'nothing for the second account');
  // the server's own price list decides the amount, whatever the app says
  assert.strictEqual(db.m.get('wallets/'+U).gems,200);

  // ---- mTLS round trip: a real HTTPS server that insists on a client certificate
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mtls-'));
  const sh=c=>cp.execSync(c,{cwd:dir,stdio:'pipe'});
  try{sh('openssl req -x509 -newkey rsa:2048 -nodes -keyout srv.key -out srv.crt -days 2 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"');
      sh('openssl req -x509 -newkey rsa:2048 -nodes -keyout cli.key -out cli.crt -days 2 -subj "/CN=miniapp"')}
  catch(e){console.log('openssl not available: mTLS round trip skipped');return console.log('toss server ok (without mTLS round trip)')}
  const rd=f=>fs.readFileSync(path.join(dir,f));let seen=null;
  const srv=https.createServer({key:rd('srv.key'),cert:rd('srv.crt'),requestCert:true,rejectUnauthorized:false,ca:rd('cli.crt')},(rq,rs)=>{
    let b='';rq.on('data',c=>b+=c);rq.on('end',()=>{seen={url:rq.url,hdr:rq.headers['x-anon-key'],body:JSON.parse(b),cn:rq.socket.getPeerCertificate().subject&&rq.socket.getPeerCertificate().subject.CN,auth:rq.socket.authorized};
      rs.setHeader('Content-Type','application/json');rs.end(rq.url.endsWith('bad')?'<html>':JSON.stringify(ok({anonKey:'k'})))})});
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));
  const opts={host:'127.0.0.1',port:srv.address().port,ca:rd('srv.crt'),servername:'localhost'};
  const real=mtlsPost(rd('cli.crt'),rd('cli.key'),opts);
  assert.deepStrictEqual(await real('/x/exchange',{code:'c'},{'x-anon-key':'h'}),ok({anonKey:'k'}));
  assert.deepStrictEqual([seen.url,seen.hdr,seen.body,seen.cn,seen.auth],['/x/exchange','h',{code:'c'},'miniapp',true],'our certificate reached the server');
  await rej(real('/x/bad',{}),502);
  await rej(mtlsPost(rd('cli.crt'),rd('cli.key'),{...opts,port:1})('/x',{}),502);
  srv.close();fs.rmSync(dir,{recursive:true,force:true});
  console.log('toss server ok');
})().catch(e=>{console.error('FAIL',e.stack||e.message);process.exit(1)});
