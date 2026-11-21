// ---------- login gate: shown once, before the first game. Google / Kakao / Naver / guest ----------
// Rebuilt from the hand-off spec (original game2_login.zip was not available): diff against it when it turns up.
// Real sign-in is not wired yet: implement window.AuthProviders[k] (async, true on success) and set AUTH_READY[k]=true.
const AUTH_READY={google:false,kakao:false,naver:false}, AUTH_NAME={google:'Google',kakao:'Kakao',naver:'Naver'};
window.AuthProviders=window.AuthProviders||{};
let authNext=null;
const authTest=()=>!!P.authTest||/[?&]authtest=1/.test(location.search);   // browser test: login "succeeds"
// run next() once a choice exists; Toss has its own login, and a saved choice is never asked again
// no provider is wired yet, so the screen would only show dead buttons: skip it until one is (preview it with ?authtest=1)
function authGate(next){if(BUILD==='toss'||P.auth||(!authTest()&&!Object.values(AUTH_READY).some(Boolean)))return next();authNext=next;loginSheet()}
function loginSheet(){openSheet(`<div class="end"><div class="ribbon">🔐</div><p class="sub">${t('authSub')}</p>
  ${Object.keys(AUTH_NAME).map(k=>`<button class="gbtn wide authbtn ${k}" data-auth="${k}">${t('authIn',AUTH_NAME[k])}</button>`).join('')}
  <button class="gbtn ghost wide" data-auth="guest">${t('authGuest')}</button></div>`,true)}
function guestSheet(){openSheet(`<div class="end"><div class="ribbon">👤</div><p class="sub"><b>${t('guestAsk')}</b></p><p class="sub">${t('guestBody')}</p>
  <div class="row3"><button class="gbtn ghost" data-auth="guestno">${t('authNo')}</button><button class="gbtn" data-auth="guestyes">${t('authYes')}</button></div></div>`,true)}
function authFinish(mode){P.auth={mode,at:Date.now()};savePref();closeSheet(true);const n=authNext;authNext=null;n&&n()}
function authLogin(k){
  if(authTest())return authFinish(k);
  if(!AUTH_READY[k]||!window.AuthProviders[k])return toast(t('authSoon'));
  window.AuthProviders[k]().then(ok=>ok?authFinish(k):toast(t('authFail')),()=>toast(t('authFail')));
}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-auth]');if(!b||b.disabled)return;const a=b.dataset.auth;
  if(a==='guest')guestSheet();else if(a==='guestno')loginSheet();else if(a==='guestyes')authFinish('guest');else authLogin(a)});
