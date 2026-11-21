// ---------- state ----------
const SAVE='bbt2-save', PREF='bbt2-pref';
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const fresh=()=>({churu:0,xp:0,xpTotal:0,prep:PREP_MAX,wallet:START_MONEY,top:1,stars:{},rows:1,gas:1,plates:PLATES0,batters:['plain'],milks:[],mini:false,cctv:false,decos:[],truck:false,won:false,tutDone:false,seen:{}});
const saved=store.get(SAVE);
let S=Object.assign(fresh(),saved||{}), isNew=!saved;
S.slots=[];                                   // runtime only; fx.js reads it for steam
let P=Object.assign({lang:(n=>/^zh-(TW|HK|MO|Hant)/i.test(n)?'tw':(l=>LANGS.some(x=>x[0]===l)?l:'en')(n.slice(0,2)))(navigator.language||'en'),skin:'modern',sound:true,season:'auto'},store.get(PREF)||{});
let R=null, paused=false, last=performance.now(), cid=0, selB='plain', selF='red', pending={};
const save=()=>{const {slots,...rest}=S;store.set(SAVE,rest)};
const savePref=()=>store.set(PREF,P);

// ---------- helpers ----------
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const cur=n=>fmt(n)+COIN[P.lang];
const coinTxt=s=>s.replace(/₩([\d,]+)|(\d[\d,]*)원/g,(m,x,y)=>cur(+(x||y).replace(/,/g,'')));   // strings still written with 원/₩ show as coins
const t=(k,...a)=>{const v=L[P.lang][k]??L.en[k]??k,s=typeof v==='function'?v(...a):v;return typeof s==='string'&&k!=='iapTest'?coinTxt(s):s};
const fmt=n=>Math.round(n).toLocaleString('ko-KR');
const money=n=>cur(Math.round(n));
const season=()=>SEASON_OF(new Date().getMonth());   // season preview menu removed: always the real season
const evOn=()=>!!(R&&R.ev);   // seasonal buns only appear in the event stage
const has=id=>S.decos.includes(id);
const stallLv=()=>S.truck?3:S.decos.length?2:1;
const price=()=>BASE_PRICE+S.decos.reduce((a,id)=>a+DECO.find(d=>d.id===id).add,0)+(S.truck?300:0);
function unitPrice(k){
  if(k==='mini')return 0;
  const [a,b]=k.split('|');
  if(a==='milk')return MILK[b].price;
  return (price()+BATTER[a].add)*(BATTER[a].mult||1)*(FILL[b].mult||1);
}
// one bake after the flip = the old two sides together
const M=()=>MODE[(R&&R.mode)||P.mode]||MODE.normal;   // a stage keeps the mode it started in
const cook=()=>GAS[S.gas-1]*2*M().cook/((R&&R.boost.spatula)?1.3:1);
const grace=()=>(Math.max(2.5,GAS[S.gas-1]*.6)+2.2)*M().grace;   // +2.2s window before a ready bun burns
const rackN=()=>rackCap(R.n)*(S.rack2?2:1);
const maxCust=()=>R&&R.sp?2:M().guests;
const dif=()=>R.ev?1:ramp(R.n);
const bunDone=b=>b==='ev'?`${IMGP}bun_event_${season()}.webp`:BUN(b,'done');
const fillIco=f=>SC['tub_'+f];
function icon(k){
  if(k==='mini')return `<span class="ico mini"><img src="${BUN('plain','done')}" alt=""></span>`;
  const [a,b]=k.split('|');
  if(a==='milk')return `<span class="ico"><img class="ctn" src="${IMGP}carton_${b}.webp" alt=""></span>`;
  const look=a==='ev'?EV[season()].look:a;   // show the open bun with its filling so red bean / custard / pizza read at a glance
  return `<span class="ico"><img src="${BUN(look,'fill_'+b)}" alt=""></span>`;
}
// coloured name tag that says what is inside (the part players could not tell apart)
function pill(k){
  if(k==='mini')return `<span class="pill f-mini">${t('mini')}</span>`;
  const [a,b]=k.split('|');
  if(a==='milk')return `<span class="pill f-milk m-${b}">${t('m_'+b)}</span>`;
  if(a==='ev')return `<span class="pill f-ev">${t('evs_'+season())}</span>`;
  return `<span class="pill f-${b}">${t('f_'+b)}</span>`;
}
const keyName=k=>{if(k==='mini')return t('mini');const [a,b]=k.split('|');if(a==='milk')return t('m_'+b);if(a==='ev')return t('ev_'+season());return (a==='plain'?'':t('b_'+a)+' ')+t('f_'+b)};
function gainXP(n,el,label){
  if(n<=0)return;const before=lvlOf(S.xpTotal||0);S.xp=(S.xp||0)+n;S.xpTotal=(S.xpTotal||0)+n;if(R&&R.running)R.xpg=(R.xpg||0)+n;
  if(el){const c=fxR(el);if(c)floatTxt(c,(label?label+' ':'')+'+'+n+' XP')}
  const now=lvlOf(S.xpTotal);if(now>before){S.prep=Math.min(PREP_MAX,(S.prep||0)+1);toast(t('lvUp',now));beep([523,659,784,1047],.18,{gap:.09});FX.on('buy',{})}
}
function exchangeXP(amount){const use=Math.floor(Math.min(amount,S.xp||0)/XP_RATE)*XP_RATE;if(!use){toast(t('xpNone'));return}
  S.xp-=use;S.wallet+=use/XP_RATE;save();sfx('coin');toast(t('xpDone',money(use/XP_RATE)));drawMap();shopTab==='xp'&&$('sheet').querySelector('.shop')?shopSheet():xpSheet()}
function xpSheet(){openSheet(`<div class="pre">${xpBody()}<button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`)}
function xpBody(){
  const l=lvlOf(S.xpTotal||0),a=lvlXp(l),b=lvlXp(l+1),x=S.xp||0;
  return `<div class="xpcard">
      <div class="xprow"><div class="xpl"><small>${t('xpHave')}</small><b>${fmt(x)} XP</b></div><i class="xpdiv"></i><span class="xpill">${t('xpRule')}</span></div>
      <button class="gbtn big xpgo" data-xp="all" ${x<XP_RATE?'disabled':''}>${t('xpGo')}</button>
      <p class="xpmsg">${x<XP_RATE?t('xpMore',XP_RATE-x):t('xpReady')}</p>
    </div>
    <p class="xplv">${t('xpLvl')}</p>
    <div class="xpbig"><i style="width:${((S.xpTotal-a)/(b-a)*100).toFixed(1)}%"></i><span>${fmt(S.xpTotal-a)} / ${fmt(b-a)} XP</span></div>`;
}
let toastT;
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),1700)}
function shake(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}

// small extra sounds on top of fx.js sfx(): ready ding, milk pour, star pop, keypad DTMF
function beep(fs,dur=.12,{type='triangle',vol=.12,gap=0}={}){
  if(!P.sound)return;
  try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();OUT=AC.createGain();OUT.connect(AC.destination)}}catch(e){return}
  OUT.gain.value=.9*(P.vol??100)/100;
  if(AC.state==='suspended')AC.resume().catch(()=>{});
  const t0=AC.currentTime;
  fs.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),at=t0+i*gap;o.type=P.skin==='phone'?'square':type;o.frequency.value=f;
    g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(P.skin==='phone'?vol*.5:vol,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+dur);
    o.connect(g);g.connect(OUT);o.start(at);o.stop(at+dur+.02)});
}
const DTMF={1:[697,1209],2:[697,1336],3:[697,1477],4:[770,1209],5:[770,1336],6:[770,1477],7:[852,1209],8:[852,1336],9:[852,1477],'*':[941,1209],0:[941,1336],'#':[941,1477]};
function haptic(ms=12){try{const H=window.Capacitor?.Plugins?.Haptics;if(H)H.impact({style:'LIGHT'});else buzz(ms)}catch(e){}}

// ---------- stage flow ----------
function missionFor(n){
  const l=['noBurn','serve','noLeave'];
  if(S.milks.length&&n>=MILK_STAGE)l.push('drinks');
  if(S.mini)l.push('minis');
  if(S.batters.includes('straw')||S.batters.includes('matcha')||n>=CHOCO_STAGE)l.push('special');
  return l[(n*7)%l.length];
}
const serveN=n=>5+Math.floor(n*.8);
const missionText=(m,n)=>m==='serve'?t('mi_serve',serveN(n)):t('mi_'+m);
function missionOk(){const m=R.mission;return m==='noBurn'?R.burnt===0:m==='noLeave'?R.walk===0:m==='serve'?R.served>=serveN(R.n):m==='drinks'?R.drinks>=3:m==='minis'?R.calms>=2:m==='special'?R.special>=3:R.event>=3}

function startStage(n,ev=false){
  const gm=(MODE[P.mode]||MODE.normal).goal;
  R={n,ev,mode:P.mode,t:0,dur:stageDur(n),goal:Math.max(500,r500((ev?stageGoal(n)*.8:stageGoal(n))*gm)),earned:0,costs:0,served:0,walk:0,burnt:0,drinks:0,calms:0,special:0,event:0,
     plates:[],minis:(pending.mini?AD_MINI:0)+(S.mini?MINI.yield:0),miniSt:{st:'idle',t:0},
     cups:Array(CUPS).fill(null),cust:[],nextSpawn:n===1&&!S.tutDone?9:4,cat:null,nextCat:rnd(40,70),nextCrumb:5,
     night:false,boost:{...pending},mission:missionFor(n),running:true,contUsed:false,ended:false,tut:n===1&&!S.tutDone};
  pending={};
  S.slots=Array.from({length:15},()=>({st:'empty',b:null,f:null,t:0,crumb:false}));
  selB='plain';selF='red';
  $('map').hidden=true;closeSheet(true);$('custs').innerHTML='';   // drop guests left over from a quit stage
  buildKitchen();drawScene();
  paused=false;last=performance.now();
  if(R.tut){R.coach=0;R.nextSpawn=1e9;spawn('kid',{'plain|red':1})}
}
// group-order bonus game: outside the stages; one or two guests order mixed buns, SP_NEED buns handed over in SP_MIN minutes
function spOrder(){const o={},n=rnd(3,5);
  for(let i=0;i<n;i++){let k=pick(SP_BATS)+'|'+pick(SP_FILLS);if(Object.keys(o).length>=3&&!o[k])k=Object.keys(o)[0];o[k]=(o[k]||0)+1}
  return o}
function spMission(){openSheet(`<div class="pre"><div class="ribbon">📦 ${t('spMissionT')}</div>
  <div class="earn spm"><b>⏱ ${t('spMinN',SP_MIN)}</b><b>🐟 ${t('spBunN',SP_NEED)}</b></div>
  <p class="sub">${t('spMissionD')}</p><p class="bonus">🎁 ${money(SP_REWARD)} · ⭐ ${fmt(SP_XP)} XP · 🔥 ${t('spNoBurn')}</p>
  <button class="gbtn big" data-live="spstart">▶ ${t('spGo')}</button><button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`)}
