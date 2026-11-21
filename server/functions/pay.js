// Web-version payments (Toss Payments). The server owns the price list and the order book, so a client can never pick its own amount.
const crypto=require('crypto');
// pack id -> [diamonds, won]. Keep equal to GEM_PACKS in web/js/data.js (tests/pay.test.js checks it).
const PACKS={gem50:[50,4900],gem100:[100,8900],gem200:[200,17500],gem300:[300,24500]};
const fail=(status,message)=>Object.assign(new Error(message),{status});

async function makeOrder(db,uid,packId){
  const p=PACKS[packId];if(!p)throw fail(400,'unknown pack');
  const orderId='bpt_'+crypto.randomBytes(16).toString('hex');   // Toss wants 6-64 chars of A-Za-z0-9_=-
  await db.doc('orders/'+orderId).set({uid,packId,gems:p[0],amount:p[1],status:'ready',createdAt:Date.now()});
  return {orderId,amount:p[1],gems:p[0],orderName:`다이아 ${p[0]}개`};
}

// toss(body) calls Toss' confirm API and returns its Payment object. Statuses: ready -> paying -> paid | failed. Safe to call twice.
async function confirmOrder(db,toss,uid,{paymentKey,orderId,amount}){
  const ref=db.doc('orders/'+orderId);
  const claim=await db.runTransaction(async tx=>{
    const s=await tx.get(ref);if(!s.exists)throw fail(404,'no such order');
    const o=s.data();if(o.uid!==uid)throw fail(403,'not your order');
    if(o.amount!==Number(amount))throw fail(400,'amount mismatch');          // the amount in the return URL is the client's word; ours is the one that counts
    if(o.status==='paid')return {done:true,gems:o.gems};
    if(o.status==='paying')throw fail(409,'busy');
    tx.update(ref,{status:'paying'});return {done:false,gems:o.gems,amount:o.amount};
  });
  if(claim.done)return {gems:claim.gems,already:true};
  let r;
  try{r=await toss({paymentKey,orderId,amount:claim.amount})}
  catch(e){await ref.update({status:'ready'});throw e}                       // network or Toss error: let the player retry
  if(r.status!=='DONE'||r.orderId!==orderId||r.totalAmount!==claim.amount){await ref.update({status:'failed'});throw fail(402,'payment not completed')}
  await ref.update({status:'paid',paymentKey,method:r.method||null,paidAt:Date.now()});
  return {gems:claim.gems};
}
module.exports={PACKS,makeOrder,confirmOrder};
