// ---------- live features: delivery & research timers, special order, attendance, shop name, notifications ----------
// Loaded after game.js. All times are real time (Date.now()), so they keep running while the game is closed.
const HOUR=LIVE_FAST?1000:3600e3;                       // test builds: one "hour" is a second
const hrs=([a,b])=>Math.round((a+Math.random()*(b-a))*HOUR);
const today=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const leftTxt=ms=>{const h=Math.ceil(ms/HOUR);return LIVE_FAST?t('shipSec',Math.max(1,Math.ceil(ms/1000))):t('shipH',Math.max(1,h))};
const itemName=k=>k.startsWith('d_')?t(k.slice(2)):t('i_'+k.slice(2));

// --- orders: decor ships in 1-2 days ---
function placeOrder(key){(S.orders=S.orders||{})[key]=Date.now()+hrs(DELIVERY_H);
  toast(t('orderPlaced',itemName(key)));planNotifs()}
function orderLeft(key){const at=S.orders&&S.orders[key];return at?Math.max(0,at-Date.now()):null}
function checkOrders(){
  const o=S.orders||{},now=Date.now(),got=[];
  for(const k in o)if(o[k]<=now){delete o[k];got.push(k);
    if(!S.decos.includes(k.slice(2)))S.decos.push(k.slice(2))}
  if(!got.length)return;save();
  const k=got[0];FX.on('buy');toast(t('arrived',itemName(k)));
  if(R&&R.running)buildKitchen();else drawMap();
}

// --- special / group order: it comes in while the player is away (push notification); on return a popup offers the bonus game ---
function spSheet(){
  openSheet(`<div class="pre"><div class="ribbon">📦 ${t('spTitle')}</div><p class="sub">${t('spAsk',SP_NEED,money(SP_REWARD))}</p>
    <button class="gbtn big" data-live="spgo">${t('spAccept')}</button><button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`);
}

// --- attendance: one stamp a day on a month calendar ---
function attReward(day){return {coin:300*day,churu:1,mini:2,ice:day===7?1:0}}
function attSheet(){
  const a=S.att=S.att||{days:{},streak:0,last:''},now=new Date(),td=today(),y=now.getFullYear(),m=now.getMonth();
  const first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),done=!!a.days[td];
  const next=(a.last===today(new Date(Date.now()-864e5))?a.streak:0)%7+1,r=attReward(done?((a.streak-1)%7+1):next);
  let cells='<i></i>'.repeat(first);
  for(let d=1;d<=n;d++){const k=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells+=`<i class="${a.days[k]?'st':''}${k===td?' td':''}"${k===td&&!done?' data-live="stamp"':''}>${a.days[k]?'<img src="'+BUN('plain','done')+'" alt="">':d}</i>`}
  openSheet(`<div class="pre att"><div class="ribbon">📅 ${t('att')}</div><p class="sub">${now.getFullYear()}.${m+1} · ${t('attStreak',a.streak)}</p>
    <div class="cal">${cells}</div>
    <div class="attnote"><span>🎁 ${t('attNoteW')}</span><span>🏆 ${t('attNoteM')}</span></div>
    ${Object.keys(a.gifts||{}).length?(a.msg||[]).map(m=>`<p class="bonus">🎉 ${t(m)}</p>`).join(''):''}
    <div class="gifts">${GIFTS.filter(k=>r[k]||(a.gifts||{})[k]).map(k=>{const wait=(a.gifts||{})[k],n=wait||r[k];
      return `<div class="gift"><span class="gi">${giftIco(k)}</span><b>${k==='coin'?money(n):giftName(k)+' ×'+n}</b>${wait?`<button class="gbtn sm" data-live="gift" data-k="${k}">${t('attClaim')}</button>`:done?'<em>✓</em>':''}</div>`}).join('')}</div>
    <button class="gbtn big" data-live="stamp" ${done?'disabled':''}>${done?t('attDone'):t('attBtn')}</button><button class="gbtn ghost wide" data-act="close">${t('close')}</button></div>`);
}
// today's gifts are handed over one by one: each waits in S.att.gifts until its own button is tapped
const GIFTS=['coin','churu','mini','ice','bake'];
const giftIco=k=>k==='coin'?`<img src="${IMGP}sc_cashbox.webp" alt="">`:k==='churu'?`<img src="${IMGP}churu_1.webp" alt="">`:k==='mini'?`<img src="${BUN('plain','done')}" alt="">`:k==='bake'?'⚡':'❄️';
const giftName=k=>t(k==='churu'?'churu':k==='mini'?'mini':k==='bake'?'bake':'ice');
function attClaim(k){const g=S.att.gifts||{},n=g[k];if(!n)return;delete g[k];
  if(k==='coin')S.wallet+=n;else if(k==='churu')S.churu=(S.churu||0)+n;else if(k==='mini')S.minibag=(S.minibag||0)+n;else if(k==='bake')S.bake=(S.bake||0)+n;else S.ice=(S.ice||0)+n;
  save();FX.on('buy');toast(k==='coin'?t('attGot',money(n)):`${giftName(k)} +${n}`);drawMap();attSheet()}