function startSpecial(){
  const mode=P.mode;P.mode='normal';startStage(1);P.mode=mode;
  Object.assign(R,{sp:true,got:0,spT:.5,dur:SP_MIN*60,nextSpawn:1e9,nextCat:1e9,nextCrumb:1e9,minis:0,boost:{},tut:false,coach:null});
  buildKitchen();
}
function spEndSheet(ok,xp){
  openSheet(`<div class="end"><img class="winimg" src="${bunDone('plain')}" alt=""><div class="ribbon${ok?'':' sad'}">📦 ${t('spTitle')}</div>
    <div class="earn"><b>${R.got} / ${SP_NEED}</b></div>
    <p class="bonus">${ok?`${money(SP_REWARD)} · ⭐ +${fmt(xp)} XP${R.burnt?'':' · 🔥 '+t('spNoBurn')}`:t('spFail')}</p>
    <div class="row3"><button class="gbtn ghost" data-act="map">${t('toMap')}</button>${ok?'':`<button class="gbtn" data-live="spgo">${t('retry')}</button>`}</div></div>`,true);
}
function endStage(){
  if(R.ended)return;R.ended=true;R.running=false;$('coach').hidden=true;
  R.cust.forEach(c=>c.el&&c.el.remove());R.cust=[];R.cat=null;
  if(R.sp){const ok=R.got>=SP_NEED,xp=ok?SP_XP*(R.burnt?1:2):0;   // nothing burnt: double XP
    if(ok){S.sp.done=true;S.wallet+=SP_REWARD;gainXP(xp)}save();FX.on('dayEnd',{T:R});return spEndSheet(ok,xp)}
  if(R.ev){if(!R.burnt&&R.served>0){R.quad=(R.xpg||0)*3;gainXP(R.quad);R.xpg=(R.xpg||0)*4}save();FX.on('dayEnd',{T:R});return receiptSheet(eventSheet)}
  const ok=R.earned>=R.goal, stars=ok?1+(missionOk()?1:0)+(R.earned>=R.goal*1.5?1:0):0;
  const old=S.stars[R.n]||0, bonus=Math.max(0,stars-old)*500;
  if(stars>old)S.stars[R.n]=stars;
  S.wallet+=bonus;gainXP(Math.max(0,stars-old)*XP_STAR);
  if(ok&&R.n===S.top){if(R.n>=STAGES){S.top++;S.fuelLeft=Math.max(0,fuelLeft()-1)}else S.adv=true}
  if(ok){S.prep=Math.min(PREP_MAX,(S.prep||0)+1);S.clears=(S.clears||0)+1;if(S.clears%3===0)S.adDue=true}   // interstitial after every 3rd cleared stage
  if(ok&&R.n===1)S.tutDone=true;
  save();
  FX.on('dayEnd',{T:R});
  receiptSheet(()=>ok?clearSheet(stars,old,bonus):failSheet());
}
function clearSheet(stars,old,bonus){
  const ms=MILESTONE[R.n+1]&&!S.seen[R.n+1]?MILESTONE[R.n+1]:null;
  if(ms)S.seen[R.n+1]=1,save();
  openSheet(`<div class="end">
    <div class="ribbon">${t('clear')}</div>
    <div class="bigstars">${[1,2,3].map(i=>`<i class="${i<=stars?'on':''}" style="--d:${.25+i*.35}s">★</i>`).join('')}</div>
    <div class="earn"><small>${t('earned')}</small><b id="countup">0</b></div>
    <ul class="checks">
      <li class="${R.earned>=R.goal?'ok':''}">★ ${t('st1',money(R.goal))}</li>
      <li class="${missionOk()?'ok':''}">★★ ${missionText(R.mission,R.n)}</li>
      <li class="${R.earned>=R.goal*1.5?'ok':''}">★★★ ${t('st3',money(R.goal*1.5))}</li>
    </ul>
    <p class="bonus xpline">⭐ +${fmt(R.xpg||0)} XP</p>
    ${bonus?`<p class="bonus">${t('starBonus')} +${money(bonus)}</p>`:''}
    ${ms?`<div class="unlock"><span>${t('unlockT')}</span><b>${t('ms_'+ms)}</b></div>`:''}
    ${dblBtn()}
    <div class="row3"><button class="gbtn ghost" data-act="map">${t('toMap')}</button><button class="gbtn ghost" data-act="retry">${t('retry')}</button><button class="gbtn" data-act="next">${t('next')}</button></div>
  </div>`,true);
  countUp($('countup'),R.earned);
  [1,2,3].forEach(i=>i<=stars&&setTimeout(()=>beep([660+i*220,990+i*220],.25,{gap:.06}),(250+i*350)));
}
function failSheet(){
  openSheet(`<div class="end">
    <div class="ribbon sad">${t('fail')}</div>
    <p class="sub">${t('failSub')}</p>
    <div class="earn"><small>${t('earned')}</small><b>${money(R.earned)}</b><span> / ${money(R.goal)}</span></div>
    ${R.contUsed?'':`<button class="gbtn ad" data-act="cont">▶ ${t(S.noads?'contFree':'cont')}</button>`}
    ${dblBtn()}
    <div class="row3"><button class="gbtn ghost" data-act="map">${t('toMap')}</button><button class="gbtn" data-act="retry">${t('retry')}</button></div>
  </div>`,true);
}
// watch an ad once per stage to get this stage's earnings again
function dblBtn(){return R.earned>0?`<button class="gbtn ad" id="dbl" data-act="dbl">▶ ${t(S.noads?'dblFree':'dbl',money(R.earned))}</button>`:''}
function countUp(el,to){if(!el)return;const t0=performance.now();const f=now=>{const p=Math.min(1,(now-t0)/900);el.textContent=money(to*p*(2-p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

function eventSheet(){
  openSheet(`<div class="end"><img class="winimg" src="${bunDone('ev')}" alt=""><div class="ribbon ev">${t('evTitle',t('s_'+season()))}</div>
    <div class="earn"><small>${t('earned')} · ${t('evPay')}</small><b id="countup">0</b></div>
    ${R.quad!=null?`<p class="bonus">🔥 ${t('evNoBurn')} ⭐ +${fmt(R.xpg)} XP</p>`:''}
    ${dblBtn()}
    <div class="row3"><button class="gbtn ghost" data-act="map">${t('toMap')}</button><button class="gbtn" data-start="ev">${t('retry')}</button></div></div>`,true);
  countUp($('countup'),R.earned);
}
// big picture for the 'new this stage' card: the open bun with its filling for food unlocks, the guest for guest unlocks
function unlockImg(ms){
  const food={pizza:BUN('plain','fill_pizza'),dubai:BUN('plain','fill_dubai'),choco:BUN('choco','fill_red'),mini:BUN('plain','done'),kinds3:BUN('straw','fill_cream'),group:BUN('plain','fill_red')}[ms];
  const guest={elder:'grandpa_1',worker:'worker_1',gent:'gent_1',bully:'bully_1',jerk:'jerk_1',lunch:'student_1',rush:'dad_1',four:'girl_1'}[ms];
  if(food)return `<img class="ubig${ms==='mini'?' small':''}" src="${food}" alt="">`;
  if(guest)return `<img class="ubig guest" src="${CPOSE[guest]}" alt="">`;
  if(ms==='milk')return `<div class="ubig milk"><img class="ctn" src="${IMGP}carton_white.webp" alt=""><img class="ctn" src="${IMGP}carton_straw.webp" alt=""><img class="ctn" src="${IMGP}carton_choco.webp" alt=""></div>`;
  return '';
}
const fuelLeft=()=>S.fuelLeft??FUEL_STAGES;
function fuelBar(){const p=fuelLeft()/FUEL_STAGES*100,f=$('fuel');f.querySelector('i').style.width=p+'%';f.classList.toggle('low',p<=20);f.querySelector('b').textContent=`⛽ ${t('fuelLbl')} ${Math.round(p)}%`}
function preStage(n,ev){
  // out of gas: replays are fine, a new stage needs a refill
  if(!ev&&n>=S.top&&fuelLeft()<=0)return openSheet(`<div class="pre"><img class="ubig small" src="${IMGP}butane.svg" alt=""><div class="ribbon">${t('gasEmpty')}</div><p class="sub">${t('gasEmptyD')}</p><button class="gbtn big" data-act="fuelshop">${t('shop')} · ${money(FUEL_COST)}</button><button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`);
  pending={};
  const m=missionFor(n), g=ev?r500(stageGoal(n)*.8):stageGoal(n);
  if(ev)return openSheet(`<div class="pre"><img class="winimg" src="${bunDone('ev')}" alt=""><div class="ribbon ev">${t('evTitle',t('s_'+season()))}</div>
    <p class="sub">${t('evIntro',t('ev_'+season()))}</p><ul class="checks"><li>🎁 ${t('evPay')}</li><li>🔥 ${t('evNoBurnRule')}</li><li>🍠 ${t('evHow',t('f_'+EV[season()].fill))}</li></ul>
    <button class="gbtn big" data-start="ev">${t('start')}</button></div>`);
  const bo=['mini','spatula','stove','stool'],ms=MILESTONE[n];
  openSheet(`<div class="pre mission">
    <button class="xbtn" data-act="close" aria-label="${t('close')}">✕</button>
    <div class="ribbon">${t('stageN',n)}</div>
    <p class="mtitle2">📋 ${t('todayMission')}</p>
    ${ms?`<div class="unlock now"><span>${t('newToday')}</span>${unlockImg(ms)}<b>${t('ms_'+ms)}</b><small>${t('msd_'+ms)}</small></div>`:''}
    <ul class="checks">
      <li>★ ${t('st1',money(g))}</li><li>★★ ${missionText(m,n)}</li><li>★★★ ${t('st3',money(g*1.5))}</li>
    </ul>
    <h3>${t('boosters')}</h3>
    <div class="boosts">${bo.map(b=>`<div class="boost" id="bo-${b}"><span class="bi-${b}"></span><b>${t('bo_'+b)}</b><small>${t('bo_'+b+'D')}</small>
      <button class="gbtn ad sm" data-ad="${b}">▶ ${t(S.noads?'getFree':'watchAd')}</button></div>`).join('')}</div>
    <button class="gbtn big" data-start="${n}">${t('start')}</button>
  </div>`);
}
// shortcut: stand-in ad screen; swap for a rewarded-ad SDK (AdMob) in the app build
function showAd(done){
  if(S.noads){done();sfx('tada');return}
  const AD=window.Capacitor?.isNativePlatform?.()&&Capacitor.Plugins?.Ads;   // app build: real AdMob rewarded ad
  if(AD){AD.rewarded().then(r=>{if(r.rewarded){done();sfx('tada')}}).catch(()=>{});return}
  const a=$('ad');a.hidden=false;let n=3;a.innerHTML=`<b>${t('adTitle')}</b><i>${n}</i><small>${t('adSub')}</small>`;
  const iv=setInterval(()=>{n--;if(n>0){a.querySelector('i').textContent=n;return}clearInterval(iv);a.hidden=true;done();sfx('tada')},800);
}

// interstitial owed after every 3rd cleared stage: shown when the player leaves the clear sheet (app build only; ad-free buyers skip it)
function interAd(go){
  const AD=window.Capacitor?.isNativePlatform?.()&&Capacitor.Plugins?.Ads;
  if(!S.adDue||S.noads||!AD)return go();
  S.adDue=false;save();
  AD.interstitial().catch(()=>{}).then(go);
}

// ---------- sheets ----------
function openSheet(h,lock){paused=true;$('sheet').innerHTML=h;$('veil').hidden=false;$('veil').dataset.lock=lock?'1':''}
function closeSheet(force){if(!force&&$('veil').dataset.lock)return;$('veil').hidden=true;$('veil').dataset.lock='';if(R&&R.running)paused=false;last=performance.now()}

// ---------- shop ----------
let shopTab='kitchen',iapId=null,shopBack=false;   // shopBack: the shop was opened from the pause sheet, closing it returns there
function shopItems(){
  const it=[];const lvl=S.top;
  if(shopTab==='kitchen'){
    it.push({id:'row',ico:`<img src="${SC.icon_5}">`,name:t('i_row',S.rows),desc:t('i_rowD'),cost:ROW_COST,state:S.rows>=MAX_ROWS?'max':''});
    it.push({id:'gas',ico:`<img src="${SC['icon_'+Math.min(S.gas+1,4)]}">`,name:t('i_gas',Math.min(S.gas+1,4)),desc:S.gas>=4?t('i_gasD',GAS[3]*2,GAS[3]*2):t('i_gasD',GAS[S.gas-1]*2,GAS[S.gas]*2),cost:GAS_COST[S.gas],state:S.gas>=4?'max':''});
    if(0)it.push({id:'plate',ico:`<i class="plateico"></i>`,name:t('i_plate',S.plates),desc:t('i_plateD'),cost:PLATE_COST,state:S.plates>=PLATES_MAX?'max':''});
    it.push({id:'mini',ico:`<img src="${BUN('plain','done')}" class="minis">`,name:t('i_mini'),desc:t('i_miniD'),cost:MINI.buy,state:S.mini?'own':lvl<MINI.stage?'lock':'',need:t('needStage',MINI.stage)});
    it.push({id:'fuel',ico:`<img src="${IMGP}butane.svg" style="height:64px">`,name:t('fuel'),desc:t('fuelD',Math.round(fuelLeft()/FUEL_STAGES*100)),cost:FUEL_COST,state:fuelLeft()>=FUEL_STAGES?'max':''});
  }else if(shopTab==='batter'){
    it.push({id:'b_straw',ico:`<img src="${IMGP}tub_batter_straw.webp">`,name:t('i_straw'),desc:t('i_strawD'),cost:BATTER.straw.buy,state:S.batters.includes('straw')?'own':''});
    it.push({id:'b_matcha',ico:`<img src="${IMGP}tub_batter_matcha.webp">`,name:t('i_matcha'),desc:t('i_matchaD'),cost:BATTER.matcha.buy,state:S.batters.includes('matcha')?'own':''});
    it.push({id:'b_choco',ico:`<img src="${IMGP}tub_batter_choco.webp">`,name:t('i_choco'),desc:t('i_chocoD'),cost:0,state:S.top>=CHOCO_STAGE?'own':'lock',need:t('needFree',CHOCO_STAGE)});
  }else if(shopTab==='drink'){
    it.push({id:'m_white',ico:`<img class="ctn" src="${IMGP}carton_white.webp" alt="">`,name:t('i_milk'),desc:t('i_milkD'),cost:MILK.white.buy,state:S.milks.includes('white')?'own':lvl<MILK_STAGE?'lock':'',need:t('needStage',MILK_STAGE)});
    ['straw','choco'].forEach(m=>it.push({id:'m_'+m,ico:`<img class="ctn" src="${IMGP}carton_${m}.webp" alt="">`,name:t('i_m'+m),desc:t('i_mD',money(MILK[m].price)),cost:MILK[m].buy,state:S.milks.includes(m)?'own':!S.milks.includes('white')?'lock':'',need:t('needMilk')}));
  }else if(shopTab==='deco'){
    DECO.forEach(d=>it.push({id:'d_'+d.id,ico:`<img src="${SC['prop_'+d.id]}">`,name:t(d.id),desc:[t('addP',d.add),L[P.lang][d.id+'D']].filter(Boolean).join(' · '),cost:d.cost,state:has(d.id)?'own':orderLeft('d_'+d.id)!=null?'ship':'',need:orderLeft('d_'+d.id)!=null?leftTxt(orderLeft('d_'+d.id)):''}));
  }else{
    it.push({id:'churu1',ico:`<img src="${IMGP}churu_1.webp">`,name:t('churu'),desc:t('churuD',S.churu||0),cost:CHURU_ONE,state:''});
    it.push({id:'churu10',ico:`<img src="${IMGP}churu_10.webp">`,name:t('churu10'),desc:t('churuD',S.churu||0),cost:CHURU_TEN,state:''});
    for(const k in GEM_PACKS)it.push({id:k,ico:`<img class="minis" style="width:68px" src="${IMGP}gem_${GEM_PACKS[k][0]}.webp" alt="">`,name:t('gemPack',GEM_PACKS[k][0]),desc:t('gemPackD'),cost:0,real:GEM_PACKS[k][1],state:''});
    for(const k in PERKS)it.push({id:k,ico:PERKS[k][2].endsWith(".webp")?`<img class="minis" style="width:68px" src="${PERKS[k][2]}" alt="">`:`<span class="iceico">${PERKS[k][2]}</span>`,name:t('pk_'+k),desc:t('pkd_'+k),cost:0,gem:PERKS[k][1],state:S[k]?'own':''});
    it.push({id:'minibag',ico:`<img src="${BUN('plain','done')}" class="minis">`,name:t('miniBag',MINIBAG_PACK),desc:t('miniBagD',S.minibag||0),cost:0,gem:GEM_COST.minibag,state:''});
    it.push({id:'attpack',ico:`<span class="iceico">🎁</span>`,name:t('attPack'),desc:t('attPackD'),cost:0,gem:GEM_COST.attpack,state:''});
    it.push({id:'bake',ico:`<span class="iceico">⚡</span>`,name:t('bake'),desc:t('bakeD',S.bake||0),cost:0,gem:GEM_COST.bake,state:''});
    it.push({id:'ice',ico:`<span class="iceico">❄️</span>`,name:t('ice'),desc:t('iceD',S.ice||0),cost:0,gem:GEM_COST.ice,state:''});
    it.push({id:'cctv',ico:`<img src="${SC.icon_6}">`,name:t('cctv'),desc:t('cctvD'),cost:CCTV_COST,state:S.cctv?'own':''});
    it.push({id:'truck',ico:`<img src="${SC.icon_truck}">`,name:t('truck'),desc:t('truckD'),cost:TRUCK_COST,state:S.truck?'own':''});
  }
  // nothing is hidden (owner's rule): without a Play price a pack shows its list price and buying says the payment is not open in this build
  return it.map(i=>IAP.price[i.id]?{...i,real:IAP.price[i.id]}:i);
}
const iapMock=()=>!!P.iapTest||/[?&]iaptest=1/.test(location.search);   // test builds only
function shopSheet(){
  const tabs=['kitchen','batter','drink','deco','store','xp'];
  const tn={kitchen:'tabKitchen',batter:'tabBatter',drink:'tabDrink',deco:'tabDeco',store:'tabStore',xp:'tabXp'};
  openSheet(`<div class="shop"><button class="xbtn" data-act="close" aria-label="close">✕</button>
    <div class="shophead"><div class="ribbon">${t('shop')}</div><span class="cashpill"><img src="${SC.cashbox}" alt="">${money(S.wallet)}</span><span class="cashpill gempill"><img src="${IMGP}gem_1.webp" alt="">${S.gem||0}<button class="loglink" data-act="gemlog" aria-label="${t('gemLogT')}">📜</button></span></div>
    <div class="tabs">${tabs.map(x=>`<button class="tab${x===shopTab?' on':''}" data-tab="${x}">${t(tn[x])}</button>`).join('')}</div>
    ${shopTab==='xp'?`<div class="xptab">${xpBody()}</div>`:''}<div class="items${shopTab==='deco'||shopTab==='store'?' cards':''}">${(shopTab==='xp'?[]:shopItems()).map(i=>`<div class="item ${i.state}"><div class="iico">${i.ico}</div><div class="itx"><b>${i.name}</b><small>${i.desc}</small></div>
      ${i.state==='max'?`<span class="tag ok">✓ ${t('max')}</span>`:i.state==='own'?`<span class="tag ok">✓ ${t('owned')}</span>`:i.state==='ship'?`<span class="tag ship">${i.id[0]==='d'?'🚚':'🔬'} ${i.need}</span>`:i.state==='lock'?`<span class="tag">🔒 ${i.need}</span>`:
      i.real?`<button class="gbtn sm iap" data-buy="${i.id}">${i.real}</button>`:i.gem?`<button class="gbtn sm iap${(S.gem||0)<i.gem?' poor':''}" data-buy="${i.id}">💎 ${i.gem}</button>`:`<button class="gbtn sm${S.wallet<i.cost?' poor':''}" data-buy="${i.id}">${money(i.cost)}</button>`}</div>`).join('')}</div>
    <button class="gbtn ghost wide" data-act="close">${t('close')}</button>
  </div>`);
}
function buy(id){
  const it=shopItems().find(i=>i.id===id);if(!it||it.state)return;
  // real checkout is js/iap.js; the free mock sheet below is for test builds only (iapMock)
  if(it.real){if(!iapMock())return iapBuy(id);iapId=id;return openSheet(`<div class="pause"><div class="ribbon">${it.name}</div><p class="sub">${t('iapTest',it.real)}</p><div class="row3"><button class="gbtn ghost" data-act="iapno">${t('cancel')}</button><button class="gbtn iap" data-act="iapok">${it.real}</button></div></div>`)}
  if(it.gem)return gemAsk(it);
  if(S.wallet<it.cost){toast(t('tCash'));return}
  S.wallet-=it.cost;
  if(id==='row')S.rows++;else if(id==='gas')S.gas++;else if(id==='plate')S.plates++;else if(id==='mini')S.mini=true;
  else if(id.startsWith('b_'))S.batters.push(id.slice(2));else if(id.startsWith('m_'))S.milks.push(id.slice(2));
  else if(id.startsWith('d_'))placeOrder(id);else if(id==='cctv')S.cctv=true;else if(id==='churu1')S.churu=(S.churu||0)+1;else if(id==='churu10')S.churu=(S.churu||0)+10;else if(id==='truck')S.truck=true;else if(id==='fuel')S.fuelLeft=FUEL_STAGES;
  save();FX.on('buy',{id});if(!id.startsWith('d_'))toast(t('tBought'));drawMap();drawScene();
  if(id==='truck'&&!S.won){S.won=true;save();FX.on('win');openSheet(`<div class="end"><img class="winimg" src="${SC.icon_truck}" alt=""><div class="ribbon">${t('winT')}</div><p class="sub">${t('winP')}</p><button class="gbtn" data-act="close">${t('close')}</button></div>`);return}
  shopSheet();
}

// ---------- settings / pause ----------
// privacy / terms / ad consent / data deletion / contact: what Google Play and AdMob ask an app to offer
function legalSheet(){openSheet(`<div class="pause"><div class="ribbon">📄 ${t('lgMenu')}</div><div class="opts">
  ${[['lg_pp','🔒',t('lgPP')],['lg_tos','📜',t('lgTos')],['lg_ads','📺',t('lgAds')],['lg_del','🗑',t('lgDel')],['lg_mail','✉️',t('lgMail')]].map(([a,i,n])=>`<button class="opt" data-act="${a}"><span>${i} ${n}</span><b>›</b></button>`).join('')}
  <div class="opt"><span>ℹ️ ${t('lgVer')}</span><b>${APP_VER}</b></div></div>
  <button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`)}
function docSheet(title,body,url){openSheet(`<div class="pause doc"><div class="ribbon">${title}</div><div class="doctext">${body}</div>
  ${url?`<a class="gbtn ghost wide" href="${url}" target="_blank" rel="noopener">${t('lgWeb')}</a>`:''}
  <button class="gbtn ghost wide" data-act="legal">${t('close')}</button></div>`)}
let nfOpen=false;   // the notification group stays open across the sheet rebuild an option triggers
function settingsSheet(inStage){
  openSheet(`<div class="pause"><button class="xbtn" data-act="close" aria-label="close">✕</button>
    <div class="ribbon">${inStage?t('pause'):'⚙'}</div>
    ${inStage?`<button class="gbtn big" data-act="close">▶ ${t('resume')}</button>`:''}
    <div class="opts">
      <button class="opt" data-opt="bgm"><span>🎵 ${t('bgm')}</span><b>${P.bgm===false?t('off'):t('on')}</b></button>
      <label class="opt"><span>🎵 ${t('bgmVol')}</span><span class="volrow"><input type="range" id="bgmsel" min="0" max="100" step="5" value="${P.bgmVol??40}" aria-label="${t('bgmVol')}"><b id="bgmnum">${P.bgmVol??40}</b></span></label>
      <button class="opt" data-opt="sound"><span>${t('sound')}</span><b>${P.sound?t('on'):t('off')}</b></button>
      <label class="opt"><span>${t('volume')}</span><span class="volrow"><input type="range" id="volsel" min="0" max="100" step="5" value="${P.vol??100}" aria-label="${t('volume')}"><b id="volnum">${P.vol??100}</b></span></label>
      <label class="opt"><span>${t('language')}</span>${langSel()}</label>
      ${inStage?'':`<button class="opt" data-opt="skin"><span>${t('skin')}</span><b>${P.skin==='phone'?t('retro'):t('modern')}</b></button>
      ${BUILD==='toss'?'':`<button class="opt" data-opt="nfopen"><span>🔔 ${t('nfGroup')}</span><b class="caret">${nfOpen?'⌃':'⌄'}</b></button>`}
      ${nfOpen&&BUILD!=='toss'?`<div class="sub-opts">${['profit','event','back','streak','rank'].map(k=>`<button class="opt sub" data-opt="n_${k}"><span>${t('nf_'+k)}</span><i class="sw${(P.notif||{})[k]===false?'':' on'}"></i></button>`).join('')}</div>`:''}`}
    </div>
    ${inStage?`<button class="gbtn ghost wide" data-act="pshop">🛒 ${t('shop')}</button><div class="row3"><button class="gbtn ghost" data-act="retry">↻ ${t('retry')}</button><button class="gbtn ghost danger" data-act="quit">🚪 ${t('exitGame')}</button></div>`:
      `<button class="gbtn ghost wide" data-act="legal">📄 ${t('lgMenu')}</button><button class="gbtn ghost wide danger" data-act="resetq">${t('reset')}</button><button class="gbtn ghost wide" data-act="close">${t('close')}</button>`}
  </div>`);
}

// ---------- kitchen build ----------
const slotEl=i=>$('grill').children[i];
const plateEl=i=>$('plates').querySelector(`[data-plate="${i}"]`)||$('plates');
const tubEl=(k,v)=>document.querySelector(`[data-tub="${k}:${v}"]`);
function buildKitchen(){
  $('grill').innerHTML=S.slots.map((s,i)=>`<button class="slot" data-slot="${i}" aria-label="mold ${i+1}"><span class="fire"></span><img class="bi" alt=""><span class="crumbs"></span><span class="tagl"></span>
    <span class="ring"><svg viewBox="0 0 100 100"><circle class="rb" cx="50" cy="50" r="40"/><circle class="rf" cx="50" cy="50" r="40" pathLength="100"/></svg><i></i></span>
    <span class="lock">🔒</span>${P.skin==='phone'&&i<9?`<span class="kn">${i+1}</span>`:''}</button>`).join('');
  $('plates')._k=null;$('grill').style.setProperty('--fs',[.7,.85,1,1.2][S.gas-1]);
  const bats=R.sp?SP_BATS:R.ev?['plain','ev']:['plain','straw','choco','matcha'], fills=R.sp?SP_FILLS:['red','cream','pizza','dubai'];
  $('bats').innerHTML=bats.map(b=>`<button class="tub bat" data-tub="b:${b}"><img src="${IMGP}tub_batter_${b==='ev'?EV[season()].look==='plain'?'plain':EV[season()].look:b}.webp" alt=""><span>${b==='ev'?t('ev_'+season()).replace(/ ?붕어빵| bun/,''):t('b_'+b)}</span>${b==='ev'?'<em class="evb">EVENT</em>':''}<i class="lk">🔒</i></button>`).join('')
  $('side').innerHTML=fills.map(f=>`<button class="tub fil" data-tub="f:${f}"><img src="${fillIco(f)}" alt=""><span>${t('f_'+f)}</span><i class="lk">🔒</i></button>`).join('');
  $('mini').innerHTML=`<button class="minipile" data-mini="calm"><span class="pile"></span><b class="mcnt">0</b><small>${t('mini')} · ${t('calm')}</small></button><div class="slock">🔒<small></small></div>`;
  $('milk').innerHTML=`<div class="sttl">${t('milk')}</div>
    <div class="cups">${MILKS.map((m,i)=>`<button class="mcol g-${m}" data-cup="${i}"><img class="ctn" src="${IMGP}carton_${m}.webp" alt=""><span class="cup"><span class="glass"><span class="liq"></span></span><span class="ring sm"><svg viewBox="0 0 100 100"><circle class="rb" cx="50" cy="50" r="40"/><circle class="rf" cx="50" cy="50" r="40" pathLength="100"/></svg></span></span></button>`).join('')}</div><div class="slock">🔒<small></small></div>`;
}

// ---------- cooking ----------
const activeSlots=()=>S.rows*3;
function spend(x){if(S.wallet-x<-3000){toast(t('tCash'));return false}S.wallet-=x;R.costs+=x;return true}
function pour(i,b){const s=S.slots[i];if(!R.sp&&!spend(BATTER[b].cost))return;Object.assign(s,{st:'p1',b,f:null,t:0,crumb:false,gold:false});FX.on('pour',{i})}
function fill(i,f){const s=S.slots[i];if(!R.sp&&!spend(FILL[f].cost))return;s.st='p2';s.f=f;FX.on('fill',{i,f})}
function batterOk(b){if(R.sp)return SP_BATS.includes(b);return b==='plain'||(b==='ev'?evOn():b==='choco'?R.n>=CHOCO_STAGE:S.batters.includes(b))}
const dubaiOk=()=>S.truck||R.n>=UNLOCK_AT('dubai');
function fillOk(f){if(R.sp)return SP_FILLS.includes(f);return f==='red'||f==='cream'||(f==='pizza'&&R.n>=FILL.pizza.stage)||(f==='dubai'&&dubaiOk())}
function tapTub(kind,v){
  const el=tubEl(kind,v);
  if(kind==='b'){
    if(!batterOk(v)){toast(t('tDuring'));shake(el);return}
    selB=v;const i=S.slots.findIndex((s,j)=>j<activeSlots()&&s.st==='empty');
    if(i<0){toast(t('tNoSlot'));shake(el);return}pour(i,v);
  }else{
    if(!fillOk(v)){toast(t('tDuring'));shake(el);return}
    selF=v;const i=S.slots.findIndex((s,j)=>j<activeSlots()&&s.st==='p1');
    if(i<0){toast(t('tNoP1'));shake(el);return}fill(i,v);
  }
}
function tapSlot(i){
  if(i>=activeSlots())return;
  const s=S.slots[i];
  if(s.st==='empty'){if(s.crumb){s.crumb=false;S.wallet+=CRUMB_BONUS;R.earned+=CRUMB_BONUS;gainXP(XP_CLEAN*(R.ev?2:1),slotEl(i));toast(t('tClean'));sfx('clean');return}if(batterOk(selB))pour(i,selB)}
  else if(s.st==='p1'){if(fillOk(selF))fill(i,selF)}
  else if(s.st==='p2'){s.st='c';s.t=0;sfx('pour');FX.on('fill',{i})}
  else if(s.st==='c'){s.st='b';s.t=0;sfx('flip');FX.on('flip',{i});s.fu=performance.now()+650}
  else if(s.st==='b-ready')take(i);
  else if(s.st==='burnt'){Object.assign(s,{st:'empty',b:null,f:null});toast(t('tBurnt'));FX.on('toss',{i})}
}
function take(i){
  const s=S.slots[i],k=s.b+'|'+s.f,perfect=s.t/grace()<.35;
  if(s.gold){S.wallet+=GOLD_PRICE;R.earned+=GOLD_PRICE;toast(t('goldGot',money(GOLD_PRICE)));sfx('tada');FX.on('take',{i,f:s.f});Object.assign(s,{st:'empty',b:null,f:null,t:0,gold:false});return}   // golden bun sells on the spot, no rack space or order needed
  if(R.plates.reduce((a,p)=>a+p.n,0)>=rackN()){toast(t('tFull'));shake($('plates'));return}
  let p=R.plates.findIndex(p=>p.k===k);if(p<0)p=R.plates.findIndex(p=>!p.k);if(p<0)p=R.plates.push({k:null,n:0})-1;
  FX.on('take',{i,f:s.f});if(perfect)gainXP(XP_PERFECT*(R.ev?2:1),slotEl(i),t('perfect'));fly(slotEl(i).querySelector('.bi'),plateEl(p),bunDone(s.b));
  R.plates[p].k=k;R.plates[p].n++;Object.assign(s,{st:'empty',b:null,f:null,t:0});
}
// a copy of the item arcs from one element to another (screen coords; works with the scaled stage)
function fly(fromEl,toEl,src){
  if(!fromEl||!toEl||fxRM())return;const a=fromEl.getBoundingClientRect(),b=toEl.getBoundingClientRect();
  const im=document.createElement('img');im.src=src;im.className='flyer';im.style.width=a.width*.8+'px';document.body.appendChild(im);
  const x0=a.left+a.width*.1,y0=a.top,x1=b.left+b.width/2-a.width*.4,y1=b.top+b.height*.2;
  im.animate([{transform:`translate(${x0}px,${y0}px) scale(1)`},{transform:`translate(${(x0+x1)/2}px,${Math.min(y0,y1)-60}px) scale(1.1)`,offset:.5},{transform:`translate(${x1}px,${y1}px) scale(.6)`,opacity:.9}],{duration:380,easing:'ease-in-out'}).onfinish=()=>im.remove();
}

// ---------- serving ----------
function needOf(k){return R.cust.find(c=>c.state==='wait'&&c.need[k]>0)}
// give one unit of key k to customer c
function giveKey(c,k){
  c.need[k]--;c.dirty=true;sfx('pop');(R.sold=R.sold||{})[k]=(R.sold[k]||0)+1;
  if(R.sp&&++R.got>=SP_NEED){endStage();return}
  const [a]=k.split('|');if(a==='milk')R.drinks++;if(a==='straw'||a==='choco'||a==='matcha')R.special+=1;if(a==='ev')R.event++;
  if(Object.values(c.need).every(n=>n<=0))pay(c);
}
function pay(c){
  if(R.sp){c.state='done';c.left=1.1;c.dirty=true;return}   // bonus game pays one fixed reward at the end
  const T=CT[c.type];
  let sum=T.bundle?price()*10:Object.entries(c.order).reduce((a,[k,n])=>a+unitPrice(k)*n,0);
  if(c.pat/c.max>.6)sum=Math.round(sum*1.1/10)*10;
  if(R.ev)sum*=EVENT_PAY;
  c.state='done';c.left=1.1;c.dirty=true;
  if(c.type==='bully'&&Math.random()<(S.cctv?.08:.35)){FX.on('run',{id:c.id,pay:sum});toast(t('tRun',money(sum)));sfx('bad');R.ran=(R.ran||0)+1;c.ran=true;c.left=.7;c.el.classList.add('runner');return}
  S.wallet+=sum;R.earned+=sum;R.served++;gainXP(sum);S.soldN=(S.soldN||0)+(T.bundle?12:Object.values(c.order).reduce((a,n)=>a+n,0));S.revN=(S.revN||0)+sum;
  flyCoins(c.id,sum);FX.on('serve',{id:c.id,pay:sum,type:c.type});
}
const MILKS=['white','straw','choco'];   // glass i always holds this milk
function tapCup(i){
  const cp=R.cups[i];if(!cp){fillCup(i);return}if(cp.st!=='ready')return;
  const k='milk|'+cp.m,c=needOf(k);if(!c){toast(t('tNoOne'));shake($('milk').querySelectorAll('.cup')[i]);return}
  fly($('milk').querySelectorAll('.cup')[i],c.el.querySelector('.bub'),'');R.cups[i]=null;giveKey(c,k);
}
function fillCup(i){const m=MILKS[i];
  if(!S.milks.includes(m)||R.n<MILK_STAGE){toast(t('tDuring'));return}
  if(!spend(MILK_COST))return;R.cups[i]={m,st:'fill',t:0};beep([392,523],.35,{type:'sine',vol:.08,gap:.12});
}
const miniN=()=>R.minis+(S.minibag||0);
function useMini(){if(R.minis>0)R.minis--;else{S.minibag--;save()}}
function tapMini(act){
  if(act==='cook'){
    if(!S.mini){toast(t('tDuring'));return}
    const m=R.miniSt;if(m.st==='idle'){if(!spend(MINI.cost))return;m.st='cook';m.t=0;sfx('pour')}
    else if(m.st==='ready'){R.minis=Math.min(MINI.cap,R.minis+MINI.yield);m.st='idle';sfx('sparkle');FX.on('take',{i:-1})}
    return;
  }
  if(R.minis<=0&&!(S.minibag>0)){toast(t('tNoMini'));shake($('mini').querySelector('.minipile'));return}
  let c=needOf('mini');
  if(c){useMini();fly($('mini').querySelector('.minipile'),c.el.querySelector('.bub'),BUN('plain','done'));giveKey(c,'mini');R.calms++;return}
  c=R.cust.filter(c=>c.state==='wait'&&c.pat/c.max<.5).sort((a,b)=>a.pat/a.max-b.pat/b.max)[0];
  if(!c){toast(t('tAngry'));return}
  useMini();R.calms++;c.pat=Math.min(c.max,c.pat+c.max*MINI.calm);c.dirty=true;gainXP(XP_CALM*(R.ev?2:1),c.el);
  fly($('mini').querySelector('.minipile'),c.el.querySelector('.bub'),BUN('plain','done'));
  toast(t('tCalm'));sfx('chirp');FX.on('serve',{id:c.id,pay:0,type:c.type});
}

// ---------- customers ----------
function availFills(){return ['red','cream'].concat(R.n>=FILL.pizza.stage?['pizza']:[],dubaiOk()?['dubai']:[])}
function pickBatter(){
  const w=R.ev?[['ev',6],['plain',2]]:[['plain',6]].concat(S.batters.includes('straw')?[['straw',2]]:[],S.batters.includes('matcha')?[['matcha',2]]:[],R.n>=CHOCO_STAGE?[['choco',2]]:[]);
  let r=Math.random()*w.reduce((a,x)=>a+x[1],0);for(const [b,x] of w){r-=x;if(r<=0)return b}return 'plain';
}
function genOrder(type){
  const T=CT[type],o={};
  // later stages order a bit more, never above MAX_ORDER
  const fills=availFills(),n=Math.min(M().order,M().plus+rnd(T.lo,T.hi)+(type==='family'&&R.n>=UNLOCK_AT('group')?2:0)+(Math.random()<dif()*.6?1:0)),kinds=R.n>=UNLOCK_AT('kinds3')?3:2;
  for(let i=0;i<n;i++){
    const b=pickBatter();let f=T.like&&fills.includes(T.like)&&Math.random()<.6?T.like:pick(fills);
    if(b==='ev')f=EV[season()].fill;
    let k=b+'|'+f;if(Object.keys(o).length>=kinds&&!o[k])k=Object.keys(o)[0];
    o[k]=(o[k]||0)+1;
  }
  if(S.milks.length&&R.n>=MILK_STAGE&&Object.keys(o).length<2&&n<M().order&&Math.random()<.4)o['milk|'+pick(S.milks)]=1;   // at most two pictures per bubble
  if(T.mini)o.mini=1;
  return o;
}
function spawn(forceType,forceOrder){
  const xs=maxCust()===2?[190,480]:[110,330,550];$('custs').classList.toggle('four',maxCust()===4);
  const used=R.cust.filter(c=>c.state!=='gone').map(c=>c.spot),spot=xs.findIndex((_,i)=>!used.includes(i));if(spot<0)return;
  const pool=Object.entries(CT).filter(([k,v])=>R.n>=v.stage&&(!v.night||R.night)&&(!v.mini||S.mini));
  const jf=[1,1,.7,.3][stallLv()];
  let tot=pool.reduce((a,[k,v])=>a+v.w*(k==='jerk'?jf:1),0),r=Math.random()*tot,type=forceType||'kid';
  if(!forceType)for(const [k,v] of pool){r-=v.w*(k==='jerk'?jf:1);if(r<=0){type=k;break}}
  const T=CT[type],img=pick(T.img),order=forceOrder||genOrder(type);
  // patience eases down 25% across stages 1-40, plus a lunch-rush cut from its unlock stage
  const max=T.pat*M().pat*(S.pat2?1.5:1)*(1-.3*dif())*(R.n>=UNLOCK_AT('lunch')?.9:1)*[1,.95,.85,.75][S.gas-1]*(R.boost.stove?1.3:1)*(R.boost.stool?1.25:1)*(T.elder&&has('flower')?1.2:1);
  const c={id:++cid,type,spot,x:xs[spot],img,pose:T.pose&&T.pose[img],order,need:{...order},pat:max,max,state:'wait',age:0,dirty:true};
  const el=document.createElement('div');el.className='cu';el.dataset.cust=c.id;el.style.left='820px';
  el.innerHTML=`<div class="bub">${T.bundle?`<em class="pk">${t('pack')}</em>`:''}${T.mini?`<em class="pk red">${t('wantsMini')}</em>`:''}<div class="its"></div><div class="pat"><i></i></div></div>
    <img class="cimg" alt="" style="${T.tint?`filter:${T.tint}`:''}"><span class="mad">💢</span><span class="nm">${t(type)}</span>`;
  $('custs').appendChild(el);c.el=el;R.cust.push(c);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.left=c.x+'px'}));
  beep([880],.08,{vol:.05});
}
function custImg(c){
  if(!c.pose)return CIMG[c.img];
  if(c.ran&&CPOSE[c.pose+'_run'])return CPOSE[c.pose+'_run'];
  const n=c.state==='done'?4:c.pat/c.max<.35?3:c.age<1.6?1:2;return CPOSE[`${c.pose}_${n}`];
}
function leave(c,angry){
  c.state='gone';const el=c.el;el.classList.add('out');el.style.left=(c.ran?980:angry?-260:c.x<360?-260:980)+'px';
  setTimeout(()=>el.remove(),900);
  if(angry){R.walk++;toast(t('tLeft',t(c.type)));FX.on('leave',{id:c.id,type:c.type})}
}

// ---------- tick ----------
function tick(dt){
  if(!R||!R.running||paused)return;
  coachTick();const fz=R.coach!=null;
  if(!fz)R.t+=dt;
  if(!R.night&&R.t>=R.dur*NIGHT_AT){R.night=true;FX.on('night');drawScene()}
  const ck=cook(),gr=grace();
  S.slots.forEach((s,i)=>{if(i>=activeSlots())return;
    if(s.st==='c')s.t+=dt;   // time since covered: after 1.5s the flip arrow shows
    if(s.st==='a'||s.st==='b'){s.t+=dt;if(s.t>=ck){s.st+='-ready';s.t=0;s.hold=0;beep([1047,1568],.18,{gap:.07,vol:.07})}}
    else if(s.st.endsWith('-ready')){if(s.hold>0)s.hold-=dt;else if(!(R.ice>0))s.t+=dt;if(s.t>=gr){s.st='burnt';R.burnt++;FX.on('burn',{i})}}});
  if(!R.sp&&!R.ev&&R.n%GOLD_EVERY===0&&!R.gold&&!fz)goldTick(dt);
  if(R.ice>0)R.ice-=dt;
  const m=R.miniSt;if(m.st==='cook'){m.t+=dt;if(m.t>=MINI.time){m.st='ready';beep([1319,1760],.18,{gap:.07,vol:.07})}}
  R.cups.forEach(cp=>{if(cp&&cp.st==='fill'){cp.t+=dt;if(cp.t>=MILK_TIME)cp.st='ready'}});
  R.cust.forEach(c=>{c.age+=dt;
    if(c.state==='wait'){if(!fz&&!R.sp)c.pat-=dt;if(c.pat<=0)leave(c,true)}
    else if(c.state==='done'){c.left-=dt;if(c.left<=0)leave(c,false)}});
  R.cust=R.cust.filter(c=>c.state!=='gone');
  if(fz)return;
  if(R.sp){if(R.cust.length<2&&(R.spT-=dt)<=0){spawn(pick(['kid','family']),spOrder());R.spT=1}if(R.t>=R.dur)endStage();return}
  if(R.nextSpawn>1e8)R.nextSpawn=3;   // coach finished: customers start coming
  if(R.t<R.dur-10){R.nextSpawn-=dt;if(R.nextSpawn<=0){if(R.cust.length<maxCust())spawn();
    const nf=R.night?1.2+(has('lantern')?.15:0)+(has('lights')?.25:0):1;
    R.nextSpawn=SPAWN_GAP+M().gap+(5-4*dif())*(R.n>=UNLOCK_AT('rush')?.85:1)/nf/(S.truck?1.3:1)*(.5+Math.random())}}
  const stock=R.plates.some(p=>p.n>0);
  if(!R.cat){R.nextCat-=dt;if(R.nextCat<=0&&stock){R.cat={left:3.5};sfx('meow');FX.on('catIn')}}
  else if(R.cat.eat!=null){R.cat.eat-=dt;if(R.cat.eat<=0){R.cat=null;R.nextCat=rnd(35,70)}}
  else{R.cat.left-=dt;if(R.cat.left<=0){
    if((S.churu||0)>0){S.churu--;R.cat.eat=1.8;toast(t('tChuru'));sfx('chirp')}
    else{const ps=R.plates.filter(p=>p.n>0);if(ps.length){const p=pick(ps);p.n--;if(!p.n)p.k=null;toast(t('tCat'));FX.on('catSteal')}R.cat=null;R.nextCat=rnd(35,70)}}}
  if(!R.cust.some(c=>c.state==='wait')){R.nextCrumb-=dt;if(R.nextCrumb<=0){const e=S.slots.map((s,i)=>i).filter(i=>i<activeSlots()&&S.slots[i].st==='empty'&&!S.slots[i].crumb);if(e.length)S.slots[pick(e)].crumb=true;R.nextCrumb=rnd(4,7)}}
  if(R.t>=R.dur)endStage();
}

// every 3rd stage, once and at random: with the grill full, one bun turns golden and all of them finish at once
function goldTick(dt){
  const act=S.slots.slice(0,activeSlots());
  if(act.some(s=>s.st==='empty')||Math.random()>dt*.35)return;   // about 3s after the grill fills
  const on=act.filter(s=>s.f&&s.st!=='burnt');if(!on.length)return;
  R.gold=true;pick(on).gold=true;
  on.forEach(s=>{if(!s.st.endsWith('-ready')){s.st='b-ready';s.t=0}s.hold=BAKE_HOLD});
  toast(t('goldOn'));sfx('sparkle');
}

// ---------- drawing ----------
const setSrc=(im,src)=>{if(im&&im._s!==src){im._s=src;im.src=src}};
function ringSet(el,p,col,ico){if(!el)return;const f=el.querySelector('.rf');f.style.strokeDasharray=`${Math.max(0,Math.min(100,p*100))} 100`;f.style.stroke=col;const i=el.querySelector('i');if(i&&i._t!==ico){i._t=ico;i.textContent=ico}}
function slotImg(s){
  const look=s.b==='ev'?EV[season()].look:s.b;
  return s.st==='p1'?BUN(look,'batter'):s.st==='p2'?BUN(look,'fill_'+s.f):s.st==='c'?BUN(look,'cover')
    :s.st==='b'?BUN(look,s.t<cook()/3?'cook1':s.t<cook()*2/3?'cook2':'cook3'):s.st==='b-ready'?(s.b==='ev'?bunDone('ev'):BUN(look,'done')):BUN('plain','burnt');
}
function drawScene(){
  const lv=stallLv(),bg={1:['bg_wood_day','bg_wood_night'],2:['bg_green','bg_green'],3:['bg_truck_day','bg_truck_night']}[lv];
  $('bgd').style.backgroundImage=`url(${SC[bg[0]]})`;$('bgn').style.backgroundImage=`url(${SC[bg[1]]})`;
  $('scene').className=`lv${lv}${R&&R.night?' night':''}`;
  $('props').innerHTML=DECO_NEW.filter(has).map(k=>`<img class="p-${k}" src="${SC['prop_'+k]}" alt="">`).join('')+(lv===3?'':(has('lights')?`<img class="p-lights" src="${SC.prop_lights}" alt="">`:'')+(has('lantern')&&lv===1?`<img class="p-lantern" src="${SC.prop_lantern}" alt="">`:'')
    +(has('sign')?`<img class="p-sign" src="${SC.prop_sign}" alt="">`:'')+(has('flower')?`<img class="p-flower" src="${SC.prop_flower}" alt="">`:''));
  $('counter').className=has('cloth')?'cloth':'';
}
function draw(){
  if(!R||!R.running)return;
  // HUD
  fuelBar();
  const left=Math.max(0,R.dur-R.t),pct=R.sp?R.got/SP_NEED:Math.min(1,R.earned/(R.goal*1.5));$('hud').classList.toggle('spg',!!R.sp);
  $('hstage').textContent=R.sp?'📦':R.n;$('hcash').textContent=money(S.wallet);{const l=lvlOf(S.xpTotal||0);$('hlv').textContent=l;$('hxpf').style.width=((S.xpTotal-lvlXp(l))/(lvlXp(l+1)-lvlXp(l))*100)+'%'}
  $('gfill').style.width=pct*100+'%';$('gtxt').textContent=R.sp?`📦 ${R.got} / ${SP_NEED}`:`${money(R.earned)} / ${money(R.goal)}`;
  $('gs1').classList.toggle('on',R.earned>=R.goal);$('gs3').classList.toggle('on',R.earned>=R.goal*1.5);
  $('tnum').textContent=Math.ceil(left);$('tico').textContent=R.night?'🌙':'☀️';
  $('clock').querySelector('.rf').style.strokeDasharray=`${left/R.dur*100} 100`;$('clock').classList.toggle('hurry',left<15);
  $('grill').classList.toggle('iced',R.ice>0);{const h=$('hice');h.classList.toggle('on',R.ice>0);h.querySelector('b').textContent=R.ice>0?Math.ceil(R.ice)+'s':(S.ice||0);$('hbake').querySelector('b').textContent=S.bake||0}
  // molds
  const ck=cook(),gr=grace(),els=$('grill').children;
  S.slots.forEach((s,i)=>{const el=els[i];if(!el)return;const lock=i>=activeSlots();
    el.className='slot'+(lock?' locked':'')+(s.st.endsWith('-ready')?' ready':'')+(s.st==='burnt'?' burnt':'')+(s.crumb?' crumb':'')+(s.b==='ev'?' ev':'')+(s.gold&&s.st!=='empty'&&s.st!=='burnt'?' gold':'')+(s.fu>performance.now()?' flipping':'')+(s.st==='b'||s.st==='b-ready'?' fl':'')+(s.st==='b-ready'&&s.hold>0?' inst':'')+(s.st==='c'&&s.t>1.5?' toflip':'');
    const im=el.querySelector('.bi');if(s.st==='empty'||lock){im.style.visibility='hidden'}else{im.style.visibility='';setSrc(im,slotImg(s))}
    const rg=el.querySelector('.ring');const tg=el.querySelector('.tagl');
    if(s.st==='a'||s.st==='b'){rg.style.display='';ringSet(rg,s.t/ck,'#3aa6ff','🔥')}
    else if(s.st.endsWith('-ready')){const q=s.t/gr;rg.style.display='';ringSet(rg,1-q,`hsl(${Math.round(125*(1-q))} 85% 50%)`,s.st==='a-ready'?'↻':'✓');el.classList.toggle('danger',q>.55)}
    else rg.style.display='none';
    const tx=s.st==='p1'?t('f_'+selF)+' +':s.st==='p2'?t('cover'):s.st==='c'?t('flipTag'):'';if(tg._t!==tx){tg._t=tx;tg.textContent=tx}});
  // plates
  {const rk=$('plates'),cap=rackN(),tot=R.plates.reduce((a,p)=>a+p.n,0),key=R.plates.map(p=>p.k+':'+p.n).join()+'/'+cap;
  if(rk._k!==key){rk._k=key;const cols=R.plates.reduce((a,p)=>a+Math.ceil(p.n/4),0);
    rk.style.setProperty('--cw',Math.min(52,560/Math.max(1,cols))+'px');
    const RO=k=>{const [b,f]=k.split('|');return ['plain','ev','straw','choco','matcha'].indexOf(b)*10+['red','cream','pizza','dubai'].indexOf(f)};   // rack order: plain, strawberry, milk choco; fillings red bean > cream > pizza > Dubai
    rk.innerHTML=R.plates.map((p,i)=>[p,i]).filter(([p])=>p.k&&p.n).sort((x,y)=>RO(x[0].k)-RO(y[0].k)).map(([p,i])=>p.k&&p.n?`<button class="plate has" data-plate="${i}" style="--c:${Math.ceil(p.n/4)}">${Array.from({length:p.n},(_,j)=>`<img src="${bunDone(p.k.split('|')[0])}" style="--x:${j>>2};--y:${j&3}" alt="">`).join('')}${pill(p.k)}${p.n>1?`<b class="cnt">×${p.n}</b>`:''}</button>`:'').join('')
      +`<span class="rackcap${tot>=cap?' full':''}">${tot}/${cap}</span>`}}
  // mini
  const mi=$('mini');mi.classList.toggle('locked',!S.mini&&miniN()<=0);mi.classList.toggle('nomold',!S.mini);
  mi.querySelector('.slock small').textContent=S.top<MINI.stage?t('needStage',MINI.stage):t('shop');
  const mc=mi.querySelector('.mcnt'),mn=miniN();if(mc._n!==mn){mc._n=mn;mc.textContent=mn;mi.querySelector('.pile').innerHTML=`<img src="${BUN('plain','done')}" alt="">`.repeat(Math.min(5,mn))}
  mi.querySelector('.minipile').classList.toggle('glow',miniN()>0&&R.cust.some(c=>c.state==='wait'&&(c.pat/c.max<.35||c.need.mini>0)));
  // milk
  const mk=$('milk'),mOn=S.milks.includes('white')&&R.n>=MILK_STAGE;mk.classList.toggle('locked',!mOn);
  mk.querySelector('.slock small').textContent=R.n<MILK_STAGE?t('needStage',MILK_STAGE):t('shop');
  mk.querySelectorAll('.mcol').forEach((b,i)=>b.classList.toggle('off',!S.milks.includes(MILKS[i])));
  mk.querySelectorAll('.cup').forEach((el,i)=>{const cp=R.cups[i];el.className='cup'+(cp?' m-'+cp.m+' '+cp.st:'');
    el.querySelector('.liq').style.height=cp?(cp.st==='ready'?100:cp.t/MILK_TIME*100)+'%':'0';
    const rg=el.querySelector('.ring');if(cp&&cp.st==='fill'){rg.style.display='';ringSet(rg,cp.t/MILK_TIME,'#3aa6ff','')}else rg.style.display='none'});
  // tubs
  document.querySelectorAll('.tub').forEach(el=>{const [k,v]=el.dataset.tub.split(':');const ok=k==='b'?batterOk(v):fillOk(v);
    el.classList.toggle('lockd',!ok);el.classList.toggle('sel',ok&&(k==='b'?selB:selF)===v)});
  // customers
  R.cust.forEach(c=>{const el=c.el;const r=c.pat/c.max;
    if(c.dirty){c.dirty=false;el.querySelector('.its').classList.toggle('col',Object.keys(c.need).length>=3);el.querySelector('.its').innerHTML=Object.entries(c.need).map(([k,n])=>`<span class="it${n<=0?' done':''}" title="${keyName(k)}">${icon(k)}<b class="qty">${n>0?n:'✓'}</b>${pill(k)}</span>`).join('')}
    const ci=el.querySelector('.cimg'),src=custImg(c);if(ci._s!==src){setSrc(ci,src);ci.style.height=(CH[src]||240)*.8+'px'}
    const bar=el.querySelector('.pat i');bar.style.width=Math.max(0,r)*100+'%';bar.style.background=r<.35?'#ff5a4a':r<.6?'#ffc23d':'#46d06a';
    el.classList.toggle('angry',c.state==='wait'&&r<.35);el.classList.toggle('happy',c.state==='done'&&!c.ran)});
  // cat
  $('cat').hidden=!R.cat;if(R.cat)setSrc($('catimg'),SC['cat_'+(R.cat.eat!=null?1:R.cat.left>2.2?1:2)]);$('catchuru').hidden=!(R.cat&&R.cat.eat!=null);
  const ch=$('churu');ch.hidden=!(S.churu>0);if(ch._n!==S.churu){ch._n=S.churu;ch.querySelector('b').textContent=S.churu}
  hint();coachDraw();
}

// ---------- onboarding coach: one instruction at a time, the spotlighted thing is the only thing that reacts ----------
const COACH=[
  {k:'c0'},
  {k:'c1',el:()=>tubEl('b','plain'),ok:()=>S.slots[0].st!=='empty'},
  {k:'c2',el:()=>tubEl('f','red'),ok:()=>S.slots[0].st==='p2'},
  {k:'c3',el:()=>slotEl(0),ok:()=>S.slots[0].st==='c'},
  {k:'c5',el:()=>slotEl(0),ok:()=>S.slots[0].st==='b'},
  {k:'c4',el:()=>slotEl(0),wait:true,ok:()=>S.slots[0].st==='b-ready'},
  {k:'c6',el:()=>slotEl(0),ok:()=>R.plates.some(p=>p.n>0)},
  {k:'c7',el:()=>R.plates.findIndex(p=>p.n>0)>=0?plateEl(R.plates.findIndex(p=>p.n>0)):plateEl(0),ok:()=>R.served>0},
  {k:'c8'},
];
function coachTick(){
  if(R.coach==null)return;const st=COACH[R.coach];
  if(st.ok&&st.ok()){R.coach++;beep([880,1320],.15,{gap:.06,vol:.08})}
  if(S.slots[0].st==='burnt'){Object.assign(S.slots[0],{st:'empty',b:null,f:null});R.coach=1}   // keep the lesson on track
}
function coachDraw(){
  const c=$('coach');if(!R||!R.running||R.coach==null){c.hidden=true;return}
  const st=COACH[R.coach],n=COACH.length;c.hidden=false;
  const p=c.querySelector('p');if(p._k!==R.coach+P.lang){p._k=R.coach+P.lang;p.textContent=t(st.k);c.querySelector('small').textContent=`${R.coach+1} / ${n}`;
    c.querySelector('[data-coach="next"]').hidden=!!st.el;c.querySelector('[data-coach="next"]').textContent=R.coach===n-1?t('coachGo'):t('coachNext')}
  const hole=c.querySelector('.hole'),bub=c.querySelector('.cbub');
  if(!st.el){hole.style.cssText='left:360px;top:640px;width:0;height:0';c.classList.add('center');return}
  c.classList.remove('center');
  const app=$('app').getBoundingClientRect(),k=app.width/W,r=st.el().getBoundingClientRect();
  const x=(r.left-app.left)/k-10,y=(r.top-app.top)/k-10,w=r.width/k+20,h=r.height/k+20;
  hole.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;c.classList.toggle('wait',!!st.wait);
}
function coachGate(b){
  if(!R||!R.running||R.coach==null)return false;
  if(b.dataset.coach)return false;
  if(b.id==='hpause')return false;
  const st=COACH[R.coach];return !st.el||st.wait||!st.el().contains(b);
}

// first-stage pointing finger
let hintAt=0;
function hint(){
  const f=$('finger'),h=$('hint');
  if(!R.tut||R.coach!=null){f.hidden=true;h.hidden=true;return}
  const now=performance.now();if(now-hintAt<200)return;hintAt=now;
  const n=activeSlots(),sl=S.slots;let el=null,key='';
  let i=sl.findIndex((s,j)=>j<n&&s.st.endsWith('-ready'));
  if(i>=0){el=slotEl(i);key=sl[i].t/grace()>.55?'h_red':sl[i].st==='a-ready'?'h_flip':'h_take'}
  else if((i=sl.findIndex((s,j)=>j<n&&s.st==='c'))>=0){el=slotEl(i);key='h_flip2'}
  else if((i=sl.findIndex((s,j)=>j<n&&s.st==='p2'))>=0){el=slotEl(i);key='h_cover'}
  else if((i=sl.findIndex((s,j)=>j<n&&s.st==='p1'))>=0){const c=R.cust.find(c=>c.state==='wait');const want=c&&Object.keys(c.need).find(k=>c.need[k]>0&&!k.startsWith('milk')&&k!=='mini');el=tubEl('f',want?want.split('|')[1]:'red');key='h_fill'}
  else if((i=R.plates.findIndex(p=>p.k&&needOf(p.k)))>=0){el=plateEl(i);key='h_serve'}
  else if(sl.some((s,j)=>j<n&&s.st==='empty')){el=tubEl('b','plain');key='h_batter'}
  else if((i=sl.findIndex((s,j)=>j<n&&(s.st==='a'||s.st==='b')))>=0){el=slotEl(i);key='h_wait'}
  if(!el){f.hidden=true;h.hidden=true;return}
  const app=$('app').getBoundingClientRect(),r=el.getBoundingClientRect(),k=app.width/W;
  f.hidden=false;f.style.left=((r.left-app.left+r.width*.55)/k)+'px';f.style.top=((r.top-app.top+r.height*.45)/k)+'px';
  h.hidden=false;if(h._k!==key){h._k=key;h.textContent=t(key)}
}

// ---------- map (staircase) ----------
// stage map: the painted snowy road; 10 stages per page, each a numbered bungeoppang (gold = open, grey = locked)
let mapPage=null;
const sprite=(n,lock)=>`background-image:url(${IMGP}${lock?'map_lock':'map_open'}.webp);background-position:${((n-1)%6)*20}% ${Math.floor((n-1)/6)*100/9}%`;
function drawMap(){fuelBar();
  const m=$('map');if(m.hidden)return;
  $('mcash').textContent=money(S.wallet);$('mxp').innerHTML=`⭐ Lv.${lvlOf(S.xpTotal||0)} <small>${fmt(S.xp||0)} XP</small>`;$('mtitle').textContent=t('title');typeof liveDraw==='function'&&liveDraw();
  const top=Math.min(S.top,STAGES),pages=STAGES/10;if(mapPage===null)mapPage=Math.floor((top-1)/10);
  const first=mapPage*10+1,adv=!!S.adv&&top<STAGES;
  $('stairs').innerHTML=`<button class="mpg prev" data-page="-1" ${mapPage?'':'disabled'} aria-label="previous">◀</button>
    <span class="mpgl">${t('stageRange',first,first+9)}</span>
    <button class="mpg next" data-page="1" ${mapPage<pages-1?'':'disabled'} aria-label="next">▶</button>`
   +(()=>{const a=ROAD[top-1-(first-1)],b=ROAD[top-(first-1)];if(!adv||!a||!b)return '';   // next node on another page: no trail
    return [1,2,3,4,5].map(i=>`<i class="advdot" style="left:${a[0]+(b[0]-a[0])*i/6}%;top:${a[1]+(b[1]-a[1])*i/6}%;--i:${i}"></i>`).join('')+`<i class="advhop" style="--x0:${a[0]}%;--y0:${a[1]}%;--x1:${b[0]}%;--y1:${b[1]}%"><img src="${BUN('plain','done')}" alt=""></i>`})()
   +ROAD.map(([x,y],k)=>{const n=first+k,st=S.stars[n]||0,lock=n>S.top,cur=n===top,done=st>0&&!cur,ms=MILESTONE[n],right=x>50;
    return `<button class="mnode ${lock?'lock':cur?'cur':done?'done':'open'}${adv&&cur?' adv-from':''}${adv&&n===top+1?' adv-to':''}" data-stage="${n}" style="left:${x}%;top:${y}%" ${lock?'disabled':''} aria-label="${t('stageN',n)}">
      <span class="msp" style="${sprite(n,lock)}"></span>
      ${done?`<span class="mchk">✓</span><span class="mdone">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span>`:''}
      ${cur&&!adv?`<span class="mnext">${t('nextUp')}</span><span class="spark"></span>`:''}${adv&&n===top+1?`<span class="mnext">${t('nextUp')}</span><span class="spark"></span>`:''}
      ${ms?`<span class="ms ${right?'l':'r'}">${t('ms_'+ms)}</span>`:''}</button>`}).join('');
  $('mrank').innerHTML=`<i>🏆</i><span>${t('rank')}</span>`;document.querySelectorAll('#mmode button[data-mode]').forEach(b=>{b.classList.toggle('on',P.mode===b.dataset.mode);const s=t(b.dataset.mode==='easy'?'mEasy':'mHard'),i=s.split(' ')[0];b.innerHTML=`<i>${i}</i><span>${s.slice(i.length+1).replace('\n','<br>')}</span>`});
  $('mstart').textContent=adv?`🔓 ${t('advGo')}`:`▶ ${t('stageN',S.top)}`;$('mstart').classList.toggle('advgo',adv);$('mshop').innerHTML=`<img src="${IMGP}ic_shop.webp" alt=""><span>${t('shop')}</span>`;$('mprep').innerHTML=`🥄 ${t('prep')} <em>${S.prep||0}</em>`;
  $('mevent').innerHTML=`<img src="${bunDone('ev')}" alt=""><span><b>${t('evTitle',t('s_'+season()))}</b><small>${t('ev_'+season())} · ${t('evPay')}</small></span>`;
}
function unlockNext(){if(!S.adv)return;S.adv=false;S.top++;S.fuelLeft=Math.max(0,fuelLeft()-1);save();mapPage=Math.floor((Math.min(S.top,STAGES)-1)/10);drawMap();
  const c=document.querySelector('.mnode.cur');c&&c.classList.add('pop');FX.on('buy');beep([660,990,1320],.25,{gap:.08})}
function showMap(){if(R)R.running=false;mapPage=null;$('map').hidden=false;$('finger').hidden=true;$('hint').hidden=true;$('coach').hidden=true;drawMap();typeof askNotif==='function'&&setTimeout(()=>$('veil').hidden&&askNotif(),500)}

// ---------- input ----------
function act(a){
  if(a==='close'){if(shopBack&&R&&R.running){shopBack=false;buildKitchen();settingsSheet(true)}else{shopBack=false;closeSheet(true)}}
  else if(a==='pshop'){shopBack=true;shopTab='kitchen';shopSheet()}
  else if(a==='quit')openSheet(`<div class="pause"><div class="ribbon">🚪</div><p class="sub big">${t('quitAsk')}</p><p class="sub">${t('quitD')}</p>
    <div class="row3"><button class="gbtn ghost" data-act="quitno">${t('quitNo')}</button><button class="gbtn danger" data-act="map">${t('exitGame')}</button></div></div>`)
  else if(a==='quitno')settingsSheet(true);
  else if(a==='map'){closeSheet(true);interAd(showMap)}
  else if(a==='retry'){closeSheet(true);preStage(R.n)}
  else if(a==='next'){closeSheet(true);interAd(()=>S.adv?showMap():preStage(Math.min(S.top,R.n+1)))}
  else if(a==='fuelshop'){shopTab='store';shopSheet()}
  else if(a==='iapok'){iapGrant(iapId);save();FX.on('buy');shopSheet()}
  else if(a==='iapno')shopSheet();
  else if(a==='gemlog')gemLog();else if(a==='gemok')gemSpend();else if(a==='gemno')shopSheet();
  else if(a==='dbl'){if(R.dbl)return;showAd(()=>{if(R.dbl)return;R.dbl=true;S.wallet+=R.earned;save();
    const b=$('dbl');if(b){b.disabled=true;b.textContent=t('dblGot',money(R.earned))}const c=$('countup');if(c)countUp(c,R.earned*2);sfx('coin')})}
  else if(a==='cont'){showAd(()=>{R.contUsed=true;R.dur+=30;R.ended=false;R.running=true;closeSheet(true)})}
  else if(a==='legal')legalSheet();
  else if(a==='lg_pp')docSheet(t('lgPP'),t('ppText'),PRIVACY_URL);
  else if(a==='lg_tos')docSheet(t('lgTos'),t('tosText'),TERMS_URL);
  else if(a==='lg_ads'){const f=window.adPrivacyOptions;f?f():toast(t('lgAppOnly'))}   // app shell: AdMob UMP showPrivacyOptionsForm
  else if(a==='lg_del')docSheet(t('lgDel'),t('delText'),DELETE_URL);
  else if(a==='lg_mail'){SUPPORT_EMAIL?location.href='mailto:'+SUPPORT_EMAIL:toast(t('lgSoon'))}
  else if(a==='resetq')openSheet(`<div class="pause"><div class="ribbon">${t('reset')}</div><p class="sub">${t('resetQ')}</p><div class="row3"><button class="gbtn ghost" data-act="close">${t('cancel')}</button><button class="gbtn danger" data-act="reset">${t('yes')}</button></div></div>`);
  else if(a==='langok'){P.langChosen=true;savePref();closeSheet(true);nameSheet()}
  else if(a==='reset'){S=fresh();S.slots=[];save();closeSheet(true);showMap();toast(t('tOpen'))}
}
function langSel(){return `<select id="langsel">${LANGS.map(([c,n])=>`<option value="${c}"${c===P.lang?' selected':''}>${n}</option>`).join('')}</select>`}
function applyLang(){document.title=t('title');document.documentElement.lang=P.lang;$('app').classList.toggle('rtl',P.lang==='ar');buildKeypad()}
document.addEventListener('input',e=>{if(e.target.id!=='volsel')return;P.vol=+e.target.value;$('volnum').textContent=P.vol;if(P.vol>0&&!P.sound){P.sound=true}});
document.addEventListener('change',e=>{if(e.target.id==='volsel'){savePref();sfx('coin');return}if(e.target.id!=='langsel')return;P.lang=e.target.value;savePref();applyLang();
  const pick=e.target.closest('.langpick');
  if(pick){drawMap();pick.querySelector('[data-act=langok]').textContent=t('ok');return}
  if(R&&R.running){buildKitchen();R.cust.forEach(c=>{c.dirty=true;c.el.querySelector('.nm').textContent=t(c.type)})}
  drawMap();settingsSheet(R&&R.running)});
function opt(o){
  if(o==='nfopen'){nfOpen=!nfOpen;return settingsSheet(R&&R.running)}
  if(o==='sound')P.sound=!P.sound;
  else if(o==='bgm'){P.bgm=P.bgm===false;if(P.bgm&&!(P.bgmVol>0))P.bgmVol=40;bgmApply()}
  else if(o.startsWith('n_')){const k=o.slice(2);P.notif=P.notif||{};P.notif[k]=P.notif[k]===false;planNotifs()}
  else if(o==='skin'){P.skin=P.skin==='phone'?'modern':'phone';applySkin()}
  savePref();applyLang();
  if(R&&R.running){buildKitchen();R.cust.forEach(c=>{c.dirty=true;c.el.querySelector('.nm').textContent=t(c.type)})}
  drawMap();settingsSheet(R&&R.running);
}
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
  if(coachGate(b)){shake($('coach').querySelector('.cbub'));return}
  if(d.coach){if(d.coach==='skip'||R.coach>=COACH.length-1)R.coach=null;else R.coach++;return}
  if(!$('ad').hidden)return;
  if(d.slot!==undefined){if(!paused)tapSlot(+d.slot)}
  else if(d.tub){if(!paused){const [k,v]=d.tub.split(':');tapTub(k,v)}}
  else if(d.plate!==undefined){if(!paused){const p=R.plates[+d.plate];if(p.k){const k=p.k,c=needOf(k);if(!c){toast(t('tNoOne'));shake(b);return}
    fly(b.querySelector('.stack img')||b,c.el.querySelector('.bub'),bunDone(k.split('|')[0]));p.n--;if(!p.n)p.k=null;giveKey(c,k)}}}
  else if(d.cup!==undefined){if(!paused)tapCup(+d.cup)}
  else if(d.mini){if(!paused)tapMini(d.mini)}
  else if(b.id==='cat'){if(R.cat&&R.cat.eat==null){R.cat=null;R.nextCat=rnd(35,70);toast(t('tShoo'));FX.on('catShoo')}}
  else if(b.id==='hpause'){settingsSheet(true)}
  else if(b.id==='hbake'){if(paused||!R||!R.running)return;if(!(S.bake>0)){toast(t('bakeNone'));shake(b);return}
    const on=S.slots.filter(s=>s.st==='c'||s.st==='b');if(!on.length){toast(t('bakeNoBun'));shake(b);return}   // nothing to finish: the use is not spent
    on.forEach(s=>{s.st='b-ready';s.t=0;s.hold=BAKE_HOLD});S.bake--;save();toast(t('bakeOn'));sfx('sparkle')}
  else if(b.id==='hice'){if(paused||!R||!R.running||R.ice>0)return;if(!(S.ice>0)){toast(t('iceNone'));shake(b);return}S.ice--;R.ice=ICE_TIME;save();toast(t('iceOn'));sfx('sparkle')}
  else if(d.stage)preStage(+d.stage);
  else if(b.id==='mstart')S.adv?unlockNext():preStage(S.top);
  else if(d.mode){P.mode=P.mode===d.mode?'normal':d.mode;savePref();drawMap();toast(t(P.mode==='easy'?'mEasyD':P.mode==='hard'?'mHardD':'mNormalD'))}
  else if(b.id==='mevent')preStage(S.top,true);
  else if(b.id==='mxp')xpSheet();
  else if(d.page){mapPage=Math.max(0,Math.min(STAGES/10-1,mapPage+ +d.page));drawMap()}
  else if(d.xp)exchangeXP(d.xp==='all'?Infinity:+d.xp);
  else if(b.id==='mprep')prepSheet();
  else if(d.prep)startPrep(d.prep);
  else if(b.id==='mshop'){shopTab='kitchen';shopSheet()}
  else if(b.id==='mset')settingsSheet(false);
  else if(d.start)d.start==='ev'?startStage(S.top,true):startStage(+d.start);
  else if(d.ad){const id=d.ad;if(pending[id])return;showAd(()=>{pending[id]=true;const el=$('bo-'+id);if(el){el.classList.add('got');el.querySelector('button').textContent=t('got')}})}
  else if(d.tab){shopTab=d.tab;shopSheet()}
  else if(d.buy)buy(d.buy);
  else if(d.act)act(d.act);
  else if(d.opt)opt(d.opt);
  else if(d.key)key(d.key);
});
$('veil').addEventListener('pointerdown',e=>{if(e.target===$('veil'))closeSheet()});

