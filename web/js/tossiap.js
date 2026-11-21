// ---------- Toss app (Apps in Toss) build: sign-in and diamond checkout through Toss in-app purchase ----------
// Only does anything when BUILD==='toss'. The Toss SDK (@apps-in-toss/web-framework) is an npm module, so the mini-app bundle hands it to this plain-script game as window.TossSDK={IAP,User} (toss/sdk-bridge.js).
// Flow (Apps in Toss docs, IAP SDK 3.x):
//   1. buy: IAP.createOneTimePurchaseOrder, the grant callback accepts at once (never wait for the server inside it: the payment screen has to close first)
//   2. onEvent success: our server asks Toss "is this order really paid, for this player?" (server/functions/tossiap.js) and writes the diamonds into the wallet, once per order
//   3. at every start: orders paid but not yet delivered (getPendingOrders, getCompletedOrRefundedOrders) go through the same server call, which counts each order once
// Account: the wallet belongs to the Toss account (not to the phone), so diamonds come back after a reinstall or on a new phone.
const TOSS_SKU={gem50:'',gem100:'',gem200:'',gem300:''};   // pack id -> product id from the Apps in Toss console ('' = not registered yet: the pack stays on the shelf and says "preparing"). Same as server/functions/catalog.js
const TS=()=>BUILD==='toss'?window.TossSDK:null;
const tossOn=()=>{const s=TS();return !!(s&&s.IAP&&s.User)};

// sign in: one-time code from Toss -> our server -> Firebase custom token -> id token. Used by fbAuth() (rank.js) in place of the anonymous sign-up.
async function tossAuth(){
  if(!tossOn())throw new Error('not inside the Toss app');
  const {code}=await TS().User.createAnonymousKeyAuthCode();
  const r=await fetch(`${SERVER_API}/tossLogin`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||r.status);
  return fbPost(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FB.key}`,{token:j.token,returnSecureToken:true});
}

const tossNotOpen=()=>openSheet(`<div class="pause"><div class="ribbon">💎</div><p class="sub">${t('tossNA')}</p><button class="gbtn wide" data-act="iapno">${t('ok')}</button></div>`);

// the server checks the order and credits the wallet. Kept in S.tossPend until it answers for good, so a lost connection never loses a paid order.
async function tossDeliver(orderId){
  S.tossPend=[...new Set([...(S.tossPend||[]),orderId])];save();
  try{
    const r=await srvPost('tossGrant',{orderId});
    S.gem=r.balance;S.walletOn=true;S.tossPend=S.tossPend.filter(x=>x!==orderId);S.tossSeen=[...(S.tossSeen||[]),orderId].slice(-200);save();
    if(!r.already)toast(t('gemGot',r.gems));return true;
  }catch(e){
    if([400,402,403].includes(e.status)){S.tossPend=S.tossPend.filter(x=>x!==orderId);save();toast(t('iapFail'))}   // refused for good (not paid, refunded, not this player's)
    return false;                                                                                                   // offline / still in progress / not found yet / sign-in trouble: kept, retried at the next start
  }
}

let tossBusy=false;
async function tossBuy(id){
  const sku=TOSS_SKU[id];
  if(!tossOn()||!sku)return tossNotOpen();
  if(tossBusy)return;tossBusy=true;
  try{await fbAuth()}catch(e){tossBusy=false;return toast(t('iapFail'))}
  BGM.hold=true;bgmApply();                                         // Toss review rule: music stops while the payment screen is open
  let cleanup=null;const end=()=>{tossBusy=false;BGM.hold=false;bgmApply();try{cleanup&&cleanup()}catch(e){}cleanup=null};
  try{
    cleanup=TS().IAP.createOneTimePurchaseOrder({
      options:{sku,processProductGrant:()=>true},
      onEvent:async ev=>{
        if(ev&&ev.type==='success'){if(await tossDeliver(ev.data.orderId))FX.on('buy');else toast(t('payLater'))}
        end();shopSheet();
      },
      onError:e=>{end();const c=e&&e.code;if(c!=='USER_CANCELED')toast(t(c==='PAYMENT_PENDING'?'iapPending':'iapFail'))}
    });
  }catch(e){end();toast(t('iapFail'))}   // e.g. UNSUPPORTED_APP_VERSION: the Toss app is too old
}

// at start / back to the app: sign in (restores the wallet), real prices from the console, then deliver everything paid but not yet delivered
let tossRecovering=false;
async function tossRecover(){
  if(!tossOn()||tossRecovering)return;tossRecovering=true;
  try{await tossRecover0()}finally{tossRecovering=false}
}
async function tossRecover0(){
  try{await fbAuth();S.walletOn=true}catch(e){return}
  const I=TS().IAP;
  try{const r=await I.getProductItemList();for(const p of r&&r.products||[]){const k=Object.keys(TOSS_SKU).find(k=>TOSS_SKU[k]&&TOSS_SKU[k]===p.sku);if(k)IAP.price[k]=p.displayAmount}}catch(e){}
  for(const o of [...(S.tossPend||[])])await tossDeliver(o);
  try{const r=await I.getPendingOrders();for(const o of r&&r.orders||[])if(await tossDeliver(o.orderId))await I.completeProductGrant({params:{orderId:o.orderId}})}catch(e){}
  try{                                                              // paid orders whose delivery was never confirmed (app closed right after paying); the server counts each order once
    let key=null;
    for(let page=0;page<3;page++){
      const r=await I.getCompletedOrRefundedOrders({key});if(!r)break;
      for(const o of r.orders)if(o.status==='COMPLETED'&&!(S.tossSeen||[]).includes(o.orderId))await tossDeliver(o.orderId);
      if(!r.hasNext)break;key=r.nextKey;
    }
  }catch(e){}
}