function attStamp(){
  const a=S.att,td=today();if(a.days[td])return;
  a.streak=a.last===today(new Date(Date.now()-864e5))?a.streak+1:1;a.last=td;a.days[td]=1;
  const r=attReward((a.streak-1)%7+1);a.gifts={};GIFTS.forEach(k=>{if(r[k])a.gifts[k]=r[k]});
  // every day of this Sun-Sat week stamped: 1 instant bake; every day of this month stamped: the booster pack
  const d=new Date(),day=i=>today(new Date(d.getFullYear(),d.getMonth(),i)),full=ks=>ks.every(k=>a.days[k]);a.msg=[];
  if(full([...Array(7)].map((_,i)=>day(d.getDate()-d.getDay()+i)))){a.gifts.bake=(a.gifts.bake||0)+1;a.msg.push('attWeek')}
  if(full([...Array(new Date(d.getFullYear(),d.getMonth()+1,0).getDate())].map((_,i)=>day(i+1)))){for(const k in ATT_PACK)a.gifts[k]=(a.gifts[k]||0)+ATT_PACK[k];a.msg.push('attMonth')}
  save();FX.on('buy');drawMap();attSheet();planNotifs();
}

// --- shop name (asked once, before the tutorial) ---
function nameSheet(){openSheet(`<div class="end"><div class="ribbon">🏮</div><p class="sub">${t('nameAsk')}</p>
  <div class="namerow"><input id="shopname" maxlength="10" placeholder="${t('nameHint')}" autocomplete="off"><b>${t('nameSuffix')}</b></div>
  <button class="gbtn big" data-live="nameok">${t('ok')}</button></div>`,true)}
const shopTitle=()=>S.shopName?`${S.shopName} ${t('nameSuffix')}`:t('title');

// --- notifications: planned here, delivered by the app shell (Capacitor LocalNotifications); a browser tab cannot send them while closed ---
const QUIET=[21*60+30,7*60+50], NOTIF_MAX_PER_DAY=2;    // * no sends 21:30-07:50, at most 2 a day
function outOfQuiet(ts){const d=new Date(ts),m=d.getHours()*60+d.getMinutes();
  if(m>=QUIET[0]){d.setDate(d.getDate()+1);d.setHours(7,50,0,0)}else if(m<QUIET[1])d.setHours(7,50,0,0);return d.getTime()}
