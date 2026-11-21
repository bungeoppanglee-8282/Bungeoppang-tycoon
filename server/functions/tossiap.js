// Toss app (Apps in Toss) in-app purchase + sign-in. Server side of web/js/tossiap.js.
// Talks to the Apps in Toss partner API over mTLS (certificate + private key from the console, kept as Firebase secrets, never in the repo).
//  - tossLogin: the app hands over a one-time code, Toss answers with the player's anonymous key (same for the same player, also after a reinstall or a new phone),
//    and the Firebase account id is derived from it: so the diamond wallet follows the Toss account, not the phone.
//  - tossGrant: the app says "order X was paid"; we ask Toss ourselves (order status API) and credit the wallet once per order.
const crypto=require('crypto'),https=require('https');
const {PACKS,packOfSku}=require('./catalog');
const {credit}=require('./wallet');
const fail=(status,message)=>Object.assign(new Error(message),{status});
const HOST='apps-in-toss-api.toss.im',API='/api-partner/v1/apps-in-toss';

// the real caller: post(path, body, headers) -> Toss' answer as JSON. Tests pass a fake with the same shape.
const mtlsPost=(cert,key,opts={})=>(path,body,headers={})=>new Promise((ok,no)=>{   // opts: host / port / ca overrides, for tests only
  const data=JSON.stringify(body);
  const rq=https.request({host:HOST,path,method:'POST',cert,key,timeout:10000,...opts,headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data),...headers}},res=>{
    let b='';res.on('data',c=>b+=c);res.on('end',()=>{try{ok(JSON.parse(b))}catch(e){no(fail(502,'Toss answered with something unreadable'))}})});
  rq.on('timeout',()=>rq.destroy(fail(502,'Toss did not answer in time')));
  rq.on('error',e=>no(e.status?e:fail(502,'could not reach Toss')));
  rq.end(data);
});

const uidOf=anonKey=>'toss_'+crypto.createHash('sha256').update(anonKey).digest('hex').slice(0,40);

// mint(uid) -> Firebase custom token (admin.auth().createCustomToken)
async function tossLogin(db,post,mint,{code}){
  if(typeof code!=='string'||code.length<4||code.length>500)throw fail(400,'bad code');
  const r=await post(API+'/users/anon-key/exchange',{code});
  const key=r&&r.resultType==='SUCCESS'&&r.success&&r.success.anonKey;
  if(!key||typeof key!=='string')throw fail(401,'Toss did not accept this sign-in code');   // used twice, expired (5 min) or not from this mini-app
  const uid=uidOf(key);
  await db.doc('tossUsers/'+uid).set({anonKey:key,at:Date.now()});                          // server-only: lets us ask Toss "is this player the buyer of that order?"
  return {token:await mint(uid),uid};
}

// Statuses of the order status API: PURCHASED (paid + delivery accepted) and PAYMENT_COMPLETED (paid, delivery not confirmed yet) both mean the money is taken.
const PAID=new Set(['PURCHASED','PAYMENT_COMPLETED']);
async function tossGrant(db,post,uid,{orderId}){
  if(typeof orderId!=='string'||!/^[A-Za-z0-9_-]{8,64}$/.test(orderId))throw fail(400,'bad order id');
  const id='tossiap_'+orderId;
  const seen=await db.doc(`wallets/${uid}/ledger/${id}`).get();
  if(seen.exists){const d=seen.data();return {gems:d.delta,balance:d.balanceAfter,already:true}}        // already counted: Toss is not asked again
  const u=await db.doc('tossUsers/'+uid).get();if(!u.exists)throw fail(403,'sign in with Toss first');
  const r=await post(API+'/order/get-order-status',{orderId},{'x-anon-key':u.data().anonKey});
  if(!r||r.resultType!=='SUCCESS'||!r.success)throw fail(502,'Toss could not check this order');
  const s=r.success;
  if(s.status==='ORDER_IN_PROGRESS')throw fail(409,'order still in progress');                      // the app retries
  if(s.status==='NOT_FOUND')throw fail(404,'no such order');
  if(s.status==='MINIAPP_MISMATCH')throw fail(403,'order of another app');
  if(s.status==='ERROR')throw fail(502,'Toss could not check this order');
  if(!PAID.has(s.status))throw fail(402,'order is not paid ('+s.status+')');                        // FAILED, REFUNDED ...
  if(s.purchaserMatched!==true)throw fail(403,'this order belongs to another player');
  const pack=packOfSku(s.sku);if(!pack)throw fail(400,'unknown product');                           // the sku comes from Toss, never from the app
  const c=await credit(db,uid,{id,delta:PACKS[pack][0],source:'tossapp',ref:orderId,item:pack,claim:'purchases/'+id});
  return {gems:PACKS[pack][0],balance:c.balance,already:!!c.already};
}
module.exports={mtlsPost,tossLogin,tossGrant,uidOf};