// feature-phone keypad: 1-9 molds, * batter, 0 serve next order, # calm with a mini bun
function key(k){
  const el=document.querySelector(`[data-key="${k}"]`);if(el){el.classList.remove('press');void el.offsetWidth;el.classList.add('press')}
  const f=DTMF[k];if(f)beep(f,.14,{type:'sine',vol:.08});haptic(15);
  if(!R||!R.running||paused)return;
  if(k>='1'&&k<='9')tapSlot(+k-1);
  else if(k==='*')tapTub('b',selB);
  else if(k==='#')tapMini('calm');
  else if(k==='0'){
    for(const c of R.cust.filter(c=>c.state==='wait'))for(const kk of Object.keys(c.need)){if(c.need[kk]<=0)continue;
      const p=R.plates.findIndex(p=>p.k===kk);if(p>=0){const pl=R.plates[p];pl.n--;if(!pl.n)pl.k=null;giveKey(c,kk);return}
      const cu=R.cups.findIndex(cp=>cp&&cp.st==='ready'&&'milk|'+cp.m===kk);if(cu>=0){R.cups[cu]=null;giveKey(c,kk);return}}
    toast(t('tNoOne'));
  }
}
document.addEventListener('keydown',e=>{if(DTMF[e.key]&&P.skin==='phone')key(e.key)});
function buildKeypad(){
  const sub={1:'',2:'ABC',3:'DEF',4:'GHI',5:'JKL',6:'MNO',7:'PQRS',8:'TUV',9:'WXYZ','*':t('kpBatter'),'#':t('calm')};
  $('keypad').innerHTML=`<div class="khint">${t('key')}</div><div class="keys">${['1','2','3','4','5','6','7','8','9','*','0','#'].map(k=>`<button class="kbtn" data-key="${k}"><b>${k}</b><small>${k==='0'?t('kpServe'):sub[k]}</small></button>`).join('')}</div>`;
}

