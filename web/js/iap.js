// ---------- diamonds: the balance and every purchase / spend live on the server (Firebase wallet, server/functions/wallet.js) ----------
// This phone keeps only a copy (S.gem) to show. Buying through Google Play: BillingPlugin.kt. Plain browser and Toss builds have no plugin: packs show list prices and buying goes to webpay.js.
// Test builds (iapMock) keep a local wallet and never call the server.
const IAP={price:{}};
const BL=()=>window.Capacitor?.isNativePlatform?.()&&window.Capacitor.Plugins?.Billing;
async function srvPost(fn,body){
  const r=await fetch(`${SERVER_API}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+await fbAuth()},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(j.error||r.status),{status:r.status});return j;
}
// the wallet exists once something was bought; until then there is nothing to ask the server (and no account is created just for looking)
async function walletSync(){if(iapMock()||!S.walletOn)return;try{S.gem=(await srvPost('walletGet',{})).gems;save()}catch(e){}}
function iapGrant(id){
  if(GEM_PACKS[id]){S.gem=(S.gem||0)+GEM_PACKS[id][0];toast(t('gemGot',GEM_PACKS[id][0]))}else if(PERKS[id]){S[id]=true;toast(t('tBought'))}else if(id==='minibag'){S.minibag=(S.minibag||0)+MINIBAG_PACK;toast(t('miniBagGot',MINIBAG_PACK))}else if(id==='attpack'){S.bake=(S.bake||0)+ATT_PACK.bake;S.ice=(S.ice||0)+ATT_PACK.ice;S.minibag=(S.minibag||0)+ATT_PACK.mini;toast(t('attPackGot'))}else if(id==='bake'){S.bake=(S.bake||0)+BAKE_PACK;toast(t('bakeGot',BAKE_PACK))}else{S.ice=(S.ice||0)+ICE_PACK;toast(t('iceGot',ICE_PACK))}
}
// Google Play paid: the server checks the purchase with Google and writes it into the wallet (once per purchase), then we tell Play it was delivered.
// If the server cannot be reached the purchase stays unconsumed in Play and is retried at the next start (Play refunds an unacknowledged purchase after 3 days).
async function iapDeliver(p){
  if(!GEM_PACKS[p.id])return true;                                                          // unknown product: ignore it
  try{const r=await srvPost('walletPlay',{productId:p.id,token:p.token});S.gem=r.balance;S.walletOn=true;save();if(!r.already)toast(t('gemGot',r.gems))}
  catch(e){return false}
  try{await BL().finish({token:p.token,consume:true})}catch(e){}
  return true;
}
// at start and on return to the app: refresh the balance, finish an interrupted spend, load Play prices, deliver anything paid but not yet delivered
async function iapInit(){
  if(BUILD==='toss')await tossRecover();
  await walletSync();await spendFinish();
  const B=BL();if(!B||BUILD==='toss')return;
  try{const r=await B.setup({ids:IAP_IDS});IAP.price=r.prices||{};for(const p of r.owned||[])await iapDeliver(p)}catch(e){}
}
// diamonds are spent only after the player confirms
let gemId=null;
function gemAsk(it){
  if((S.gem||0)<it.gem){toast(t('tGem'));shopTab='store';return shopSheet()}
  gemId=it.id;
  openSheet(`<div class="pause"><div class="ribbon">${it.name}</div><p class="sub">${t('gemAsk',it.gem,S.gem-it.gem)}</p><div class="row3"><button class="gbtn ghost" data-act="gemno">${t('cancel')}</button><button class="gbtn iap" data-act="gemok">💎 ${it.gem}</button></div></div>`,true)
}
function gemSpend(){
  const id=gemId;gemId=null;if(!id)return;                      // a second tap on the same button does nothing
  if(S.spendPend)return spendFinish().then(shopSheet);          // an earlier spend never got its answer: settle that one first
  const it=shopItems().find(i=>i.id===id);
  if(!it||it.state||(S.gem||0)<it.gem)return shopSheet();
  if(iapMock()){S.gem-=it.gem;iapGrant(id);save();FX.on('buy');return shopSheet()}   // test build: local wallet
  S.spendPend={itemId:id,reqId:crypto.randomUUID()};save();      // saved BEFORE asking: if the answer is lost the same request id is sent again and is not charged twice
  spendFinish().then(shopSheet);
}
// The server takes the diamonds; only its answer gives the item (item + clearing the pending spend happen in one save, so a crash cannot grant it twice).
async function spendFinish(){
  const p=S.spendPend;if(!p)return;
  try{const r=await srvPost('walletSpend',p);S.gem=r.balance;iapGrant(p.itemId);S.spendPend=null;save();FX.on('buy')}
  catch(e){
    if(e.status===402){S.spendPend=null;save();toast(t('tGem'));walletSync()}                                   // our copy was higher than the server's: not charged, refresh the copy
    else if(e.status>=400&&e.status<500&&e.status!==401&&e.status!==409){S.spendPend=null;save();toast(t('iapFail'))}
    else toast(t('netErr'))                                                                                      // offline: kept, retried at the next start or the next tap
  }
}
// purchase and spend history, newest first (the server keeps the last 30 here; all of it stays in the ledger)
async function gemLog(){
  if(iapMock()||!S.walletOn)return openSheet(`<div class="pause"><div class="ribbon">📜</div><p class="sub">${t('gemLogNone')}</p><button class="gbtn wide" data-act="iapno">${t('ok')}</button></div>`);
  try{
    const r=await srvPost('walletLog',{});
    const src={play:t('srcPlay'),toss:t('srcWeb'),tossapp:t('srcToss'),game:''},name=e=>e.type==='buy'?t('gemPack',(GEM_PACKS[e.item]||[0])[0]):(shopItems().find(i=>i.id===e.item)||{name:e.item}).name;
    openSheet(`<div class="pause gemlog"><div class="ribbon">${t('gemLogT')}</div><div class="logrows">${r.entries.map(e=>`<div class="logrow"><small>${new Date(e.at).toLocaleString()}</small><span>${name(e)} ${src[e.source]?'· '+src[e.source]:''}</span><b class="${e.delta>0?'plus':'minus'}">${e.delta>0?'+':''}${e.delta}💎</b></div>`).join('')||t('gemLogNone')}</div><button class="gbtn wide" data-act="iapno">${t('ok')}</button></div>`);
  }catch(e){toast(t('netErr'))}
}
async function iapBuy(id){
  if(!BL())return BUILD==='toss'?tossBuy(id):webPay(id);   // no Play here: the web build pays through Toss Payments (webpay.js), the Toss app build through Toss in-app purchase (tossiap.js)
  try{const p=await BL().buy({id});if(await iapDeliver(p))FX.on('buy');else toast(t('payLater'));shopSheet()}
  catch(e){if(e.code==='owned')iapInit().then(shopSheet);else if(e.code!=='cancel')toast(t(e.code==='pending'?'iapPending':'iapFail'))}
}
// after every script is loaded (the Toss build's tossRecover lives in a later file)
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',iapInit):iapInit();
