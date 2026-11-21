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
