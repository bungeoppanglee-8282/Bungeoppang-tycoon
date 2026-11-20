// ---------- background music: one seamless loop (tail crossfaded into head offline), played with Web Audio so the loop has no gap ----------
// own AudioContext: fx.js creates its context lazily and owns OUT/AC. Starts on the first tap (browsers block autoplay).
const BGM={ctx:null,gain:null,src:null,buf:null,loading:false,MAX:.7};
function bgmOn(){return P.bgm!==false&&(P.bgmVol??40)>0&&!document.hidden}
function bgmApply(){
  try{
    if(!BGM.ctx){BGM.ctx=new (window.AudioContext||window.webkitAudioContext)();BGM.gain=BGM.ctx.createGain();BGM.gain.connect(BGM.ctx.destination)}
    BGM.gain.gain.value=BGM.MAX*(P.bgmVol??40)/100;
    if(!bgmOn()){BGM.ctx.suspend().catch(()=>{});return}
    BGM.ctx.resume().catch(()=>{});
    if(BGM.src)return;
    if(!BGM.buf){if(!BGM.loading){BGM.loading=true;
      fetch('assets/bgm_loop.mp3').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,no)=>BGM.ctx.decodeAudioData(a,ok,no)))
        .then(b=>{BGM.buf=b;BGM.loading=false;bgmApply()}).catch(()=>{BGM.loading=false})}return}   // load/decode failure: the game just stays silent
    const s=BGM.ctx.createBufferSource();s.buffer=BGM.buf;s.loop=true;s.connect(BGM.gain);s.start();BGM.src=s;
  }catch(e){}
}
document.addEventListener('pointerdown',bgmApply,{passive:true});           // first tap unlocks audio; later taps are no-ops
document.addEventListener('visibilitychange',bgmApply);                     // no music while the app is in the background
document.addEventListener('input',e=>{if(e.target.id!=='bgmsel')return;P.bgmVol=+e.target.value;$('bgmnum').textContent=P.bgmVol;bgmApply()});
document.addEventListener('change',e=>{if(e.target.id==='bgmsel')savePref()});
