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
