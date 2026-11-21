#!/bin/bash
# Cloud Shell에 통째로 붙여넣고 실행: 서버 함수 파일 생성 후 배포 (server/build_deploy.py가 만든 파일, 직접 고치지 말 것)
set -e; mkdir -p ~/bpt/functions && cd ~/bpt
cat > firebase.json <<"EOF1"
{"functions":[{"source":"functions","codebase":"default"}]}
EOF1
cat > .firebaserc <<"EOF2"
{"projects":{"default":"my-bungeoppang-tycoon"}}
EOF2
cat > functions/package.json <<"EOF3"
{"name":"functions","private":true,"main":"index.js","engines":{"node":"22"},
 "dependencies":{"firebase-admin":"^13.0.0","firebase-functions":"^6.0.0","google-auth-library":"^9.0.0"}}
EOF3
cat > functions/index.js <<"EOF4"
// Ranking-overtake push: when a shop's score rises, every shop it just passed on that chart gets one push.
// Runs in Seoul (asia-northeast3) next to the database. Rules (same as the in-game local notifications): max 1 per player per day, only 08:00-08:50, 11:55-13:00, 18:00-22:30 KST.
const {onDocumentWritten}=require('firebase-functions/v2/firestore');
const admin=require('firebase-admin');
admin.initializeApp();
const db=admin.firestore();

const CHARTS=['sold','earned'];                 // the two ranking charts
const MAX_VICTIMS=25;                           // shortcut: a huge jump only notifies the 25 nearest shops; raise if the ranking gets crowded
const TXT={
  ko:(s,p)=>`'${s}' 가게가 사장님을 추월했어요! 지금 ${p}위 📉 되찾으러 갈까요?`,
  en:(s,p)=>`'${s}' just passed you! You're now #${p} 📉 Take it back?`};
const SUFFIX={ko:'붕어빵 가게',en:'Bungeoppang'};   // shortcut: ko/en only, other languages get English; add a language by adding its two strings

const kst=ms=>new Date(ms+9*3600e3);            // read the UTC fields of this to get Korean clock time
const dayKey=ms=>kst(ms).toISOString().slice(0,10);
const WINDOWS=[[480,530],[715,781],[1080,1350]];   // allowed KST minutes: 08:00-08:50, 11:55-13:00, 18:00-22:30
function quiet(ms){const d=kst(ms),m=d.getUTCHours()*60+d.getUTCMinutes();return !WINDOWS.some(([a,b])=>m>=a&&m<b)}

// who was passed: shops whose score is in [old, new), excluding the climber
async function victims(f,oldV,newV,self){
  const q=await db.collection('shops').where(f,'>=',oldV).where(f,'<',newV).orderBy(f,'desc').limit(MAX_VICTIMS+1).get();
  return q.docs.filter(d=>d.id!==self).slice(0,MAX_VICTIMS);
}

exports.overtaken=onDocumentWritten({document:'shops/{uid}',region:'asia-northeast3'},async ev=>{
  const a=ev.data.before,b=ev.data.after;
  if(!a.exists||!b.exists)return;                // join / delete: nobody is "overtaken"
  const now=Date.now(),climber=b.data(),was=a.data();
  if(quiet(now))return;
  const hit=new Map();                           // victim id -> {chart, doc}
  for(const f of CHARTS)if(climber[f]>was[f])
    for(const d of await victims(f,was[f],climber[f],ev.params.uid))if(!hit.has(d.id))hit.set(d.id,{f,doc:d});
  await Promise.all([...hit].map(async([id,{f,doc}])=>{
    const tr=db.doc('tokens/'+id),t=await tr.get();
    if(!t.exists||!t.data().token)return;
    const {token,lang,lastPush}=t.data();
    if(lastPush&&dayKey(lastPush.toMillis())===dayKey(now))return;       // already pushed today
    const place=(await db.collection('shops').where(f,'>',doc.data()[f]).count().get()).data().count+1,
          L=TXT[lang]?lang:'en';
    try{
      await admin.messaging().send({token,
        notification:{title:`${doc.data().shopName} ${SUFFIX[L]}`,body:TXT[L](climber.shopName,place)},
        data:{go:'rank'},android:{priority:'high'}});
      await tr.update({lastPush:admin.firestore.Timestamp.now()});
    }catch(e){
      if(/not-registered|invalid-registration/.test(e.code||''))await tr.delete();   // uninstalled / stale token
      else console.error(id,e.code||e.message);
    }
  }));
});