function buildNotifs(now=Date.now()){
  const on=P.notif||{},at=(days,h,mi)=>{const d=new Date(now);d.setDate(d.getDate()+days);d.setHours(h,mi,0,0);return d.getTime()},list=[];
  if(on.profit!==false){
    for(const k in S.orders||{})list.push({at:S.orders[k],cat:'profit',body:t('arrived',itemName(k))});
    list.push({at:at(1,12,30),cat:'profit',body:t('pDaily')})}
  if(on.event!==false){
    list.push({at:now+SP_AWAY_H*HOUR,cat:'event',body:t('pSpecial',SP_NEED)});   // same moment the return popup unlocks
    const y=new Date(now).getFullYear();
    for(const [mo,da,key] of [[11,1,'pWinter'],[11,24,'pXmas']])for(const yy of [y,y+1]){const ts=new Date(yy,mo,da,12,0).getTime();if(ts>now){list.push({at:ts,cat:'event',body:t(key)});break}}}
  if(on.back!==false)for(const d of [4,7])list.push({at:at(d,19,0),cat:'back',body:t('pBack')});
  // streak about to break: stamped today -> warn tomorrow evening; last stamp was yesterday -> warn this evening
  if(on.streak!==false){const a=S.att||{},st=a.streak||0,d=a.last===today(new Date(now))?1:a.last===today(new Date(now-864e5))?0:-1;
    if(d>=0&&st>=STREAK_MIN)list.push({at:at(d,...STREAK_AT),cat:'streak',pri:1,body:st%7===6?t('pStreak7',st):t('pStreak',st)})}
  // overtaken in the ranking while away (set by rankSync)
  if(on.rank!==false&&S.rankPush&&S.rankPush.at>now)list.push({at:S.rankPush.at,cat:'rank',pri:1,go:'rank',body:S.rankPush.body});
  // rules: move out of quiet hours, then keep NOTIF_MAX_PER_DAY of each day (streak and rank first, then by time)
  const perDay={},day=n=>today(new Date(n.at));
  return list.filter(n=>n.at>now).map(n=>({...n,at:outOfQuiet(n.at)})).sort((a,b)=>(b.pri||0)-(a.pri||0)||a.at-b.at)
    .filter(n=>{const k=day(n);perDay[k]=(perDay[k]||0)+1;return perDay[k]<=NOTIF_MAX_PER_DAY}).sort((a,b)=>a.at-b.at);
}
function planNotifs(){
  const LN=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
  window.notifPlan=buildNotifs();if(!LN||!P.notifOK)return;
  LN.getPending().then(p=>p.notifications.length?LN.cancel({notifications:p.notifications.map(n=>({id:n.id}))}):0)
    .then(()=>LN.schedule({notifications:window.notifPlan.map((n,i)=>({id:i+1,title:shopTitle(),body:n.body,extra:{go:n.go||''},schedule:{at:new Date(n.at)}}))})).catch(()=>{});
}
// ask right after the first finished stage, not at first launch
function askNotif(){if(BUILD==='toss'||P.notifAsked||S.top<2)return false;P.notifAsked=true;savePref();
  openSheet(`<div class="pre"><div class="ribbon">🔔</div><p class="sub">${t('nfAsk')}</p><p class="sub">${t('nfAskD')}</p>
    <button class="gbtn big" data-live="nfyes">${t('nfYes')}</button><button class="gbtn ghost wide" data-act="close">${t('nfNo')}</button></div>`);return true}
function grantNotif(){
  const LN=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications,ok=()=>{P.notifOK=true;savePref();planNotifs()};
  try{if(LN)LN.requestPermissions().then(r=>r.display==='granted'&&ok());else if(window.Notification)Notification.requestPermission().then(r=>r==='granted'&&ok(),()=>{})}catch(e){}
  closeSheet(true);
}

// --- map row: attendance button + special order banner ---
function liveDraw(){
  const row=$('mlive');if(!row)return;const td=today(),stamped=S.att&&S.att.days[td];
  row.innerHTML=`<button class="lv att${stamped&&!Object.keys(S.att.gifts||{}).length?'':' new'}" data-live="att">📅 ${t('att')}</button>`;
  $('mtitle').textContent=shopTitle();
}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-live]');if(!b||b.disabled)return;const a=b.dataset.live;
  if(a==='rcok')receiptNext();else if(a==='rkyes'||a==='rkno'){if(a==='rkyes'){S.rankOn=true;toast(t('rkDone'));rkSync()}save();const f=rcNext;rcNext=null;closeSheet(true);f&&f()}
  else if(a==='rkdel')rkDelete().then(()=>{toast(t('rkDelDone'));rankSheet(1)});else if(a==='rank')rankSheet();else if(a==='rankgo'){rankTab^=1;$('rktrack').style.transform=`translateX(${-rankTab*100}%)`}
  else if(a==='att')attSheet();else if(a==='stamp')attStamp();else if(a==='gift')attClaim(b.dataset.k);
  else if(a==='spgo'){S.sp={day:today(),done:false};save();spMission()}
  else if(a==='spstart')startSpecial();
  else if(a==='nameok'){S.shopName=($('shopname').value||'').trim().slice(0,10);save();closeSheet(true);drawMap();introSheet()}
  else if(a==='nfyes')grantNotif()});