// ---------- prep mini-game: stir the pot in circles to earn seed money ----------
let mg=null;
function prepSheet(){
  const n=S.prep||0;
  openSheet(`<div class="pre"><div class="ribbon">🥄 ${t('prep')}</div><p class="sub">${t('prepIntro')}</p>
    <div class="boosts two">${['bean','dough'].map(k=>`<div class="boost"><span class="bi-${k}"></span><b>${t('mg_'+k)}</b><small>${t('mg_'+k+'D')}</small>
      <button class="gbtn sm${n<=0?' poor':''}" data-prep="${k}" ${n<=0?'disabled':''}>▶ ${t('play')}</button></div>`).join('')}</div>
    <p class="bonus">${n>0?t('prepLeft',n,PREP_MAX):t('prepEmpty')}</p>
    <button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`);
}
function startPrep(kind){
  if((S.prep||0)<=0)return;S.prep--;save();closeSheet(true);
  mg={kind,t:PREP_TIME,acc:0,last:null,rot:0,mult:1};
  const pk=kind==='bean'?2:'dough',o=POT_OPEN[pk],sp=SPOON[pk],img=kind==='bean'?`${IMGP}mg_pot2_f1.webp`:`${IMGP}mg_bowl_bare.webp`;
  const box=`left:${o[0]}%;top:${o[1]}%;width:${o[2]}%;height:${o[3]}%`;
  const el=$('mg');el.hidden=false;
  el.innerHTML=`<div class="mgtop"><b>${t('mg_'+kind)}</b><span id="mgtime">${PREP_TIME}</span></div>
    <p class="mghelp">${t('mgHelp')}</p>
    
    <div class="pot2 ${kind}" id="pot"><img class="potimg" src="${img}" alt="">${kind==='bean'?`<img class="potimg f2" src="${IMGP}mg_pot2_f2.webp" alt="">`:''}<svg class="guide" style="${box}" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="ah" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z"/></marker></defs><path d="M22 24 A38 38 0 0 1 86 44" marker-end="url(#ah)"/><path d="M78 76 A38 38 0 0 1 14 56" marker-end="url(#ah)"/></svg>
      <div class="surf" id="potin" style="${box}">${kind==='bean'?'<i class="heat"></i>':''}</div>
      <div class="bubbles" id="bubbles" style="${box}"></div><img class="spoon2" id="spoon" src="${IMGP}mg_spoon.webp" style="left:${sp.hx}%;top:${sp.hy}%;width:${sp.w}%;transform:translate(-${sp.ax}%,-${sp.ay}%)" alt=""></div>
    <div class="mgscore"><span><b id="mgrot">0</b> ${t('mgTurns')}</span><b id="mgmoney">${money(0)}</b></div>
    <div class="mgbar"><i id="mgfill"></i><span>${t('mgBonus',PREP_BONUS_AT,money(PREP_BONUS))}</span></div>`;
  const pot=$('pot'),surf=$('potin');
  const ang=e=>{const r=surf.getBoundingClientRect();return Math.atan2((e.clientY-(r.top+r.height/2))*r.width/r.height,e.clientX-(r.left+r.width/2))};
  const move=e=>{if(!mg||mg.t<=0||mg.last===null)return;const a=ang(e);let d=a-mg.last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;
    mg.acc+=d;mg.last=a;
    const pr=pot.getBoundingClientRect(),tr=$('spoon');tr.style.left=((e.clientX-pr.left)/pr.width*100)+'%';tr.style.top=((e.clientY-pr.top)/pr.height*100)+'%';tr.style.transform=`translate(-${sp.ax}%,-${sp.ay}%) rotate(${Math.sin(a)*12}deg)`;
    const r=Math.floor(Math.abs(mg.acc)/(2*Math.PI));
    if(r>mg.rot){mg.rot=r;sfx('swish');haptic(8);$('mgrot').textContent=r;$('mgmoney').textContent=money(r*PREP_PAY);$('mgfill').style.width=Math.min(100,r/PREP_BONUS_AT*100)+'%';
      pot.classList.remove('stir');void pot.offsetWidth;pot.classList.add('stir');pot.classList.toggle('alt',r%2===1);
      if(r===PREP_BONUS_AT)beep([784,1047,1319],.2,{gap:.08})}
    const sw=surf.querySelector('.swirl2');if(sw)sw.style.transform=`rotate(${mg.acc}rad)`;if(r>=2)pot.classList.add('guided');
    const p=Math.min(1,mg.rot/PREP_BONUS_AT);
    surf.style.setProperty('--heat',p)};
  pot.addEventListener('pointerdown',e=>{pot.setPointerCapture(e.pointerId);if(mg)mg.last=ang(e)});
  pot.addEventListener('pointermove',move);
  pot.addEventListener('pointerup',()=>{if(mg)mg.last=null});
}
// magma-style bubbles that swell and pop faster as the beans cook
function blop(){
  const b=$('bubbles');if(!b||fxRM())return;const p=Math.min(1,mg.rot/PREP_BONUS_AT),a=Math.random()*6.28,r=Math.sqrt(Math.random())*40,s=18+Math.random()*24+p*26;
  const e=document.createElement('i');e.style.cssText=`left:${50+Math.cos(a)*r}%;top:${50+Math.sin(a)*r}%;width:${s}px;height:${s}px`;b.appendChild(e);
  setTimeout(()=>{e.classList.add('pop');beep([140+Math.random()*80,420+Math.random()*200],.06,{type:'sine',vol:.06,gap:.02});
    if(Math.random()<.3){const w=document.createElement('em');w.textContent=t('blop');w.style.cssText=e.style.cssText;b.appendChild(w);setTimeout(()=>w.remove(),700)}},450+Math.random()*300);
  setTimeout(()=>e.remove(),1200);
}
function prepTick(dt){
  if(!mg||mg.t<=0)return;mg.t-=dt;
  if(mg.kind==='bean'&&mg.rot>0){mg.bt=(mg.bt||0)-dt;if(mg.bt<=0){blop();mg.bt=.55-.42*Math.min(1,mg.rot/PREP_BONUS_AT)}}const el=$('mgtime');if(el)el.textContent=Math.max(0,Math.ceil(mg.t));
  if(mg.t>0)return;
  const pay=mg.rot*PREP_PAY+(mg.rot>=PREP_BONUS_AT?PREP_BONUS:0);S.wallet+=pay;gainXP(Math.round(mg.rot*XP_TURN*mg.mult));save();
  $('mg').hidden=true;FX.on('buy',{});drawMap();
  openSheet(`<div class="end"><div class="ribbon">${t('mgDone')}</div><div class="earn"><small>${t('mgTurnsN',mg.rot)}</small><b id="countup">0</b></div>
    ${mg.rot>=PREP_BONUS_AT?`<p class="bonus">${t('mgBonusGot',money(PREP_BONUS))}</p>`:''}<button class="gbtn" data-act="close">${t('close')}</button></div>`);
  countUp($('countup'),pay);mg=null;
}