// ---- web-version payments (Toss Payments): functions/pay.js holds the logic. Setup: firebase functions:secrets:set TOSS_SECRET_KEY
const {onRequest}=require('firebase-functions/v2/https');
const {defineSecret}=require('firebase-functions/params');
const {makeOrder,confirmOrder}=require('./pay');
const wallet=require('./wallet');
const {GoogleAuth}=require('google-auth-library');
const TOSS_KEY=defineSecret('TOSS_SECRET_KEY');
const TOSS='https://api.tosspayments.com/v1/payments';
async function toss(body){
  const h={Authorization:'Basic '+Buffer.from(TOSS_KEY.value()+':').toString('base64'),'Content-Type':'application/json'};
  let r=await fetch(TOSS+'/confirm',{method:'POST',headers:h,body:JSON.stringify(body)}),j=await r.json();
  if(!r.ok&&j.code==='ALREADY_PROCESSED_PAYMENT'){r=await fetch(TOSS+'/'+encodeURIComponent(body.paymentKey),{headers:h});j=await r.json()}   // a retry after a lost answer: read the payment instead
  if(!r.ok)throw Object.assign(new Error(j.message||'toss error'),{status:502});
  return j;
}
// auth=false is for the one function that signs a player in (tossLogin)
const api=(fn,secrets=[],auth=true)=>onRequest({region:'asia-northeast3',cors:true,secrets},async(req,res)=>{
  try{
    if(req.method!=='POST')return res.status(405).end();
    let uid=null;
    if(auth){const m=/^Bearer (.+)$/.exec(req.get('Authorization')||'');if(!m)return res.status(401).json({error:'sign in first'});uid=(await admin.auth().verifyIdToken(m[1])).uid}
    res.json(await fn(uid,req.body||{}));
  }catch(e){if(!e.status)console.error(e);res.status(e.status||500).json({error:e.status?e.message:'server error'})}
});
exports.payOrder=api((uid,b)=>makeOrder(db,uid,String(b.packId)),[TOSS_KEY]);
exports.payConfirm=api((uid,b)=>confirmOrder(db,toss,uid,{paymentKey:String(b.paymentKey),orderId:String(b.orderId),amount:b.amount}),[TOSS_KEY]);

