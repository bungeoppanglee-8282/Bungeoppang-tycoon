// ---------- sound (WebAudio synthesis only, starts on first tap) ----------
let AC=null,OUT=null,NOISE={};
const fxRM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function sfx(kind){
  if(!P.sound)return;
  try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();const c=AC.createDynamicsCompressor();OUT=AC.createGain();OUT.gain.value=.9;OUT.connect(c);c.connect(AC.destination)}}catch(e){return}
  OUT.gain.value=.9*(P.vol??100)/100;
  if(AC.state==='suspended')AC.resume().catch(()=>{});
  const t0=AC.currentTime,retro=P.skin==='phone';
  const env=(v,at,dur,vol,att=.005)=>{v.gain.setValueAtTime(.0001,t0+at);v.gain.linearRampToValueAtTime(vol,t0+at+att);v.gain.exponentialRampToValueAtTime(.0001,t0+at+dur)};
  // tone(freq, start, duration, {type, vol, to=glide target})
  const tone=(f,at,dur,{type='sine',vol=.2,to,att}={})=>{const o=AC.createOscillator(),v=AC.createGain();
    o.type=retro?'square':type;o.frequency.setValueAtTime(f,t0+at);if(to)o.frequency.exponentialRampToValueAtTime(to,t0+at+dur);
    env(v,at,dur,retro?vol*.45:vol,att);o.connect(v);v.connect(OUT);o.start(t0+at);o.stop(t0+at+dur+.02);return o};
  // noise(start, duration, {filter type, f, to, q, vol}); retro = sample-and-hold crunchy noise
  const noise=(at,dur,{type='bandpass',f=1000,to,q=1,vol=.2,att=.01}={})=>{
    const k=retro?'r':'m';if(!NOISE[k]){const b=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=b.getChannelData(0);let h=0;
      for(let i=0;i<d.length;i++){if(!retro||i%8===0)h=retro?Math.round(Math.random()*4-2)/2:Math.random()*2-1;d[i]=h}NOISE[k]=b}
    const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),v=AC.createGain();s.buffer=NOISE[k];s.loop=true;
    fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f,t0+at);if(to)fl.frequency.exponentialRampToValueAtTime(to,t0+at+dur);
    env(v,at,dur,vol,att);s.connect(fl);fl.connect(v);v.connect(OUT);s.start(t0+at,Math.random()*.5);s.stop(t0+at+dur+.02)};
  const seq=(notes,step,dur,o)=>notes.forEach((f,i)=>f&&tone(f,i*step,dur,o));
  switch(kind){
    case 'pour':noise(0,.28,{type:'lowpass',f:700,vol:.07});[0,.08,.17].forEach((a,i)=>tone(170+i*30,a,.07,{vol:.22,to:420+i*60}));break; // glug
    case 'sizzle':noise(0,.5,{type:'highpass',f:4500,vol:.035,att:.05});for(let i=0;i<7;i++)noise(Math.random()*.45,.02,{f:3000+Math.random()*3000,q:3,vol:.09});break;
    case 'flip':noise(0,.2,{f:2800,to:600,q:1.5,vol:.45,att:.02});tone(160,.16,.09,{vol:.22,to:80});break; // whoosh + land
    case 'pop':tone(480,0,.07,{vol:.25,to:1100});break;
    case 'sparkle':seq([1568,2093,2637],.05,.2,{type:'triangle',vol:.08});break;
    case 'burn':noise(0,.75,{type:'highpass',f:2500,vol:.16,att:.03});tone(90,0,.3,{type:'sawtooth',vol:.04});break;
    case 'toss':noise(0,.14,{type:'lowpass',f:450,vol:.3});tone(130,0,.12,{vol:.2,to:60});break;
    case 'chirp':tone(880,0,.08,{vol:.12,to:1320});tone(1175,.09,.11,{vol:.12,to:1760});break;
    case 'hmph':noise(0,.12,{f:500,q:2,vol:.08});tone(230,.03,.28,{type:'triangle',vol:.16,to:140});break;
    case 'swish':noise(0,.15,{f:1500,to:3800,q:1.2,vol:.2});break;
    case 'meow':{ // each call a slightly different cat
      const b=520+Math.random()*320,len=.28+Math.random()*.18,o=AC.createOscillator(),fl=AC.createBiquadFilter(),v=AC.createGain();
      o.type=retro?'square':'sawtooth';fl.type='bandpass';fl.frequency.value=1300;fl.Q.value=2.5;
      o.frequency.setValueAtTime(b*.8,t0);o.frequency.linearRampToValueAtTime(b*1.35,t0+len*.35);o.frequency.exponentialRampToValueAtTime(b*.7,t0+len);
      env(v,0,len,retro?.1:.22,.04);o.connect(fl);fl.connect(v);v.connect(OUT);o.start(t0);o.stop(t0+len+.02);break}
    case 'bad':tone(400,0,.26,{type:'sawtooth',vol:.09,to:180});break;
    case 'coin':seq([988,1319],.08,.14,{type:'square',vol:.08});break;
    case 'clean':seq([1500,1800],.07,.1,{type:'triangle',vol:.12});break;
    case 'clink':[2400,3700,5300].forEach((f,i)=>tone(f*(.95+Math.random()*.1),0,.18*(1-i*.15),{vol:.2/(i+1),att:.002}));break;
    case 'bell':[0,.16].forEach(a=>[1318,1976,2637,3950].forEach((f,i)=>tone(f,a,.7*(1-i*.15),{vol:.13/(i+1),att:.002})));break;
    case 'chime':[1568,1319,1047,784].forEach((f,i)=>{tone(f,i*.2,1,{vol:.07,att:.01});tone(f*2,i*.2,.5,{vol:.02})});break;
    case 'tada':seq([523,659,784],.07,.12,{type:'triangle',vol:.1});[1047,1319,1568].forEach(f=>tone(f,.22,.6,{type:'triangle',vol:.07}));break;
    case 'jingle':seq([659,784,988,1319,0,988,1319],.11,.16,{type:'triangle',vol:.09});break;
    case 'fanfare':seq([523,659,784,1047,0,784,1047],.13,.16,{type:'triangle',vol:.11});[1047,1319,1568,2093].forEach(f=>tone(f,.91,1.1,{type:'triangle',vol:.06}));break;
    default:tone(600,0,.1,{vol:.15});
  }
}
// tiny haptics; only after a real tap (Chrome blocks/warns otherwise)
const buzz=p=>{try{if(navigator.vibrate&&navigator.userActivation?.hasBeenActive)navigator.vibrate(p)}catch(e){}};

