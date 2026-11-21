// ---------- real-money items: Google Play Billing through the app's Billing plugin (BillingPlugin.kt) ----------
// Plain browser and Toss builds have no plugin: IAP.price stays empty, packs show their list price and buying shows a "payment not open yet" notice.
// shortcut: no server-side receipt check; a rooted phone can fake a purchase. Add a Cloud Function that verifies the token with the Play API if abuse shows up.
const IAP={price:{}};
const BL=()=>window.Capacitor?.isNativePlatform?.()&&window.Capacitor.Plugins?.Billing;
function iapGrant(id){
  if(GEM_PACKS[id]){S.gem=(S.gem||0)+GEM_PACKS[id][0];toast(t('gemGot',GEM_PACKS[id][0]))}else if(PERKS[id]){S[id]=true;toast(t('tBought'))}else if(id==='minibag'){S.minibag=(S.minibag||0)+MINIBAG_PACK;toast(t('miniBagGot',MINIBAG_PACK))}else if(id==='attpack'){S.bake=(S.bake||0)+ATT_PACK.bake;S.ice=(S.ice||0)+ATT_PACK.ice;S.minibag=(S.minibag||0)+ATT_PACK.mini;toast(t('attPackGot'))}else if(id==='bake'){S.bake=(S.bake||0)+BAKE_PACK;toast(t('bakeGot',BAKE_PACK))}else{S.ice=(S.ice||0)+ICE_PACK;toast(t('iceGot',ICE_PACK))}
}
// Grant once, save, only then tell Play it was delivered. A crash in between must not grant a pack twice, so the token is saved with the grant.
async function iapDeliver(p){
  if(!GEM_PACKS[p.id])return;                                                               // unknown product: iapGrant would give it away as an ice pack
  S.iapTok=S.iapTok||[];
  if(!S.iapTok.includes(p.token)){S.iapTok.push(p.token);iapGrant(p.id);save()}
  try{await BL().finish({token:p.token,consume:true});S.iapTok=S.iapTok.filter(x=>x!==p.token);save()}catch(e){}   // not finished: retried next start (Play refunds unacknowledged items after 3 days)
}
// at start and on return to the app: load Play prices, then deliver anything paid but not yet delivered (crash, slow payment)
async function iapInit(){
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
  const it=shopItems().find(i=>i.id===id);
  if(!it||it.state||(S.gem||0)<it.gem)return shopSheet();
  S.gem-=it.gem;iapGrant(id);save();FX.on('buy');shopSheet();
}
async function iapBuy(id){
  if(!BL())return openSheet(`<div class="pause"><div class="ribbon">💎</div><p class="sub">${t('payNA')}</p><button class="gbtn wide" data-act="iapno">${t('ok')}</button></div>`);   // no Play here (web / Toss build): say so instead of hiding the pack
  try{await iapDeliver(await BL().buy({id}));FX.on('buy');shopSheet()}
  catch(e){if(e.code==='owned')iapInit().then(shopSheet);else if(e.code!=='cancel')toast(t(e.code==='pending'?'iapPending':'iapFail'))}
}
iapInit();