// ---- diamond wallet (wallet.js). Google Play purchases are checked with the Play Developer API as this function's own service account:
// Play Console > Setup > API access: link this Cloud project and give that service account "View financial data"; enable the Google Play Android Developer API.
const gauth=new GoogleAuth({scopes:['https://www.googleapis.com/auth/androidpublisher']});
async function verifyPlay(productId,token){
  const {token:at}=await (await gauth.getClient()).getAccessToken();
  const r=await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.ljh.bungeoppang/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(token)}`,{headers:{Authorization:'Bearer '+at}});
  if(!r.ok)throw Object.assign(new Error('Google Play did not confirm this purchase'),{status:r.status===404||r.status===410?402:502});
  return r.json();
}
exports.walletGet=api(uid=>wallet.balance(db,uid));
exports.walletSpend=api((uid,b)=>wallet.spend(db,uid,{reqId:String(b.reqId),itemId:String(b.itemId)}));
exports.walletPlay=api((uid,b)=>wallet.playCredit(db,verifyPlay,uid,{productId:String(b.productId),token:b.token}));
exports.walletLog=api(uid=>wallet.history(db,uid));

// ---- Toss app (Apps in Toss) in-app purchase and sign-in (tossiap.js). Secrets (Apps in Toss console > mTLS certificate), set with:
//   firebase functions:secrets:set TOSS_MTLS_CERT --data-file=<file>_public.crt   and   ... TOSS_MTLS_KEY --data-file=<file>_private.key
// Signing in mints a Firebase custom token: the function's service account needs the role "Service Account Token Creator" (see app/STORE.md 3-4).
const {mtlsPost,tossLogin,tossGrant}=require('./tossiap');
const TOSS_CERT=defineSecret('TOSS_MTLS_CERT'),TOSS_PRIV=defineSecret('TOSS_MTLS_KEY');
const tpost=(...a)=>mtlsPost(TOSS_CERT.value(),TOSS_PRIV.value())(...a);
exports.tossLogin=api((_,b)=>tossLogin(db,tpost,uid=>admin.auth().createCustomToken(uid),{code:b.code}),[TOSS_CERT,TOSS_PRIV],false);
exports.tossGrant=api((uid,b)=>tossGrant(db,tpost,uid,{orderId:String(b.orderId)}),[TOSS_CERT,TOSS_PRIV]);
exports._t={quiet,dayKey};
EOF4
cat > functions/catalog.js <<"EOF5"
// What things cost. The server owns these numbers, so a client can never pick its own price.
// Keep equal to web/js/data.js (GEM_PACKS, GEM_COST, PERKS): tests/pay.test.js checks it.
const PACKS={gem50:[50,4900],gem100:[100,8900],gem200:[200,17500],gem300:[300,24500]};   // pack id -> [diamonds, won]
const COSTS={minibag:20,attpack:50,bake:40,ice:30,noads:50,pat2:40,rack2:30};            // item id -> diamonds
// Toss app (Apps in Toss): the product id (sku) each pack gets in the Apps in Toss console. '' = not registered yet.
// Keep equal to TOSS_SKU in web/js/tossiap.js (tests/toss.test.js checks it). If the console lets you choose the id and you use gem50 ... gem300, leave these empty.
const TOSS_SKU={gem50:'',gem100:'',gem200:'',gem300:''};
const packOfSku=sku=>Object.keys(TOSS_SKU).find(k=>TOSS_SKU[k]&&TOSS_SKU[k]===sku)||(PACKS[sku]&&!TOSS_SKU[sku]?sku:null);
module.exports={PACKS,COSTS,TOSS_SKU,packOfSku};
EOF5
cat > functions/wallet.js <<"EOF6"
// Diamond wallet on Firebase: wallets/{uid} holds the balance, wallets/{uid}/ledger/{entry} every purchase and spend.
// Only the server writes here (clients have no rule that allows it). Every change is one transaction and has a fixed entry id, so a retried request never counts twice.
const crypto=require('crypto');
const {PACKS,COSTS}=require('./catalog');
const fail=(status,message)=>Object.assign(new Error(message),{status});
const W=uid=>'wallets/'+uid, L=(uid,id)=>`wallets/${uid}/ledger/${id}`;

// delta > 0 buys, delta < 0 spends. claim = a document that marks an outside purchase as used by one account only.
async function credit(db,uid,{id,delta,source,ref,item,claim}){
  return db.runTransaction(async tx=>{
    const w=db.doc(W(uid)),l=db.doc(L(uid,id)),c=claim&&db.doc(claim);
    const ls=await tx.get(l),ws=await tx.get(w),cs=c?await tx.get(c):null;
    if(ls.exists)return {balance:ls.data().balanceAfter,already:true};               // this exact request was already counted
    if(cs&&cs.exists&&cs.data().uid!==uid)throw fail(403,'this purchase belongs to another account');
    const balance=(ws.exists?ws.data().gems:0)+delta;
    if(balance<0)throw fail(402,'not enough diamonds');
    const at=Date.now();
    tx.set(l,{type:delta>0?'buy':'spend',delta,balanceAfter:balance,source,ref:ref||null,item:item||null,at});
    tx.set(w,{gems:balance,updatedAt:at});
    if(c&&!cs.exists)tx.set(c,{uid,at});
    return {balance};
  });
}
async function balance(db,uid){const s=await db.doc(W(uid)).get();return {gems:s.exists?s.data().gems:0}}

async function spend(db,uid,{reqId,itemId}){
  const cost=COSTS[itemId];if(!cost)throw fail(400,'unknown item');
  if(!/^[A-Za-z0-9_-]{8,64}$/.test(reqId||''))throw fail(400,'bad request id');
  return credit(db,uid,{id:'spend_'+reqId,delta:-cost,source:'game',item:itemId});
}

// A Google Play purchase: verify(productId, token) asks Google whether it was really paid. Credited once per token, to one account.
async function playCredit(db,verify,uid,{productId,token}){
  const p=PACKS[productId];if(!p)throw fail(400,'unknown pack');
  if(typeof token!=='string'||token.length<20||token.length>2000)throw fail(400,'bad token');
  const key=crypto.createHash('sha256').update(token).digest('hex'),id='play_'+key.slice(0,40);
  const seen=await db.doc(L(uid,id)).get();
  if(seen.exists)return {gems:p[0],balance:seen.data().balanceAfter,already:true};     // answered from our own book, Google is not asked again
  const v=await verify(productId,token);
  if(v.purchaseState!==0)throw fail(402,'purchase is not completed');                  // 0 = purchased (1 cancelled, 2 pending)
  const r=await credit(db,uid,{id,delta:p[0],source:'play',ref:v.orderId||null,item:productId,claim:'purchases/'+key});
  return {gems:p[0],balance:r.balance,already:!!r.already};
}

async function history(db,uid){
  const q=await db.collection(`wallets/${uid}/ledger`).orderBy('at','desc').limit(30).get();
  return {entries:q.docs.map(d=>{const {type,delta,balanceAfter,source,item,at}=d.data();return {type,delta,balanceAfter,source,item,at}})};
}
module.exports={credit,balance,spend,playCredit,history};
EOF6
cat > functions/pay.js <<"EOF7"
// Web-version payments (Toss Payments). The server owns the price list and the order book, so a client can never pick its own amount.
const crypto=require('crypto');
const {PACKS}=require('./catalog');
const {credit,balance}=require('./wallet');
const fail=(status,message)=>Object.assign(new Error(message),{status});

async function makeOrder(db,uid,packId){
  const p=PACKS[packId];if(!p)throw fail(400,'unknown pack');
  const orderId='bpt_'+crypto.randomBytes(16).toString('hex');   // Toss wants 6-64 chars of A-Za-z0-9_=-
  await db.doc('orders/'+orderId).set({uid,packId,gems:p[0],amount:p[1],status:'ready',createdAt:Date.now()});
  return {orderId,amount:p[1],gems:p[0],orderName:`다이아 ${p[0]}개`};
}

// toss(body) calls Toss' confirm API and returns its Payment object. Statuses: ready -> paying -> paid | failed. Safe to call twice.
// A claim that stays 'paying' for over a minute (server died mid-way) can be taken again: Toss answers a repeat with the finished payment and the wallet entry is counted once.
const STALE=60000;
async function confirmOrder(db,toss,uid,{paymentKey,orderId,amount}){
  const ref=db.doc('orders/'+orderId);
  const claim=await db.runTransaction(async tx=>{
    const s=await tx.get(ref);if(!s.exists)throw fail(404,'no such order');
    const o=s.data();if(o.uid!==uid)throw fail(403,'not your order');
    if(o.amount!==Number(amount))throw fail(400,'amount mismatch');          // the amount in the return URL is the client's word; ours is the one that counts
    if(o.status==='paid')return {done:true,gems:o.gems};
    if(o.status==='paying'&&Date.now()-o.payingAt<STALE)throw fail(409,'busy');
    tx.update(ref,{status:'paying',payingAt:Date.now()});return {done:false,gems:o.gems,amount:o.amount,packId:o.packId};
  });
  if(claim.done){const w=await balance(db,uid);return {gems:claim.gems,balance:w.gems,already:true}}
  let r;
  try{r=await toss({paymentKey,orderId,amount:claim.amount})}
  catch(e){await ref.update({status:'ready'});throw e}                       // network or Toss error: let the player retry
  if(r.status!=='DONE'||r.orderId!==orderId||r.totalAmount!==claim.amount){await ref.update({status:'failed'});throw fail(402,'payment not completed')}
  const c=await credit(db,uid,{id:'toss_'+orderId,delta:claim.gems,source:'toss',ref:orderId,item:claim.packId});   // money taken: the diamonds are written before the order is closed
  await ref.update({status:'paid',paymentKey,method:r.method||null,paidAt:Date.now()});
  return {gems:claim.gems,balance:c.balance};
}
module.exports={makeOrder,confirmOrder};
EOF7
cat > functions/tossiap.js <<"EOF8"
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
const mtlsPost=(cert,key)=>(path,body,headers={})=>new Promise((ok,no)=>{
  const data=JSON.stringify(body);
  const rq=https.request({host:HOST,path,method:'POST',cert,key,timeout:10000,headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data),...headers}},res=>{
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
EOF8
(cd functions && npm install --silent)
firebase deploy --only functions --project my-bungeoppang-tycoon