setInterval(()=>{checkOrders();if(!$('map').hidden&&$('veil').hidden)liveDraw()},LIVE_FAST?1000:30000);
// back after SP_AWAY_H or more: the group order that came in meanwhile is offered once a day
function spReturn(){const away=S.seen?Date.now()-S.seen:0;
  if(away>=SP_AWAY_H*HOUR&&S.top>=SP_STAGE&&(!S.sp||S.sp.day!==today())&&$('veil').hidden&&!$('map').hidden)spSheet()}
document.addEventListener('visibilitychange',()=>{if(document.hidden){S.seen=Date.now();save();planNotifs()}else{checkOrders();spReturn()}});
checkOrders();liveDraw();
// returning player: today's stamp is waiting
if(!isNew)setTimeout(()=>{spReturn();if(S.top>=2&&!(S.att&&S.att.days[today()]&&!Object.keys(S.att.gifts||{}).length)&&$('veil').hidden&&!$('map').hidden)attSheet();S.seen=Date.now();save()},600);

// ---------- ranking ----------
let rankTab=0;
// one chart: rivals + me, best first; returns top 10 rows and my place
function rankRows(k){
  const me={n:S.shopName||t('rankMe'),v:(k?S.revN:S.soldN)||0,me:true};
  const src=RK?RK.rows[k].filter(r=>r.id!==RK.uid).map(r=>({n:r.n,v:r.v})):RANK_SAMPLE.map(([n,v])=>({n,v:k?v*RANK_REV:v}));
  const all=src.concat(me).sort((a,b)=>b.v-a.v),i=all.indexOf(me)+1;
  return {top:all.filter(r=>!r.me||S.rankOn).slice(0,10),place:RK&&S.rankOn&&i>10?RK.place[k]||i:i,me,all};
}
// --- overtaken: compares my place on both charts with the place last seen. Run it whenever chart data may have changed
// (today: on return to the game; with a server: right after every fetch, and the server sends the same text as a push while the app is closed) ---
function rankSync(){
  if(!S.rankOn)return;const seen=S.rankSeen=S.rankSeen||{};let hit=null;
  for(const k of [0,1]){const {place,all}=rankRows(k),was=seen[k];
    if(was&&place>was){if(!hit)hit={k,place,by:(all[place-2]||all[all.length-1]||{}).n||""}}else seen[k]=place}
  if(!hit)return save();
  const chart=t(hit.k?'rankRev':'rankSold');
  if(document.hidden){   // app in the background: one device notification a day, outside quiet hours
    if((P.notif||{}).rank!==false&&(!S.rankPush||today(new Date(S.rankPush.at))!==today())){S.rankPush={at:outOfQuiet(Date.now()+5000),body:t('pRank',hit.by,hit.place)};save();planNotifs()}
    return}
  if(!$('veil').hidden||$('map').hidden)return;          // shown later, on the next quiet moment on the map
  for(const k of [0,1])seen[k]=rankRows(k).place;S.rankPush=null;save();
  openSheet(`<div class="pause"><div class="ribbon">🏆</div><p class="sub big">${t('rkLost',esc(hit.by))}</p><p class="sub">${t('rkLostD',chart,hit.place)}</p>
    <div class="row3"><button class="gbtn ghost" data-act="close">${t('close')}</button><button class="gbtn" data-live="rank">${t('rkGo')}</button></div></div>`)}
