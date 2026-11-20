// ---------- ranking server: Firebase REST (anonymous sign-in + Firestore), plain fetch, no SDK ----------
// Runs only inside the app (Capacitor) so web test builds never write to the real ranking; P.rkForce=1 turns it on for tests.
const FB={key:'AIzaSyACr6YQ252AwZf2P8ax_2mdbA77AsVaM3w',pid:'my-bungeoppang-tycoon'};
const FS=`https://firestore.googleapis.com/v1/projects/${FB.pid}/databases/(default)/documents`;
const rkOn=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())||!!P.rkForce;
let fbTok='',fbExp=0,RK=null;
async function fbPost(url,body,h){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...h},body:JSON.stringify(body)});if(!r.ok)throw new Error(r.status);return r.json()}
let fbP=null;
const fbAuth=()=>fbP||(fbP=fbAuth0().finally(()=>fbP=null));   // concurrent callers share one sign-in (two sign-ups would orphan a score)
async function fbAuth0(){
  if(fbTok&&Date.now()<fbExp)return fbTok;
  let d;const a=P.fb;
  if(a&&a.refresh)try{const x=await fbPost(`https://securetoken.googleapis.com/v1/token?key=${FB.key}`,{grant_type:'refresh_token',refresh_token:a.refresh});
    d={idToken:x.id_token,refreshToken:x.refresh_token,localId:x.user_id,expiresIn:x.expires_in}}catch(e){}
  if(!d)d=await fbPost(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FB.key}`,{returnSecureToken:true});
  P.fb={uid:d.localId,refresh:d.refreshToken};savePref();
  fbExp=Date.now()+(+d.expiresIn-120)*1000;return fbTok=d.idToken;
}
// upload my score (only if the player joined the ranking), then fetch both charts and my place
async function rkSync(){
  if(!rkOn())return;
  try{
    const tk=await fbAuth(),H={Authorization:'Bearer '+tk},uid=P.fb.uid;
    if(S.rankOn&&S.shopName){
      // shortcut: a lower score than the server's (save reset) is refused by the rules and simply ignored
      await fetch(`${FS}/shops/${uid}`,{method:'PATCH',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({fields:{
        shopName:{stringValue:S.shopName.slice(0,10)},sold:{integerValue:String(S.soldN||0)},earned:{integerValue:String(S.revN||0)},updatedAt:{timestampValue:new Date().toISOString()}}})})}
    const from=[{collectionId:'shops'}],F=['sold','earned'];
    const rows=await Promise.all(F.map(f=>fbPost(`${FS}:runQuery`,{structuredQuery:{from,orderBy:[{field:{fieldPath:f},direction:'DESCENDING'}],limit:10}},H)
      .then(a=>a.filter(x=>x.document).map(x=>({n:x.document.fields.shopName.stringValue,v:+x.document.fields[f].integerValue,id:x.document.name.split('/').pop()})))));
    const place=await Promise.all(F.map((f,i)=>S.rankOn?fbPost(`${FS}:runAggregationQuery`,{structuredAggregationQuery:{aggregations:[{alias:'n',count:{}}],structuredQuery:{from,where:{fieldFilter:{field:{fieldPath:f},op:'GREATER_THAN',value:{integerValue:String((i?S.revN:S.soldN)||0)}}}}}},H)
      .then(a=>+a[0].result.aggregateFields.n.integerValue+1):0));
    RK={rows,place,uid};if(typeof rankSync==='function')rankSync();rkPush(tk,uid);
  }catch(e){}
}
async function rkDelete(){
  try{const tk=await fbAuth(),H={Authorization:'Bearer '+tk};for(const c of ['shops','tokens']){const r=await fetch(`${FS}/${c}/${P.fb.uid}`,{method:'DELETE',headers:H});if(!r.ok&&r.status!==404)throw new Error(r.status)}}
  catch(e){return false}                              // offline / refused: keep rankOn so the player can retry; never say "deleted" when it was not
  S.rankOn=false;save();RK=null;return true;
}

// --- push for "overtaken": this device's token is stored at tokens/{uid}; the Cloud Function reads it. App only, and only while ranking + ranking alerts are on ---
let pnTok='',pnWait=false;
function rkPush(tk,uid){
  const PN=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.PushNotifications;
  if(!PN||(typeof BUILD!=='undefined'&&BUILD==='toss')||!S.rankOn)return;
  const url=`${FS}/tokens/${uid}`,H={Authorization:'Bearer '+tk,'Content-Type':'application/json'};
  if((P.notif||{}).rank===false||!P.notifOK)return fetch(url,{method:'DELETE',headers:H}).catch(()=>{});
  // updateMask keeps the server's lastPush field untouched
  if(pnTok)return fetch(`${url}?updateMask.fieldPaths=token&updateMask.fieldPaths=lang`,{method:'PATCH',headers:H,body:JSON.stringify({fields:{token:{stringValue:pnTok},lang:{stringValue:P.lang||'ko'}}})}).catch(()=>{});
  if(pnWait)return;pnWait=true;
  PN.addListener('registration',r=>{pnTok=r.value;rkPush(tk,uid)});
  PN.addListener('pushNotificationActionPerformed',e=>{if(e.notification&&e.notification.data&&e.notification.data.go==='rank'&&$('veil').hidden&&!$('map').hidden)rankSheet()});
  PN.register().catch(()=>{});
}
