// ---------- web version checkout: Toss Payments window (Naver Pay, mobile-phone bill, cards ... whatever is switched on in the Toss Payments console) ----------
// Plain browser build only: the Android app must use Play Billing (Play policy) and the Toss mini-app has its own checkout.
// clientKey = the "결제위젯 연동 키" (test_gck_… / live_gck_…), public by design. Empty = web payment is not open yet (the pack stays on the shelf and says so).
const PAY={clientKey:'',api:'https://asia-northeast3-my-bungeoppang-tycoon.cloudfunctions.net'};
const payPost=async(fn,body)=>{
  const r=await fetch(`${PAY.api}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+await fbAuth()},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(j.error||r.status),{status:r.status});return j;
};
// the Toss script is loaded only when someone actually pays, so ordinary players never contact Toss
const paySdk=()=>window.TossPayments?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://js.tosspayments.com/v2/standard';s.onload=ok;s.onerror=no;document.head.appendChild(s)});

async function webPay(id){
  if(BUILD==='toss'||!PAY.clientKey)return openSheet(`<div class="pause"><div class="ribbon">💎</div><p class="sub">${t('payNA')}</p><button class="gbtn wide" data-act="iapno">${t('ok')}</button></div>`);
  try{
    const o=await payPost('payOrder',{packId:id});                       // the server decides the price
    await paySdk();
    const w=TossPayments(PAY.clientKey).widgets({customerKey:TossPayments.ANONYMOUS});
    await w.setAmount({currency:'KRW',value:o.amount});
    openSheet(`<div class="pause paybox"><div class="ribbon">${o.orderName}</div><div id="pay-method"></div><div id="pay-agree"></div><div class="row3"><button class="gbtn ghost" data-act="iapno">${t('cancel')}</button><button class="gbtn" id="pay-go">${t('payGo')}</button></div></div>`,true);
    await Promise.all([w.renderPaymentMethods({selector:'#pay-method'}),w.renderAgreement({selector:'#pay-agree'})]);
    $('pay-go').onclick=()=>w.requestPayment({orderId:o.orderId,orderName:o.orderName,successUrl:location.origin+location.pathname,failUrl:location.origin+location.pathname}).catch(()=>{});
  }catch(e){toast(t('iapFail'))}
}

// Back from the payment window: ?paymentKey&orderId&amount on success, ?code&message&orderId on failure.
// The return is saved first (S.payPend) so a lost connection or a closed tab never loses a paid order: it is retried at every start.
function payReturn(){
  const q=new URLSearchParams(location.search),orderId=q.get('orderId');if(!orderId)return payFinish();
  history.replaceState(null,'',location.pathname);                       // a reload must not process the same return twice
  if(!q.get('paymentKey'))toast(t('iapFail'));                           // failed or cancelled in the payment window
  else{S.payPend={paymentKey:q.get('paymentKey'),orderId,amount:Number(q.get('amount'))};save()}
  return payFinish();
}
async function payFinish(){
  const p=S.payPend;if(!p)return;
  try{
    const r=await payPost('payConfirm',p);
    S.iapTok=S.iapTok||[];
    if(!S.iapTok.includes(p.orderId)){S.iapTok=[...S.iapTok,p.orderId].slice(-50);S.gem=(S.gem||0)+r.gems;toast(t('gemGot',r.gems))}
    S.payPend=null;save();
  }catch(e){
    if(e.status>=400&&e.status<500&&e.status!==409&&e.status!==401){S.payPend=null;save();toast(t('iapFail'))}   // the server refused it for good; offline / busy / sign-in trouble: keep and retry next start
  }
}
payReturn();
