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
const TOSS_KEY=defineSecret('TOSS_SECRET_KEY');
const TOSS='https://api.tosspayments.com/v1/payments';
async function toss(body){
  const h={Authorization:'Basic '+Buffer.from(TOSS_KEY.value()+':').toString('base64'),'Content-Type':'application/json'};
  let r=await fetch(TOSS+'/confirm',{method:'POST',headers:h,body:JSON.stringify(body)}),j=await r.json();
  if(!r.ok&&j.code==='ALREADY_PROCESSED_PAYMENT'){r=await fetch(TOSS+'/'+encodeURIComponent(body.paymentKey),{headers:h});j=await r.json()}   // a retry after a lost answer: read the payment instead
  if(!r.ok)throw Object.assign(new Error(j.message||'toss error'),{status:502});
  return j;
}
const api=fn=>onRequest({region:'asia-northeast3',cors:true,secrets:[TOSS_KEY]},async(req,res)=>{
  try{
    if(req.method!=='POST')return res.status(405).end();
    const m=/^Bearer (.+)$/.exec(req.get('Authorization')||'');if(!m)return res.status(401).json({error:'sign in first'});
    const uid=(await admin.auth().verifyIdToken(m[1])).uid;
    res.json(await fn(uid,req.body||{}));
  }catch(e){if(!e.status)console.error(e);res.status(e.status||500).json({error:e.status?e.message:'server error'})}
});
exports.payOrder=api((uid,b)=>makeOrder(db,uid,String(b.packId)));
exports.payConfirm=api((uid,b)=>confirmOrder(db,toss,uid,{paymentKey:String(b.paymentKey),orderId:String(b.orderId),amount:b.amount}));
exports._t={quiet,dayKey};