// a tapped ranking notification opens the ranking
window.Capacitor?.Plugins?.LocalNotifications?.addListener('localNotificationActionPerformed',e=>{if(e.notification?.extra?.go==='rank'&&$('veil').hidden&&!$('map').hidden)rankSheet()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(rankSync,900)});
if(!isNew)setTimeout(rankSync,1500);
function rankPanel(k){
  const {top,place,me}=rankRows(k),val=v=>k?money(v):t('rankN',fmt(v));
  const pod=i=>top[i]?`<div class="rkp p${i+1}${top[i].me?' me':''}"><i>${['🥇','🥈','🥉'][i]}</i><b>${esc(top[i].n)}</b><span>${val(top[i].v)}</span></div>`:'';
  return `<div class="rkpanel"><div class="rkpod">${pod(1)}${pod(0)}${pod(2)}</div>
    <div class="rklist">${top.slice(3).map((r,i)=>`<div class="rkrow${r.me?' me':''}"><em>${i+4}</em><b>${esc(r.n)}</b><span>${val(r.v)}</span></div>`).join('')}
    ${place>10||!S.rankOn?`<div class="rkrow me"><em>${place}</em><b>${esc(me.n)}</b><span>${val(me.v)}</span></div>`:''}</div></div>`;
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function rankSheet(keep){if(!keep)rankTab=0;
  if(!keep&&rkOn())rkSync().then(()=>document.querySelector('.pause.rank')&&rankSheet(1));
  openSheet(`<div class="pause rank"><button class="xbtn" data-act="close">✕</button><div class="ribbon">${t('rankTop')}</div>
    <div class="rkwrap"><div id="rktrack" style="transform:translateX(${-rankTab*100}%)">${[0,1].map(k=>`<div class="rkslide"><div class="rkhead"><button data-live="rankgo">‹</button><span>${k?'💰 '+t('rankRev'):'🐟 '+t('rankSold')}</span><button data-live="rankgo">›</button></div>${rankPanel(k)}</div>`).join('')}</div></div>
    <p class="sub rknote">${RK?'':t('rankTest')}</p>${S.rankOn&&rkOn()?`<button class="gbtn ghost sm" data-live="rkdel">${t('rkDel')}</button>`:''}</div>`)}

// ---------- stage receipt: what was sold, who left, what it cost; then the usual clear/fail sheet ----------
let rcNext=null;
function receiptSheet(next){rcNext=next;rkSync();
  const sold=R.sold||{},grp={};
  for(const k in sold){const [a,b]=k.split('|');(grp[a]=grp[a]||[]).push([b,sold[k],unitPrice(k)*sold[k]])}
  const row=(n,q,v,c='')=>`<div class="rcrow ${c}"><b>${n}</b><span>${q}</span><span>${v}</span></div>`;
  const items=Object.keys(grp).map(a=>a==='mini'?row(t('mini'),grp[a][0][1],'-','g'):
    row(a==='milk'?t('milk'):t('b_'+a),'','','g')+grp[a].map(([b,q,v])=>row('ㄴ '+t((a==='milk'?'m_':'f_')+b),q,money(v),'rcsub')).join('')).join('');
  const sum=(n,v,c='')=>`<div class="rcsum ${c}"><b>${n}</b><span>${v}</span></div>`;
  openSheet(`<div class="rcpt"><button class="xbtn" data-live="rcok">✕</button><div class="ribbon">🐟 ${t('rcT')}</div><div class="rcawn"></div>
    <div class="rcpaper"><p>${t('rcShop')} ${esc(shopTitle())}</p><p>${t('rcStage')} ${t('stageN',R.n)}${R.ev?' ★':''}</p><hr>
      ${row(t('rcItem'),t('rcQty'),t('rcAmt'),'h')}${items||row('-','0','-')}<hr>
      ${sum(t('rcGuests'),t('rcN',R.served+R.walk+(R.ran||0)))}${sum(t('rcAngry'),t('rcN',R.walk),R.walk?'bad':'')}${R.ran?sum(t('rcRan'),t('rcN',R.ran),'bad'):''}
      ${sum(t('rcBurnt'),t('rankN',R.burnt),R.burnt?'bad':'')}<hr>
      ${sum(t('rcSales'),money(R.earned))}${sum(t('rcCost'),'-'+money(R.costs),'bad')}${sum(t('rcNet'),money(R.earned-R.costs),'net')}
      <button class="gbtn big" data-live="rcok">${t('ok')}</button></div></div>`,true);
  // many items: shrink the text until the receipt fits (not below 14px), scrolling only as a last resort
  const s=$('sheet'),p=s.querySelector('.rcpaper');for(let f=20;f>=14&&s.scrollHeight>s.clientHeight;f--)p.style.fontSize=f+'px'}
// after the receipt: a score good enough for the top 10 is offered for the ranking (asked again only when the place improves)
function receiptNext(){
  const place=Math.min(rankRows(0).place,rankRows(1).place);
  if(!S.rankOn&&place<=10&&place<(S.rankAsked||99)){S.rankAsked=place;save();
    return openSheet(`<div class="pause"><div class="ribbon">🏆</div><p class="sub big">${t('rkAsk')}</p><p class="sub">${t('rkAskD',place)}</p>
      <div class="row3"><button class="gbtn ghost" data-live="rkno">${t('rkNo')}</button><button class="gbtn" data-live="rkyes">${t('rkYes')}</button></div></div>`,true)}
  const f=rcNext;rcNext=null;closeSheet(true);f&&f()}
