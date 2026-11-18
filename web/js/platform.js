// ---------- platform (app shell hooks: pause/resume, save on background) ----------
// Works in a plain browser (visibilitychange only); adds native hooks when run inside Capacitor.
let wake=null;
function keepAwake(){if(window.Capacitor&&navigator.wakeLock)navigator.wakeLock.request('screen').then(w=>wake=w,()=>{})}
function appHide(){save();paused=true}
// never unpause under an open sheet (day summary, shop, tutorial own the pause then)
function appShow(){if($('veil').hidden)paused=false;last=performance.now();keepAwake()}
document.addEventListener('visibilitychange',()=>document.hidden?appHide():appShow());
const CP=window.Capacitor&&window.Capacitor.Plugins;
if(CP){
  CP.App&&CP.App.addListener('appStateChange',({isActive})=>isActive?appShow():appHide());
  // Android back: close an open, non-locked sheet; otherwise swallow it (no accidental exit)
  CP.App&&CP.App.addListener('backButton',()=>{if(!$('veil').hidden&&!$('veil').dataset.lock)closeSheet()});
  CP.StatusBar&&CP.StatusBar.hide().catch(()=>{});
  keepAwake();
}

// ---------- on-device save (app builds) ----------
// localStorage stays the fast synchronous copy; native Preferences is the durable copy that survives WebView cache clears.
(function(){
  const Pref=window.Capacitor?.Plugins?.Preferences;if(!Pref)return;
  const put=(k,v)=>Pref.set({key:k,value:JSON.stringify(v)}).catch(()=>{});
  const set0=store.set;store.set=(k,v)=>{set0(k,v);put(k,v)};
  if(!isNew){put(SAVE,(({slots,...r})=>r)(S));put(PREF,P);return}
  Promise.all([Pref.get({key:SAVE}),Pref.get({key:PREF})]).then(([a,b])=>{
    if(!a||!a.value)return;                       // truly a first install
    try{localStorage.setItem(SAVE,a.value);if(b&&b.value)localStorage.setItem(PREF,b.value)}catch(e){}
    location.reload();                            // boot again from the restored save
  }).catch(()=>{});
})();