// coins arc from the happy customer into the cashbox; each landing clinks, the last one rings the bell
function flyCoins(id,pay){
  const from=document.querySelector(`[data-cust="${id}"]`),to=document.querySelector('.cash img');
  const n=Math.min(5,1+Math.floor(pay/1000));
  if(!from||!to||fxRM()){sfx('clink');setTimeout(()=>sfx('bell'),120);return}
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  for(let i=0;i<n;i++){
    const el=document.createElement('div');el.className='coin';document.body.appendChild(el);
    const x0=a.left+a.width/2-9+(Math.random()*30-15),y0=a.top+a.height*.35,x1=b.left+b.width/2-9,y1=b.top+b.height/2-9;
    el.animate([{transform:`translate(${x0}px,${y0}px) scale(1)`},{transform:`translate(${(x0+x1)/2}px,${Math.min(y0,y1)-60}px) scale(1.25)`,offset:.45},{transform:`translate(${x1}px,${y1}px) scale(.6)`}],
      {duration:650,delay:i*90,easing:'cubic-bezier(.5,0,.7,1)',fill:'backwards'}).onfinish=()=>{
      el.remove();sfx('clink');const box=document.querySelector('.cash img');
      if(box){box.classList.remove('bump');void box.offsetWidth;box.classList.add('bump')}
      if(i===n-1)setTimeout(()=>sfx('bell'),90)};
  }
}