// ---------- layout ----------
function fit(){
  const kp=P.skin==='phone'?360:0,fr=$('frame'),wr=$('wrap');
  const k=Math.min(wr.clientWidth/W,wr.clientHeight/(H+kp));
  fr.style.height=(H+kp)+'px';fr.style.transform=`translate(-50%,-50%) scale(${k})`;
}
function applySkin(){
  $('frame').className=P.skin==='phone'?'phone':'';$('keypad').hidden=P.skin!=='phone';buildKeypad();fit();
  if(R&&R.running)buildKitchen();
}
addEventListener('resize',fit);
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;tick(dt);draw();prepTick(dt);requestAnimationFrame(frame)}

// ---------- boot ----------

$('hcashimg').src=SC.cashbox;$('catimg').src=SC.cat_1;
applySkin();applyLang();showMap();
function introSheet(){toast(t('tOpen'));openSheet(`<div class="end"><img class="winimg" src="${bunDone('plain')}" alt=""><div class="ribbon">${t('title')}</div><p class="sub">${t('intro')}</p><p class="bonus">${t('tOpen')}</p><button class="gbtn big" data-start="1">${t('start')}</button></div>`)}
if(isNew)save();
setTimeout(()=>authGate(()=>{if(isNew)P.langChosen?nameSheet():openSheet(`<div class="end langpick"><div class="ribbon">🌐</div><p class="sub">${LANGS.map(([c])=>L[c].pickLang).join(' · ')}</p>${langSel()}<button class="gbtn big" data-act="langok">${t('ok')}</button></div>`,true)}),300);
requestAnimationFrame(frame);