// ---------- visual particles (fixed nodes on body, never catch input, capped, self-removing) ----------
document.head.insertAdjacentHTML('beforeend',`<style>
.fx-p{position:fixed;left:0;top:0;pointer-events:none;z-index:45;will-change:transform,opacity;line-height:1;white-space:nowrap}
.fx-top{z-index:60}
.fx-steam{width:9px;height:16px;border-radius:50%;background:radial-gradient(#fffc,#fff0 70%);filter:blur(1.5px)}
.fx-smoke{width:22px;height:22px;border-radius:50%;background:radial-gradient(#5a5350d0,#3a343100 70%)}
.fx-dust{width:16px;height:16px;border-radius:50%;background:radial-gradient(#d9c7a8c0,#d9c7a800 70%)}
.fx-star{color:#ffd45c;font-size:14px;text-shadow:0 0 6px #ffb800}
.fx-heart{color:#ff6f91;font-size:16px;text-shadow:0 1px 2px #0004}
.fx-txt{font-family:var(--fd,inherit);font-size:18px;color:#ffe08a;text-shadow:0 2px 0 #7a3d00,0 0 6px #000a}
.fx-txt.neg{color:#ff8a73;text-shadow:0 2px 0 #5a0d00,0 0 6px #000a}
.fx-conf{width:7px;height:11px;border-radius:2px}
.fx-glow{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:30;box-shadow:inset 0 0 50px 10px #ffb35c88;opacity:0}
#app.phone .fx-steam,#app.phone .fx-smoke{border-radius:0;filter:none}
</style>`);
let fxLive=0;const FX_MAX=60;
// p(class, x, y, frames=[[dx,dy,scale,opacity,rot]...], ms, delay, text, top) — motion is skipped under reduced-motion unless `keep`
function fxP(cls,x,y,frames,ms,delay=0,text='',keep=false){
  if(fxLive>=FX_MAX||document.hidden)return;
  const rm=fxRM();if(rm&&!keep)return;
  const el=document.createElement('div');el.className='fx-p '+cls;if(text)el.textContent=text;
  el.style.left=x+'px';el.style.top=y+'px';document.body.appendChild(el);fxLive++;
  const kf=rm?[{transform:'translate(-50%,-50%)',opacity:1},{transform:'translate(-50%,-50%)',opacity:0}]
    :frames.map(([dx,dy,s=1,o=1,r=0])=>({transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${s}) rotate(${r}deg)`,opacity:o}));
  el.animate(kf,{duration:ms,delay,easing:'cubic-bezier(.2,.6,.3,1)',fill:'both'}).onfinish=()=>{el.remove();fxLive--};return el;
}
const fxR=el=>{if(!el)return null;const r=el.getBoundingClientRect();return r.width?{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,top:r.top}:null};
const fxSlot=i=>$('grill').querySelectorAll('.slot')[i];
const fxCust=id=>document.querySelector(`[data-cust="${id}"]`);
const rr=(a,b)=>a+Math.random()*(b-a);
function squash(el){if(el&&!fxRM())el.animate([{transform:'scale(1)'},{transform:'scale(1.07,.9)'},{transform:'scale(.97,1.04)'},{transform:'scale(1)'}],{duration:180,easing:'ease-out'})}
function burst(cls,c,n,spread,ms,txt,top){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,d=rr(spread*.5,spread);
  fxP(cls+(top?' fx-top':''),c.x,c.y,[[0,0,.4,1,0],[Math.cos(a)*d,Math.sin(a)*d-10,1,1,rr(-90,90)],[Math.cos(a)*d*1.2,Math.sin(a)*d+10,.6,0,rr(-180,180)]],ms*rr(.8,1.2),0,typeof txt==='function'?txt():txt||'')}}
function puff(cls,c,n,ms){for(let i=0;i<n;i++)fxP(cls,c.x+rr(-c.w/4,c.w/4),c.y+rr(-6,6),[[0,0,.5,.9],[rr(-14,14),-rr(18,40),rr(1.6,2.4),0]],ms*rr(.8,1.2),i*40)}
function floatTxt(c,txt,neg){fxP('fx-txt'+(neg?' neg':''),c.x,c.top+10,[[0,0,.6,0],[0,-14,1.15,1],[0,-46,1,0]],1100,0,txt,true)}
function confetti(n,top){const W=innerWidth,cols=['#ffd45c','#ff6f91','#7fd39a','#6fb7ff','#ff9a3c','#fff'];
  for(let i=0;i<n;i++){const x=rr(W*.15,W*.85),el0=[[0,0,1,1,0],[rr(-60,60),rr(innerHeight*.35,innerHeight*.7),1,1,rr(-540,540)],[rr(-90,90),innerHeight*.85,1,0,rr(-720,720)]];
    const el=fxP('fx-conf'+(top?' fx-top':''),x,-10,el0,rr(1400,2200),rr(0,300));if(el)el.style.background=cols[i%cols.length]}}
function glow(color){const app=$('app');if(!app)return;const g=document.createElement('div');g.className='fx-glow';if(color)g.style.boxShadow=`inset 0 0 50px 10px ${color}`;app.appendChild(g);
  g.animate([{opacity:0},{opacity:1,offset:.3},{opacity:0}],{duration:2600,easing:'ease-in-out'}).onfinish=()=>g.remove()}

// steam wisps from molds that are cooking (side A or B); one cheap timer, no constant audio
setInterval(()=>{if(typeof S==='undefined'||paused||document.hidden||fxRM())return;
  const els=$('grill')?.querySelectorAll('.slot');if(!els)return;
  S.slots.forEach((s,i)=>{if(i>=S.rows*3||!(s.st==='a'||s.st==='b'||s.st.endsWith('-ready'))||Math.random()<.45)return;const c=fxR(els[i]);if(!c)return;
    fxP('fx-steam',c.x+rr(-c.w/3,c.w/3),c.y-c.h*.15,[[0,0,.6,0],[rr(-4,4),-14,1,.8],[rr(-10,10),-38,1.5,0]],rr(900,1300))})},420);

// ---------- event hooks (game.js calls FX.on at moments worth dressing up) ----------
const FX={on(name,d={}){try{
  const sl=d.i!=null?fxSlot(d.i):null,sc=fxR(sl);
  switch(name){
    case 'pour':case 'fill':squash(sl);buzz(6);break;
    case 'cover':squash(sl);buzz(6);setTimeout(()=>sfx('sizzle'),120);break;
    case 'flip':squash(sl);buzz(12);setTimeout(()=>sfx('sizzle'),220);if(sc)puff('fx-steam',sc,3,800);break;
    case 'take':squash(sl);buzz(10);sfx('sparkle');if(sc)burst('fx-star',sc,8,34,650,'✦');break;
    case 'burn':sfx('burn');buzz([20,40,20]);if(sc)puff('fx-smoke',sc,6,1300);break;
    case 'toss':sfx('toss');buzz(8);if(sc)puff('fx-dust',sc,4,600);break;
    case 'serve':{const c=fxR(fxCust(d.id));sfx('chirp');buzz(12);if(c){floatTxt(c,'+'+money(d.pay));
      for(let k=0;k<3;k++)fxP('fx-heart',c.x+rr(-c.w/3,c.w/3),c.top+20,[[0,0,.4,0],[rr(-6,6),-18,1,1],[rr(-14,14),-48,.8,0]],rr(900,1200),k*120,'♥')}break}
    case 'run':{const c=fxR(fxCust(d.id));buzz([30,30,30]);if(c){floatTxt(c,'-'+money(d.pay),true);puff('fx-dust',{...c,y:c.y+c.h*.3},6,700)}break}
    case 'leave':{const c=fxR(fxCust(d.id));sfx('hmph');if(c){puff('fx-dust',{...c,y:c.y+c.h*.3},5,700);fxP('fx-txt neg',c.x+c.w*.25,c.top+14,[[0,0,.5,0],[0,-8,1.2,1],[0,-24,1,0]],800,0,'💢')}break}
    case 'catIn':{const c=fxR($('cat'));if(c)fxP('fx-txt',c.x,c.top,[[0,0,.3,0],[0,-10,1.2,1],[0,-14,1,0]],700,150,'!',true);break}
    case 'catSteal':{setTimeout(()=>sfx('meow'),150);const c=fxR($('cat'));if(c)floatTxt(c,'-1',true);break}
    case 'catShoo':{sfx('swish');buzz(10);const c=fxR($('cat'));if(c)puff('fx-dust',c,4,500);break}
    case 'night':sfx('chime');glow();break;
    case 'buy':setTimeout(()=>sfx('tada'),80);buzz([10,30,10]);confetti(26,true);break;
    case 'dayEnd':sfx('jingle');glow('#ffd45c66');break;
    case 'win':setTimeout(()=>sfx('fanfare'),250);buzz([30,60,30,60,80]);confetti(40,true);setTimeout(()=>confetti(30,true),700);setTimeout(()=>{const c={x:innerWidth/2,y:innerHeight*.35};burst('fx-star',c,14,120,1100,'✦',true)},400);break;
  }}catch(e){console.error('FX',name,e)}}};
// resume audio on the first real tap (iOS starts contexts suspended)
addEventListener('pointerdown',()=>{if(AC&&AC.state==='suspended')AC.resume().catch(()=>{})},{passive:true});
