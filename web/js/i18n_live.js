// ---------- strings for js/live.js (delivery, special order, attendance, shop name, notifications) ----------
Object.assign(L.ko,{shipH:h=>`약 ${h}시간 남음`,shipSec:s=>`${s}초 남음`,orderPlaced:x=>`${x} 주문 완료! 1~2일 뒤에 도착해요 🚚`,researchStart:x=>`${x} 연구를 시작했어요 🔬`,arrived:x=>`주문하신 ${x}이(가) 도착했어요!`,researched:x=>`${x} 붕어빵 연구가 끝났어요!`,
  spTitle:'특별·단체 주문',spBanner:n=>`특별 주문이 들어왔어요! ${n}개`,spAsk:(n,r)=>`특별 주문이자 단체 대량 주문이에요. 30분 안에 붕어빵 ${n}개를 팔아 주세요! 보상 ${r}`,spAccept:'주문 받기',spProg:(m,g,n)=>`${m}분 남음 · ${g}/${n}개`,spDone:r=>`특별 주문 완료! +${r}`,spStart:(m,n)=>`${m}분 안에 ${n}개를 팔아 주세요!`,
  att:'출석부',attBtn:'오늘 도장 찍기 🎁',attGot:r=>`출석 보상 +${r}`,attDone:'오늘 도장을 찍었어요 ✓',attStreak:n=>`${n}일 연속 출석`,
  nameAsk:'나만의 붕어빵 가게 이름을 지어 주세요',nameHint:'예: 고양이네',nameSuffix:'붕어빵 가게',
  nfAsk:'알림을 받을까요?',nfAskD:'주문 도착, 오늘의 보상, 특별 주문을 알려 드려요. 하루 최대 2번, 밤에는 보내지 않아요.',nfYes:'알림 받기',nfNo:'나중에',nf_profit:'수익 알림',nf_event:'이벤트 알림',nf_back:'복귀 알림',
  pDaily:'오늘의 보상이 기다려요 🎁',pSpecial:n=>`특별 주문·단체 대량 주문이 들어왔어요. 30분 안에 ${n}개를 구워 주세요!`,pBack:'붕어빵 가게가 문을 닫을 뻔했어요 😢 사장님, 돌아와 주세요',pWinter:'겨울 시즌 한정 이벤트가 시작됐어요 ❄️',pXmas:'크리스마스 특별 메뉴가 나왔어요 🎄'});
Object.assign(L.en,{shipH:h=>`about ${h}h left`,shipSec:s=>`${s}s left`,orderPlaced:x=>`${x} ordered! It arrives in 1-2 days 🚚`,researchStart:x=>`Research started: ${x} 🔬`,arrived:x=>`Your ${x} has arrived!`,researched:x=>`${x} research is finished!`,
  spTitle:'Special group order',spBanner:n=>`Special order! ${n} buns`,spAsk:(n,r)=>`A big group order came in. Sell ${n} buns within 30 minutes! Reward ${r}`,spAccept:'Take the order',spProg:(m,g,n)=>`${m} min left · ${g}/${n}`,spDone:r=>`Special order done! +${r}`,spStart:(m,n)=>`Sell ${n} buns in ${m} minutes!`,
  att:'Attendance',attBtn:"Stamp today 🎁",attGot:r=>`Attendance reward +${r}`,attDone:'Stamped today ✓',attStreak:n=>`${n}-day streak`,
  nameAsk:'Name your own bungeoppang shop',nameHint:"e.g. Kitty's",nameSuffix:'Bungeoppang',
  nfAsk:'Turn on notifications?',nfAskD:'We tell you about deliveries, the daily reward and special orders. At most 2 a day, never at night.',nfYes:'Turn on',nfNo:'Later',nf_profit:'Earnings alerts',nf_event:'Event alerts',nf_back:'Come-back alerts',
  pDaily:"Today's reward is waiting 🎁",pSpecial:n=>`A special group order came in. Bake ${n} buns within 30 minutes!`,pBack:'Your bungeoppang shop almost closed 😢 Come back, boss',pWinter:'The winter season event has started ❄️',pXmas:'The Christmas special menu is here 🎄'});
Object.assign(L.zh,{shipH:h=>`约剩 ${h} 小时`,shipSec:s=>`剩 ${s} 秒`,orderPlaced:x=>`已订购${x}！1~2天后送达 🚚`,researchStart:x=>`开始研究${x} 🔬`,arrived:x=>`您订购的${x}到了！`,researched:x=>`${x}鲷鱼烧研究完成了！`,
  spTitle:'特别团体订单',spBanner:n=>`来了特别订单！${n}个`,spAsk:(n,r)=>`来了一笔团体大订单。请在30分钟内卖出${n}个鲷鱼烧！奖励 ${r}`,spAccept:'接单',spProg:(m,g,n)=>`剩 ${m} 分钟 · ${g}/${n}`,spDone:r=>`特别订单完成！+${r}`,spStart:(m,n)=>`请在${m}分钟内卖出${n}个！`,
  att:'签到簿',attBtn:'今日签到 🎁',attGot:r=>`签到奖励 +${r}`,attDone:'今天已签到 ✓',attStreak:n=>`连续签到 ${n} 天`,
  nameAsk:'给你的鲷鱼烧店起个名字吧',nameHint:'例如：小猫家',nameSuffix:'鲷鱼烧',
  nfAsk:'要接收通知吗？',nfAskD:'我们会通知到货、每日奖励和特别订单。每天最多2条，夜间不发送。',nfYes:'接收通知',nfNo:'以后再说',nf_profit:'收益通知',nf_event:'活动通知',nf_back:'回归通知',
  pDaily:'今天的奖励在等你 🎁',pSpecial:n=>`来了特别团体订单。请在30分钟内烤好${n}个！`,pBack:'鲷鱼烧店差点关门了 😢 老板，快回来吧',pWinter:'冬季限定活动开始了 ❄️',pXmas:'圣诞特别菜单上线了 🎄'});
Object.assign(L.ja,{shipH:h=>`あと約${h}時間`,shipSec:s=>`あと${s}秒`,orderPlaced:x=>`${x}を注文しました！1〜2日で届きます 🚚`,researchStart:x=>`${x}の研究を始めました 🔬`,arrived:x=>`ご注文の${x}が届きました！`,researched:x=>`${x}たい焼きの研究が終わりました！`,
  spTitle:'特別・団体注文',spBanner:n=>`特別注文が入りました！${n}個`,spAsk:(n,r)=>`団体の大量注文です。30分以内にたい焼きを${n}個売ってください！報酬 ${r}`,spAccept:'注文を受ける',spProg:(m,g,n)=>`残り${m}分 · ${g}/${n}個`,spDone:r=>`特別注文クリア！+${r}`,spStart:(m,n)=>`${m}分以内に${n}個売ってください！`,
  att:'出席簿',attBtn:'今日のスタンプ 🎁',attGot:r=>`出席ボーナス +${r}`,attDone:'今日はスタンプ済み ✓',attStreak:n=>`${n}日連続出席`,
  nameAsk:'自分だけのたい焼き屋さんに名前をつけよう',nameHint:'例：ねこさんち',nameSuffix:'たい焼き',
  nfAsk:'通知を受け取りますか？',nfAskD:'お届け、今日のごほうび、特別注文をお知らせします。1日最大2回、夜は送りません。',nfYes:'通知を受け取る',nfNo:'あとで',nf_profit:'収益のお知らせ',nf_event:'イベントのお知らせ',nf_back:'おかえりのお知らせ',
  pDaily:'今日のごほうびが待っています 🎁',pSpecial:n=>`特別・団体の大量注文が入りました。30分以内に${n}個焼いてください！`,pBack:'たい焼き屋さんが閉店しそうでした 😢 店長、戻ってきてください',pWinter:'冬の期間限定イベントが始まりました ❄️',pXmas:'クリスマス特別メニューが登場 🎄'});
Object.assign(L.ar,{shipH:h=>`بقي نحو ${h} ساعة`,shipSec:s=>`بقي ${s} ثانية`,orderPlaced:x=>`تم طلب ${x}! يصل خلال يوم أو يومين 🚚`,researchStart:x=>`بدأ البحث: ${x} 🔬`,arrived:x=>`وصل طلبك: ${x}!`,researched:x=>`انتهى بحث ${x}!`,
  spTitle:'طلب جماعي خاص',spBanner:n=>`طلب خاص! ${n} كعكة`,spAsk:(n,r)=>`وصل طلب جماعي كبير. بِع ${n} كعكة خلال 30 دقيقة! المكافأة ${r}`,spAccept:'اقبل الطلب',spProg:(m,g,n)=>`بقي ${m} دقيقة · ${g}/${n}`,spDone:r=>`اكتمل الطلب الخاص! +${r}`,spStart:(m,n)=>`بِع ${n} كعكة خلال ${m} دقيقة!`,
  att:'سجل الحضور',attBtn:'اختم اليوم 🎁',attGot:r=>`مكافأة الحضور +${r}`,attDone:'ختمت اليوم ✓',attStreak:n=>`${n} أيام متتالية`,
  nameAsk:'اختر اسمًا لمحل البونغوبانغ الخاص بك',nameHint:'مثال: بيت القطة',nameSuffix:'بونغوبانغ',
  nfAsk:'هل تريد تلقي الإشعارات؟',nfAskD:'نخبرك بوصول الطلبات ومكافأة اليوم والطلبات الخاصة. مرتان يوميًا على الأكثر ولا نرسل ليلًا.',nfYes:'فعّل الإشعارات',nfNo:'لاحقًا',nf_profit:'إشعارات الأرباح',nf_event:'إشعارات الفعاليات',nf_back:'إشعارات العودة',
  pDaily:'مكافأة اليوم بانتظارك 🎁',pSpecial:n=>`وصل طلب جماعي خاص. اخبز ${n} كعكة خلال 30 دقيقة!`,pBack:'كاد محل البونغوبانغ أن يغلق 😢 عُد إلينا يا معلم',pWinter:'بدأت فعالية موسم الشتاء ❄️',pXmas:'قائمة عيد الميلاد الخاصة وصلت 🎄'});
Object.assign(L.es,{shipH:h=>`faltan unas ${h} h`,shipSec:s=>`faltan ${s} s`,orderPlaced:x=>`¡${x} pedido! Llega en 1-2 días 🚚`,researchStart:x=>`Investigación iniciada: ${x} 🔬`,arrived:x=>`¡Ha llegado tu pedido: ${x}!`,researched:x=>`¡Investigación de ${x} terminada!`,
  spTitle:'Pedido especial de grupo',spBanner:n=>`¡Pedido especial! ${n} peces`,spAsk:(n,r)=>`Ha llegado un gran pedido de grupo. ¡Vende ${n} peces en 30 minutos! Premio ${r}`,spAccept:'Aceptar pedido',spProg:(m,g,n)=>`Quedan ${m} min · ${g}/${n}`,spDone:r=>`¡Pedido especial completado! +${r}`,spStart:(m,n)=>`¡Vende ${n} peces en ${m} minutos!`,
  att:'Asistencia',attBtn:'Sellar hoy 🎁',attGot:r=>`Premio de asistencia +${r}`,attDone:'Hoy ya está sellado ✓',attStreak:n=>`${n} días seguidos`,
  nameAsk:'Ponle nombre a tu puesto de bungeoppang',nameHint:'p. ej. Gatito',nameSuffix:'Bungeoppang',
  nfAsk:'¿Activar las notificaciones?',nfAskD:'Te avisamos de entregas, el premio diario y pedidos especiales. Máximo 2 al día y nunca de noche.',nfYes:'Activar',nfNo:'Más tarde',nf_profit:'Avisos de ganancias',nf_event:'Avisos de eventos',nf_back:'Avisos de regreso',
  pDaily:'El premio de hoy te espera 🎁',pSpecial:n=>`Ha llegado un pedido especial de grupo. ¡Hornea ${n} peces en 30 minutos!`,pBack:'Tu puesto de bungeoppang casi cierra 😢 Vuelve, jefe',pWinter:'Ha empezado el evento de invierno ❄️',pXmas:'Ya está el menú especial de Navidad 🎄'});
Object.assign(L.vi,{shipH:h=>`còn khoảng ${h} giờ`,shipSec:s=>`còn ${s} giây`,orderPlaced:x=>`Đã đặt ${x}! 1-2 ngày nữa sẽ tới 🚚`,researchStart:x=>`Bắt đầu nghiên cứu ${x} 🔬`,arrived:x=>`${x} bạn đặt đã tới!`,researched:x=>`Đã nghiên cứu xong ${x}!`,
  spTitle:'Đơn đặc biệt theo nhóm',spBanner:n=>`Có đơn đặc biệt! ${n} bánh`,spAsk:(n,r)=>`Có một đơn lớn theo nhóm. Hãy bán ${n} bánh trong 30 phút! Thưởng ${r}`,spAccept:'Nhận đơn',spProg:(m,g,n)=>`Còn ${m} phút · ${g}/${n}`,spDone:r=>`Hoàn thành đơn đặc biệt! +${r}`,spStart:(m,n)=>`Bán ${n} bánh trong ${m} phút!`,
  att:'Điểm danh',attBtn:'Đóng dấu hôm nay 🎁',attGot:r=>`Thưởng điểm danh +${r}`,attDone:'Hôm nay đã đóng dấu ✓',attStreak:n=>`${n} ngày liên tiếp`,
  nameAsk:'Đặt tên cho tiệm bánh cá của riêng bạn',nameHint:'VD: Nhà Mèo',nameSuffix:'Bungeoppang',
  nfAsk:'Bật thông báo nhé?',nfAskD:'Chúng tôi báo khi hàng tới, phần thưởng hôm nay và đơn đặc biệt. Tối đa 2 lần mỗi ngày, không gửi ban đêm.',nfYes:'Bật thông báo',nfNo:'Để sau',nf_profit:'Thông báo thu nhập',nf_event:'Thông báo sự kiện',nf_back:'Thông báo quay lại',
  pDaily:'Phần thưởng hôm nay đang chờ bạn 🎁',pSpecial:n=>`Có đơn đặc biệt theo nhóm. Hãy nướng ${n} bánh trong 30 phút!`,pBack:'Tiệm bánh cá suýt phải đóng cửa 😢 Ông chủ ơi, quay lại nhé',pWinter:'Sự kiện mùa đông đã bắt đầu ❄️',pXmas:'Thực đơn Giáng sinh đặc biệt đã có 🎄'});
Object.assign(L.th,{shipH:h=>`เหลือประมาณ ${h} ชั่วโมง`,shipSec:s=>`เหลือ ${s} วินาที`,orderPlaced:x=>`สั่ง${x}แล้ว! จะมาถึงใน 1-2 วัน 🚚`,researchStart:x=>`เริ่มวิจัย${x}แล้ว 🔬`,arrived:x=>`${x}ที่สั่งไว้มาถึงแล้ว!`,researched:x=>`วิจัย${x}เสร็จแล้ว!`,
  spTitle:'ออร์เดอร์พิเศษแบบกลุ่ม',spBanner:n=>`มีออร์เดอร์พิเศษ! ${n} ชิ้น`,spAsk:(n,r)=>`มีออร์เดอร์กลุ่มจำนวนมาก ขายขนม ${n} ชิ้นให้ได้ภายใน 30 นาที! รางวัล ${r}`,spAccept:'รับออร์เดอร์',spProg:(m,g,n)=>`เหลือ ${m} นาที · ${g}/${n}`,spDone:r=>`ออร์เดอร์พิเศษสำเร็จ! +${r}`,spStart:(m,n)=>`ขาย ${n} ชิ้นภายใน ${m} นาที!`,
  att:'สมุดเช็กชื่อ',attBtn:'ประทับตราวันนี้ 🎁',attGot:r=>`รางวัลเช็กชื่อ +${r}`,attDone:'วันนี้ประทับตราแล้ว ✓',attStreak:n=>`เข้าต่อเนื่อง ${n} วัน`,
  nameAsk:'ตั้งชื่อร้านขนมปลาของคุณเอง',nameHint:'เช่น บ้านแมว',nameSuffix:'บุงออปัง',
  nfAsk:'เปิดการแจ้งเตือนไหม',nfAskD:'เราจะแจ้งเมื่อของมาถึง รางวัลประจำวัน และออร์เดอร์พิเศษ ไม่เกินวันละ 2 ครั้ง และไม่ส่งตอนกลางคืน',nfYes:'เปิดการแจ้งเตือน',nfNo:'ไว้ทีหลัง',nf_profit:'แจ้งเตือนรายได้',nf_event:'แจ้งเตือนอีเวนต์',nf_back:'แจ้งเตือนชวนกลับมา',
  pDaily:'รางวัลของวันนี้รออยู่ 🎁',pSpecial:n=>`มีออร์เดอร์พิเศษแบบกลุ่ม อบให้ได้ ${n} ชิ้นภายใน 30 นาที!`,pBack:'ร้านบุงออปังเกือบต้องปิดแล้ว 😢 เจ้าของร้าน กลับมาเถอะ',pWinter:'อีเวนต์ฤดูหนาวเริ่มแล้ว ❄️',pXmas:'เมนูพิเศษคริสต์มาสมาแล้ว 🎄'});
Object.assign(L.id,{shipH:h=>`sekitar ${h} jam lagi`,shipSec:s=>`${s} detik lagi`,orderPlaced:x=>`${x} dipesan! Tiba dalam 1-2 hari 🚚`,researchStart:x=>`Riset dimulai: ${x} 🔬`,arrived:x=>`Pesananmu, ${x}, sudah tiba!`,researched:x=>`Riset ${x} selesai!`,
  spTitle:'Pesanan khusus rombongan',spBanner:n=>`Ada pesanan khusus! ${n} kue`,spAsk:(n,r)=>`Ada pesanan besar dari rombongan. Jual ${n} kue dalam 30 menit! Hadiah ${r}`,spAccept:'Terima pesanan',spProg:(m,g,n)=>`Sisa ${m} menit · ${g}/${n}`,spDone:r=>`Pesanan khusus selesai! +${r}`,spStart:(m,n)=>`Jual ${n} kue dalam ${m} menit!`,
  att:'Absensi',attBtn:'Cap hari ini 🎁',attGot:r=>`Hadiah absensi +${r}`,attDone:'Hari ini sudah dicap ✓',attStreak:n=>`${n} hari berturut-turut`,
  nameAsk:'Beri nama kedai bungeoppang milikmu',nameHint:'mis. Si Kucing',nameSuffix:'Bungeoppang',
  nfAsk:'Nyalakan notifikasi?',nfAskD:'Kami memberi tahu saat pesanan tiba, hadiah harian, dan pesanan khusus. Maksimal 2 kali sehari, tidak dikirim malam hari.',nfYes:'Nyalakan',nfNo:'Nanti',nf_profit:'Notifikasi pendapatan',nf_event:'Notifikasi event',nf_back:'Notifikasi ajakan kembali',
  pDaily:'Hadiah hari ini menunggumu 🎁',pSpecial:n=>`Ada pesanan khusus rombongan. Panggang ${n} kue dalam 30 menit!`,pBack:'Kedai bungeoppang hampir tutup 😢 Bos, kembalilah',pWinter:'Event musim dingin sudah dimulai ❄️',pXmas:'Menu spesial Natal sudah hadir 🎄'});
// matcha batter
Object.assign(L.ko,{b_matcha:'말차 반죽',i_matcha:'말차 반죽',i_matchaD:'붕어빵 +200원, 말차 좋아하는 손님 등장'});
Object.assign(L.en,{b_matcha:'Matcha',i_matcha:'Matcha batter',i_matchaD:'+₩200 per bun, matcha fans visit'});
Object.assign(L.zh,{b_matcha:'抹茶',i_matcha:'抹茶面糊',i_matchaD:'每个 +₩200，抹茶爱好者会来'});
Object.assign(L.ja,{b_matcha:'抹茶',i_matcha:'抹茶生地',i_matchaD:'1個 +₩200、抹茶好きが来る'});
Object.assign(L.ar,{b_matcha:'ماتشا',i_matcha:'عجينة الماتشا',i_matchaD:'+₩200 لكل كعكة، يأتي محبو الماتشا'});
Object.assign(L.es,{b_matcha:'Matcha',i_matcha:'Masa de matcha',i_matchaD:'+₩200 por pez, vienen fans del matcha'});
Object.assign(L.vi,{b_matcha:'Matcha',i_matcha:'Bột matcha',i_matchaD:'+₩200 mỗi bánh, khách mê matcha sẽ đến'});
Object.assign(L.th,{b_matcha:'มัทฉะ',i_matcha:'แป้งมัทฉะ',i_matchaD:'+₩200 ต่อชิ้น ลูกค้าสายมัทฉะจะมา'});
Object.assign(L.id,{b_matcha:'Matcha',i_matcha:'Adonan matcha',i_matchaD:'+₩200 per kue, penggemar matcha datang'});

// instant bake (paid booster)
Object.assign(L.ko,{bake:'전체 즉시 굽기',bakeD:n=>`판 위의 붕어빵이 한 번에 다 익어요 · ${BAKE_PACK}회 묶음 · 보유 ${n}`,bakeGot:n=>`전체 즉시 굽기 ${n}회 획득!`,bakeNone:'전체 즉시 굽기가 없어요. 상점에서 살 수 있어요',bakeNoBun:'판에 굽는 붕어빵이 없어요',bakeOn:'⚡ 전부 다 익었어요!'});
Object.assign(L.en,{bake:'Instant Bake',bakeD:n=>`Every bun on the grill is done at once · pack of ${BAKE_PACK} · You have ${n}`,bakeGot:n=>`Got ${n} Instant Bakes!`,bakeNone:'No Instant Bake left. Buy it in the Market',bakeNoBun:'No buns on the grill',bakeOn:'⚡ All done!'});
Object.assign(L.zh,{bake:'全部瞬间烤熟',bakeD:n=>`烤盘上的鲷鱼烧一次全部烤熟 · ${BAKE_PACK}次装 · 拥有 ${n}`,bakeGot:n=>`获得 ${n} 次全部瞬间烤熟！`,bakeNone:'没有瞬间烤熟了，可以在商店购买',bakeNoBun:'烤盘上没有正在烤的鲷鱼烧',bakeOn:'⚡ 全部烤好了！'});
Object.assign(L.ja,{bake:'まとめて即焼き',bakeD:n=>`焼き型のたい焼きが一気に焼き上がります · ${BAKE_PACK}回セット · 所持 ${n}`,bakeGot:n=>`まとめて即焼きを${n}回分ゲット！`,bakeNone:'まとめて即焼きがありません。ショップで買えます',bakeNoBun:'焼いているたい焼きがありません',bakeOn:'⚡ ぜんぶ焼けました！'});
Object.assign(L.ar,{bake:'خبز فوري',bakeD:n=>`تنضج كل الكعكات على الشواية دفعة واحدة · حزمة ${BAKE_PACK} · لديك ${n}`,bakeGot:n=>`حصلت على ${n} خبز فوري!`,bakeNone:'لا يوجد خبز فوري. اشترِه من المتجر',bakeNoBun:'لا توجد كعكات على الشواية',bakeOn:'⚡ نضج الكل!'});
Object.assign(L.es,{bake:'Horneado instantáneo',bakeD:n=>`Todos los peces de la plancha quedan listos al instante · pack de ${BAKE_PACK} · Tienes ${n}`,bakeGot:n=>`¡Conseguiste ${n} horneados instantáneos!`,bakeNone:'No te quedan horneados instantáneos. Cómpralos en la tienda',bakeNoBun:'No hay peces en la plancha',bakeOn:'⚡ ¡Todo listo!'});
Object.assign(L.vi,{bake:'Nướng tức thì',bakeD:n=>`Mọi bánh trên khuôn chín ngay lập tức · gói ${BAKE_PACK} lượt · Bạn có ${n}`,bakeGot:n=>`Nhận ${n} lượt Nướng tức thì!`,bakeNone:'Hết Nướng tức thì. Mua ở cửa hàng nhé',bakeNoBun:'Không có bánh nào đang nướng',bakeOn:'⚡ Chín hết rồi!'});
Object.assign(L.th,{bake:'อบเสร็จทันที',bakeD:n=>`ขนมบนเตาสุกพร้อมกันทันที · แพ็ก ${BAKE_PACK} ครั้ง · มี ${n}`,bakeGot:n=>`ได้รับอบเสร็จทันที ${n} ครั้ง!`,bakeNone:'ไม่มีอบเสร็จทันที ซื้อได้ที่ร้านค้า',bakeNoBun:'ไม่มีขนมบนเตา',bakeOn:'⚡ สุกหมดแล้ว!'});
Object.assign(L.id,{bake:'Matang Instan',bakeD:n=>`Semua kue di cetakan langsung matang · paket isi ${BAKE_PACK} · Kamu punya ${n}`,bakeGot:n=>`Dapat ${n} Matang Instan!`,bakeNone:'Matang Instan habis. Beli di toko',bakeNoBun:'Tidak ada kue di cetakan',bakeOn:'⚡ Semua matang!'});
// tag on a covered mold that still needs flipping
L.ko.flipTag='뒤집기';
L.en.flipTag='Flip';
L.zh.flipTag='翻面';
L.ja.flipTag='返す';
L.ar.flipTag='اقلب';
L.es.flipTag='Voltear';
L.vi.flipTag='Lật';
L.th.flipTag='พลิก';
L.id.flipTag='Balik';
// group-order bonus game
Object.assign(L.ko,{spAsk:(n,r)=>`단체 대량 주문이 들어왔어요! 번외 게임에서 ${SP_MIN}분 안에 팥 붕어빵 ${n}개를 구워 주세요. 보상 ${r} · 하나도 안 태우면 경험치 2배`,pSpecial:n=>`단체 주문이 들어왔어요. ${SP_MIN}분 안에 ${n}개를 구워 주세요!`,spStart:(m,n)=>`${m}분 안에 팥 붕어빵 ${n}개를 구워요!`,spFail:'시간 안에 다 굽지 못했어요. 다시 도전해 보세요!',spNoBurn:'탄 것 없음 · 경험치 2배'});
Object.assign(L.en,{spAsk:(n,r)=>`A big group order came in! In the bonus game, bake ${n} red bean buns in ${SP_MIN} minutes. Reward ${r} · burn nothing for double XP`,pSpecial:n=>`A group order came in. Bake ${n} buns in ${SP_MIN} minutes!`,spStart:(m,n)=>`Bake ${n} red bean buns in ${m} minutes!`,spFail:'Not enough buns in time. Try again!',spNoBurn:'Nothing burnt · double XP'});
Object.assign(L.zh,{spAsk:(n,r)=>`来了一笔团体大订单！在番外游戏里${SP_MIN}分钟内烤好${n}个红豆鲷鱼烧。奖励 ${r} · 一个都不烤焦经验值2倍`,pSpecial:n=>`来了团体订单。请在${SP_MIN}分钟内烤好${n}个！`,spStart:(m,n)=>`${m}分钟内烤好${n}个红豆鲷鱼烧！`,spFail:'没能在时间内烤完，再挑战一次吧！',spNoBurn:'零烤焦 · 经验值2倍'});
Object.assign(L.ja,{spAsk:(n,r)=>`団体の大量注文が入りました！番外ゲームで${SP_MIN}分以内にあんこたい焼きを${n}個焼いてください。報酬 ${r} · 焦がさなければ経験値2倍`,pSpecial:n=>`団体注文が入りました。${SP_MIN}分以内に${n}個焼いてください！`,spStart:(m,n)=>`${m}分以内にあんこたい焼きを${n}個焼こう！`,spFail:'時間内に焼ききれませんでした。もう一度挑戦しよう！',spNoBurn:'焦げなし · 経験値2倍'});
Object.assign(L.ar,{spAsk:(n,r)=>`وصل طلب جماعي كبير! في اللعبة الإضافية اخبز ${n} كعكة فاصوليا خلال ${SP_MIN} دقائق. المكافأة ${r} · بلا حرق تحصل على خبرة مضاعفة`,pSpecial:n=>`وصل طلب جماعي. اخبز ${n} كعكة خلال ${SP_MIN} دقائق!`,spStart:(m,n)=>`اخبز ${n} كعكة فاصوليا خلال ${m} دقائق!`,spFail:'لم تكتمل الكعكات في الوقت. حاول مرة أخرى!',spNoBurn:'بلا حرق · خبرة مضاعفة'});
Object.assign(L.es,{spAsk:(n,r)=>`¡Ha llegado un gran pedido de grupo! En el juego extra, hornea ${n} peces de judía roja en ${SP_MIN} minutos. Premio ${r} · sin quemar nada, doble XP`,pSpecial:n=>`Ha llegado un pedido de grupo. ¡Hornea ${n} peces en ${SP_MIN} minutos!`,spStart:(m,n)=>`¡Hornea ${n} peces de judía roja en ${m} minutos!`,spFail:'No llegaste a tiempo. ¡Inténtalo otra vez!',spNoBurn:'Nada quemado · doble XP'});
Object.assign(L.vi,{spAsk:(n,r)=>`Có đơn hàng nhóm lớn! Trong màn phụ, hãy nướng ${n} bánh đậu đỏ trong ${SP_MIN} phút. Thưởng ${r} · không cháy cái nào được gấp đôi XP`,pSpecial:n=>`Có đơn hàng nhóm. Nướng ${n} bánh trong ${SP_MIN} phút nhé!`,spStart:(m,n)=>`Nướng ${n} bánh đậu đỏ trong ${m} phút!`,spFail:'Chưa kịp nướng đủ. Thử lại nhé!',spNoBurn:'Không cháy · gấp đôi XP'});
Object.assign(L.th,{spAsk:(n,r)=>`มีออเดอร์กลุ่มใหญ่เข้ามา! ในเกมพิเศษ อบขนมไส้ถั่วแดง ${n} ชิ้นภายใน ${SP_MIN} นาที รางวัล ${r} · ไม่ไหม้เลยรับ XP 2 เท่า`,pSpecial:n=>`มีออเดอร์กลุ่มเข้ามา อบ ${n} ชิ้นภายใน ${SP_MIN} นาที!`,spStart:(m,n)=>`อบขนมไส้ถั่วแดง ${n} ชิ้นภายใน ${m} นาที!`,spFail:'อบไม่ทันเวลา ลองใหม่อีกครั้ง!',spNoBurn:'ไม่ไหม้เลย · XP 2 เท่า'});
Object.assign(L.id,{spAsk:(n,r)=>`Ada pesanan rombongan besar! Di game bonus, panggang ${n} kue kacang merah dalam ${SP_MIN} menit. Hadiah ${r} · tanpa gosong dapat XP ganda`,pSpecial:n=>`Ada pesanan rombongan. Panggang ${n} kue dalam ${SP_MIN} menit!`,spStart:(m,n)=>`Panggang ${n} kue kacang merah dalam ${m} menit!`,spFail:'Belum cukup tepat waktu. Coba lagi!',spNoBurn:'Tanpa gosong · XP ganda'});
// attendance gift claim button
L.ko.attClaim='받기';
L.en.attClaim='Claim';
L.zh.attClaim='领取';
L.ja.attClaim='受け取る';
L.ar.attClaim='استلم';
L.es.attClaim='Recibir';
L.vi.attClaim='Nhận';
L.th.attClaim='รับ';
L.id.attClaim='Ambil';
// info & policies menu (long documents: ko and en; other languages read the English text)
Object.assign(L.ko,{"lgMenu": "정보 · 정책", "lgPP": "개인정보처리방침", "lgTos": "이용약관", "lgAds": "광고 개인정보 설정", "lgDel": "데이터 삭제 요청", "lgMail": "문의하기", "lgVer": "버전", "lgWeb": "웹에서 전체 보기", "lgAppOnly": "앱에서만 설정할 수 있어요", "lgSoon": "문의 주소를 준비 중이에요", "ppText": "붕어빵 타이쿤(이하 '게임')은 회원가입이 없으며, 이름·연락처 등 개인을 식별하는 정보를 직접 수집하지 않습니다.\n\n1. 기기에 저장되는 정보\n게임 진행 상황(단계, 코인, 설정, 가게 이름)은 사용자 기기 안에만 저장되며 서버로 전송되지 않습니다.\n\n2. 광고 (Google AdMob)\n게임은 Google AdMob 광고를 보여 줍니다. AdMob은 광고 제공과 측정을 위해 광고 ID, 기기 정보, 대략적인 위치, 광고 반응 정보를 수집할 수 있습니다. 자세한 내용은 Google 개인정보처리방침(policies.google.com/privacy)을 따릅니다.\n'광고 개인정보 설정'에서 맞춤 광고 동의를 언제든 바꿀 수 있습니다.\n\n3. 인앱 결제\n결제는 Google Play·App Store가 처리하며, 게임은 카드 등 결제 정보를 받지 않습니다.\n\n4. 알림\n알림은 기기 안에서 예약되는 로컬 알림이며, 설정에서 종류별로 끌 수 있습니다.\n\n5. 아동\n게임은 만 13세 미만 아동을 대상으로 하지 않습니다.\n\n6. 삭제와 문의\n기기에 저장된 데이터는 '데이터 삭제 요청' 안내에 따라 언제든 지울 수 있습니다. 문의는 '문의하기'로 보내 주세요.", "tosText": "1. 게임 내 코인·경험치·아이템은 게임 안에서만 쓰이며 현금으로 바꿀 수 없습니다.\n2. 유료 상품의 환불은 Google Play·App Store 환불 정책을 따릅니다.\n3. 데이터는 기기에 저장되므로 앱 삭제·기기 변경 시 진행 상황이 사라질 수 있습니다.\n4. 비정상적인 방법(변조, 자동화 등)으로 얻은 보상은 회수될 수 있습니다.\n5. 게임 내용과 이 약관은 업데이트로 바뀔 수 있으며, 바뀐 내용은 이 화면에 표시됩니다.", "delText": "게임은 계정과 서버 저장이 없어서, 모든 진행 데이터는 이 기기 안에만 있습니다.\n\n• 진행 데이터 지우기: 설정 > '처음부터 다시하기'를 누르면 즉시 삭제됩니다.\n• 모두 지우기: 앱을 삭제하면 기기에 남은 데이터도 함께 지워집니다.\n• 광고 데이터: '광고 개인정보 설정'에서 동의를 철회하거나, 기기 설정에서 광고 ID를 재설정·삭제할 수 있습니다."});
Object.assign(L.en,{"lgMenu": "Info & Policies", "lgPP": "Privacy Policy", "lgTos": "Terms of Service", "lgAds": "Ad privacy settings", "lgDel": "Delete my data", "lgMail": "Contact us", "lgVer": "Version", "lgWeb": "View on the web", "lgAppOnly": "Available in the app", "lgSoon": "Contact address coming soon", "ppText": "Bungeoppang Tycoon (the 'Game') has no sign-up and does not directly collect information that identifies you, such as your name or contact details.\n\n1. Data stored on your device\nYour progress (stages, coins, settings, shop name) is stored only on your device and is not sent to a server.\n\n2. Ads (Google AdMob)\nThe Game shows Google AdMob ads. To serve and measure ads, AdMob may collect your advertising ID, device information, approximate location and ad interactions, as described in Google's Privacy Policy (policies.google.com/privacy).\nYou can change your personalized-ads consent at any time in 'Ad privacy settings'.\n\n3. In-app purchases\nPayments are handled by Google Play or the App Store; the Game never receives card or payment details.\n\n4. Notifications\nNotifications are local reminders scheduled on your device and can be turned off by type in Settings.\n\n5. Children\nThe Game is not directed at children under 13.\n\n6. Deletion and contact\nYou can erase the data on your device at any time as described in 'Delete my data'. Questions can be sent via 'Contact us'.", "tosText": "1. Coins, XP and items work only inside the Game and cannot be exchanged for money.\n2. Refunds for paid items follow the Google Play / App Store refund policies.\n3. Data is stored on your device, so progress may be lost if you delete the app or change devices.\n4. Rewards obtained by abnormal means (tampering, automation) may be removed.\n5. The Game and these terms may change with updates; changes are shown on this screen.", "delText": "The Game has no accounts or server storage, so all progress lives only on this device.\n\n• Erase progress: Settings > 'Start over' deletes it immediately.\n• Erase everything: uninstalling the app removes all remaining data from the device.\n• Ad data: withdraw consent in 'Ad privacy settings', or reset/delete your advertising ID in your device settings."});
Object.assign(L.zh,{"lgMenu": "信息与政策", "lgPP": "隐私政策", "lgTos": "服务条款", "lgAds": "广告隐私设置", "lgDel": "删除我的数据", "lgMail": "联系我们", "lgVer": "版本", "lgWeb": "在网页上查看", "lgAppOnly": "仅可在应用中设置", "lgSoon": "联系地址准备中"});
Object.assign(L.ja,{"lgMenu": "情報・ポリシー", "lgPP": "プライバシーポリシー", "lgTos": "利用規約", "lgAds": "広告のプライバシー設定", "lgDel": "データ削除のリクエスト", "lgMail": "お問い合わせ", "lgVer": "バージョン", "lgWeb": "Webで全文を見る", "lgAppOnly": "アプリでのみ設定できます", "lgSoon": "お問い合わせ先を準備中です"});
Object.assign(L.ar,{"lgMenu": "المعلومات والسياسات", "lgPP": "سياسة الخصوصية", "lgTos": "شروط الخدمة", "lgAds": "إعدادات خصوصية الإعلانات", "lgDel": "حذف بياناتي", "lgMail": "اتصل بنا", "lgVer": "الإصدار", "lgWeb": "عرض على الويب", "lgAppOnly": "متاح في التطبيق فقط", "lgSoon": "عنوان التواصل قريبًا"});
Object.assign(L.es,{"lgMenu": "Información y políticas", "lgPP": "Política de privacidad", "lgTos": "Términos del servicio", "lgAds": "Privacidad de anuncios", "lgDel": "Borrar mis datos", "lgMail": "Contacto", "lgVer": "Versión", "lgWeb": "Ver en la web", "lgAppOnly": "Disponible en la app", "lgSoon": "Dirección de contacto próximamente"});
Object.assign(L.vi,{"lgMenu": "Thông tin & chính sách", "lgPP": "Chính sách quyền riêng tư", "lgTos": "Điều khoản dịch vụ", "lgAds": "Cài đặt quyền riêng tư quảng cáo", "lgDel": "Xóa dữ liệu của tôi", "lgMail": "Liên hệ", "lgVer": "Phiên bản", "lgWeb": "Xem trên web", "lgAppOnly": "Chỉ có trong ứng dụng", "lgSoon": "Địa chỉ liên hệ sắp có"});
Object.assign(L.th,{"lgMenu": "ข้อมูลและนโยบาย", "lgPP": "นโยบายความเป็นส่วนตัว", "lgTos": "ข้อกำหนดการใช้บริการ", "lgAds": "ตั้งค่าความเป็นส่วนตัวของโฆษณา", "lgDel": "ขอลบข้อมูล", "lgMail": "ติดต่อเรา", "lgVer": "เวอร์ชัน", "lgWeb": "ดูบนเว็บ", "lgAppOnly": "ตั้งค่าได้ในแอปเท่านั้น", "lgSoon": "กำลังเตรียมช่องทางติดต่อ"});
Object.assign(L.id,{"lgMenu": "Info & Kebijakan", "lgPP": "Kebijakan Privasi", "lgTos": "Ketentuan Layanan", "lgAds": "Pengaturan privasi iklan", "lgDel": "Hapus data saya", "lgMail": "Hubungi kami", "lgVer": "Versi", "lgWeb": "Lihat di web", "lgAppOnly": "Hanya tersedia di aplikasi", "lgSoon": "Alamat kontak segera hadir"});
// small ornaments
Object.assign(L.ko,{"dknot": "전통 매듭 노리개", "dpouch": "복주머니", "dgarland": "눈꽃 가랜드", "dbell": "황동 손님 종", "dmobile": "붕어 모빌", "dsnowman": "털실 눈사람", "dwreath": "겨울 리스", "dglobe": "붕어빵 스노우볼"});
Object.assign(L.en,{"dknot": "Knot tassel charm", "dpouch": "Lucky pouch", "dgarland": "Snowflake garland", "dbell": "Brass shop bell", "dmobile": "Fish mobile", "dsnowman": "Woolly snowman", "dwreath": "Winter wreath", "dglobe": "Bungeoppang snow globe"});
Object.assign(L.zh,{"dknot": "中国结挂饰", "dpouch": "福袋", "dgarland": "雪花挂旗", "dbell": "黄铜门铃", "dmobile": "小鱼风铃", "dsnowman": "毛线雪人", "dwreath": "冬日花环", "dglobe": "鲷鱼烧水晶球"});
Object.assign(L.ja,{"dknot": "飾り結びのチャーム", "dpouch": "福袋", "dgarland": "雪の結晶ガーランド", "dbell": "真ちゅうのベル", "dmobile": "たい焼きモビール", "dsnowman": "毛糸の雪だるま", "dwreath": "冬のリース", "dglobe": "たい焼きスノードーム"});
Object.assign(L.ar,{"dknot": "تعليقة عقدة تقليدية", "dpouch": "كيس الحظ", "dgarland": "زينة ندف الثلج", "dbell": "جرس نحاسي", "dmobile": "معلّقة الأسماك", "dsnowman": "رجل ثلج صوفي", "dwreath": "إكليل شتوي", "dglobe": "كرة ثلج البونغوبانغ"});
Object.assign(L.es,{"dknot": "Borla de nudo", "dpouch": "Bolsita de la suerte", "dgarland": "Guirnalda de copos", "dbell": "Campana de latón", "dmobile": "Móvil de peces", "dsnowman": "Muñeco de nieve de lana", "dwreath": "Corona de invierno", "dglobe": "Bola de nieve bungeoppang"});
Object.assign(L.vi,{"dknot": "Dây tua thắt nút", "dpouch": "Túi may mắn", "dgarland": "Dây bông tuyết", "dbell": "Chuông đồng", "dmobile": "Chuông gió cá", "dsnowman": "Người tuyết len", "dwreath": "Vòng hoa mùa đông", "dglobe": "Quả cầu tuyết bánh cá"});
Object.assign(L.th,{"dknot": "พู่เชือกถักมงคล", "dpouch": "ถุงนำโชค", "dgarland": "ธงราวเกล็ดหิมะ", "dbell": "กระดิ่งทองเหลือง", "dmobile": "โมบายปลา", "dsnowman": "ตุ๊กตาหิมะไหมพรม", "dwreath": "พวงหรีดฤดูหนาว", "dglobe": "ลูกแก้วหิมะบุงออปัง"});
Object.assign(L.id,{"dknot": "Hiasan simpul rumbai", "dpouch": "Kantong keberuntungan", "dgarland": "Untaian kepingan salju", "dbell": "Lonceng kuningan", "dmobile": "Gantungan ikan", "dsnowman": "Boneka salju wol", "dwreath": "Karangan musim dingin", "dglobe": "Bola salju bungeoppang"});
// settings: notification group row
L.ko.nfGroup="알림";
L.en.nfGroup="Notifications";
L.zh.nfGroup="通知";
L.ja.nfGroup="通知";
L.ar.nfGroup="الإشعارات";
L.es.nfGroup="Notificaciones";
L.vi.nfGroup="Thông báo";
L.th.nfGroup="การแจ้งเตือน";
L.id.nfGroup="Notifikasi";
// bonus game with guests and a mission card
Object.assign(L.ko,{spAsk:(n,r)=>`단체 대량 주문이 들어왔어요! 번외 게임에서 손님들이 시키는 붕어빵을 ${SP_MIN}분 안에 ${n}개 건네 주세요. 보상 ${r}`,spMissionT:"단체 주문 미션",spMinN:m=>`${m}분`,spBunN:n=>`${n}개`,spMissionD:"손님 한두 명이 여러 가지 맛을 섞어서 주문해요. 시간 안에 주문대로 구워서 건네면 성공!",spGo:"시작!"});
Object.assign(L.en,{spAsk:(n,r)=>`A big group order came in! In the bonus game, hand over ${n} buns the guests ask for in ${SP_MIN} minutes. Reward ${r}`,spMissionT:"Group order mission",spMinN:m=>`${m} min`,spBunN:n=>`${n} buns`,spMissionD:"One or two guests order a mix of flavors. Bake what they ask for and hand it over in time!",spGo:"Start!"});
Object.assign(L.zh,{spAsk:(n,r)=>`来了一笔团体大订单！在番外游戏里${SP_MIN}分钟内按客人的要求交出${n}个鲷鱼烧。奖励 ${r}`,spMissionT:"团体订单任务",spMinN:m=>`${m}分钟`,spBunN:n=>`${n}个`,spMissionD:"一两位客人会混着点各种口味。在时间内按订单烤好交给他们就成功！",spGo:"开始！"});
Object.assign(L.ja,{spAsk:(n,r)=>`団体の大量注文が入りました！番外ゲームで${SP_MIN}分以内に、お客さんの注文どおり${n}個渡してください。報酬 ${r}`,spMissionT:"団体注文ミッション",spMinN:m=>`${m}分`,spBunN:n=>`${n}個`,spMissionD:"お客さんが1〜2人、いろいろな味をまぜて注文します。時間内に注文どおり焼いて渡せば成功！",spGo:"スタート！"});
Object.assign(L.ar,{spAsk:(n,r)=>`وصل طلب جماعي كبير! في اللعبة الإضافية سلّم ${n} كعكة كما يطلب الزبائن خلال ${SP_MIN} دقائق. المكافأة ${r}`,spMissionT:"مهمة الطلب الجماعي",spMinN:m=>`${m} دقائق`,spBunN:n=>`${n} كعكة`,spMissionD:"زبون أو زبونان يطلبان نكهات متنوعة. اخبز ما يطلبونه وسلّمه في الوقت!",spGo:"ابدأ!"});
Object.assign(L.es,{spAsk:(n,r)=>`¡Ha llegado un gran pedido de grupo! En el juego extra, entrega ${n} peces según lo que pidan en ${SP_MIN} minutos. Premio ${r}`,spMissionT:"Misión del pedido de grupo",spMinN:m=>`${m} min`,spBunN:n=>`${n} peces`,spMissionD:"Uno o dos clientes piden sabores variados. ¡Hornea lo que piden y entrégalo a tiempo!",spGo:"¡Empezar!"});
Object.assign(L.vi,{spAsk:(n,r)=>`Có đơn hàng nhóm lớn! Trong màn phụ, giao ${n} bánh theo yêu cầu của khách trong ${SP_MIN} phút. Thưởng ${r}`,spMissionT:"Nhiệm vụ đơn hàng nhóm",spMinN:m=>`${m} phút`,spBunN:n=>`${n} bánh`,spMissionD:"Một hai vị khách gọi nhiều vị trộn lẫn. Nướng đúng món và giao kịp giờ là thành công!",spGo:"Bắt đầu!"});
Object.assign(L.th,{spAsk:(n,r)=>`มีออเดอร์กลุ่มใหญ่เข้ามา! ในเกมพิเศษ ส่งขนมตามที่ลูกค้าสั่ง ${n} ชิ้นภายใน ${SP_MIN} นาที รางวัล ${r}`,spMissionT:"ภารกิจออเดอร์กลุ่ม",spMinN:m=>`${m} นาที`,spBunN:n=>`${n} ชิ้น`,spMissionD:"ลูกค้าหนึ่งถึงสองคนสั่งหลายรสปนกัน อบตามออเดอร์แล้วส่งให้ทันเวลาก็สำเร็จ!",spGo:"เริ่ม!"});
Object.assign(L.id,{spAsk:(n,r)=>`Ada pesanan rombongan besar! Di game bonus, serahkan ${n} kue sesuai pesanan tamu dalam ${SP_MIN} menit. Hadiah ${r}`,spMissionT:"Misi pesanan rombongan",spMinN:m=>`${m} menit`,spBunN:n=>`${n} kue`,spMissionD:"Satu atau dua tamu memesan aneka rasa. Panggang sesuai pesanan dan serahkan tepat waktu!",spGo:"Mulai!"});
// bonus game time as minutes and seconds; exit button
const spDur=()=>t('minSec',Math.floor(SP_MIN),Math.round(SP_MIN%1*60));
Object.assign(L.ko,{minSec:(m,s)=>s?`${m}분 ${s}초`:`${m}분`,spAsk:(n,r)=>`단체 대량 주문이 들어왔어요! 번외 게임에서 손님들이 시키는 붕어빵을 ${spDur()} 안에 ${n}개 건네 주세요. 보상 ${r}`,pSpecial:n=>`단체 주문이 들어왔어요. ${spDur()} 안에 ${n}개를 구워 주세요!`,spMinN:()=>spDur(),exitGame:"게임 나가기"});
Object.assign(L.en,{minSec:(m,s)=>s?`${m} min ${s} s`:`${m} min`,spAsk:(n,r)=>`A big group order came in! In the bonus game, hand over ${n} buns the guests ask for within ${spDur()}. Reward ${r}`,pSpecial:n=>`A group order came in. Bake ${n} buns within ${spDur()}!`,spMinN:()=>spDur(),exitGame:"Exit game"});
Object.assign(L.zh,{minSec:(m,s)=>s?`${m}分${s}秒`:`${m}分钟`,spAsk:(n,r)=>`来了一笔团体大订单！在番外游戏里${spDur()}内按客人的要求交出${n}个鲷鱼烧。奖励 ${r}`,pSpecial:n=>`来了团体订单。请在${spDur()}内烤好${n}个！`,spMinN:()=>spDur(),exitGame:"退出游戏"});
Object.assign(L.ja,{minSec:(m,s)=>s?`${m}分${s}秒`:`${m}分`,spAsk:(n,r)=>`団体の大量注文が入りました！番外ゲームで${spDur()}以内に、お客さんの注文どおり${n}個渡してください。報酬 ${r}`,pSpecial:n=>`団体注文が入りました。${spDur()}以内に${n}個焼いてください！`,spMinN:()=>spDur(),exitGame:"ゲームをやめる"});
Object.assign(L.ar,{minSec:(m,s)=>s?`${m} د ${s} ث`:`${m} دقائق`,spAsk:(n,r)=>`وصل طلب جماعي كبير! في اللعبة الإضافية سلّم ${n} كعكة كما يطلب الزبائن خلال ${spDur()}. المكافأة ${r}`,pSpecial:n=>`وصل طلب جماعي. اخبز ${n} كعكة خلال ${spDur()}!`,spMinN:()=>spDur(),exitGame:"الخروج من اللعبة"});
Object.assign(L.es,{minSec:(m,s)=>s?`${m} min ${s} s`:`${m} min`,spAsk:(n,r)=>`¡Ha llegado un gran pedido de grupo! En el juego extra, entrega ${n} peces según lo que pidan en ${spDur()}. Premio ${r}`,pSpecial:n=>`Ha llegado un pedido de grupo. ¡Hornea ${n} peces en ${spDur()}!`,spMinN:()=>spDur(),exitGame:"Salir del juego"});
Object.assign(L.vi,{minSec:(m,s)=>s?`${m} phút ${s} giây`:`${m} phút`,spAsk:(n,r)=>`Có đơn hàng nhóm lớn! Trong màn phụ, giao ${n} bánh theo yêu cầu của khách trong ${spDur()}. Thưởng ${r}`,pSpecial:n=>`Có đơn hàng nhóm. Nướng ${n} bánh trong ${spDur()} nhé!`,spMinN:()=>spDur(),exitGame:"Thoát game"});
Object.assign(L.th,{minSec:(m,s)=>s?`${m} นาที ${s} วินาที`:`${m} นาที`,spAsk:(n,r)=>`มีออเดอร์กลุ่มใหญ่เข้ามา! ในเกมพิเศษ ส่งขนมตามที่ลูกค้าสั่ง ${n} ชิ้นภายใน ${spDur()} รางวัล ${r}`,pSpecial:n=>`มีออเดอร์กลุ่มเข้ามา อบ ${n} ชิ้นภายใน ${spDur()}!`,spMinN:()=>spDur(),exitGame:"ออกจากเกม"});
Object.assign(L.id,{minSec:(m,s)=>s?`${m} menit ${s} detik`:`${m} menit`,spAsk:(n,r)=>`Ada pesanan rombongan besar! Di game bonus, serahkan ${n} kue sesuai pesanan tamu dalam ${spDur()}. Hadiah ${r}`,pSpecial:n=>`Ada pesanan rombongan. Panggang ${n} kue dalam ${spDur()}!`,spMinN:()=>spDur(),exitGame:"Keluar game"});
// exit confirm
Object.assign(L.ko,{quitAsk:"정말 나갈까요?",quitD:"이번 단계는 클리어로 기록되지 않아요.",quitNo:"계속하기"});
Object.assign(L.en,{quitAsk:"Leave the game?",quitD:"This stage won't count as cleared.",quitNo:"Keep playing"});
Object.assign(L.zh,{quitAsk:"真的要退出吗？",quitD:"本关不会记为通关。",quitNo:"继续游戏"});
Object.assign(L.ja,{quitAsk:"本当にやめますか？",quitD:"このステージはクリア扱いになりません。",quitNo:"つづける"});
Object.assign(L.ar,{quitAsk:"هل تريد الخروج حقًا؟",quitD:"لن تُحتسب هذه المرحلة مكتملة.",quitNo:"واصل اللعب"});
Object.assign(L.es,{quitAsk:"¿Seguro que quieres salir?",quitD:"Esta fase no contará como superada.",quitNo:"Seguir jugando"});
Object.assign(L.vi,{quitAsk:"Thoát thật nhé?",quitD:"Màn này sẽ không được tính là hoàn thành.",quitNo:"Chơi tiếp"});
Object.assign(L.th,{quitAsk:"จะออกจริงไหม?",quitD:"ด่านนี้จะไม่นับว่าผ่าน",quitNo:"เล่นต่อ"});
Object.assign(L.id,{quitAsk:"Yakin mau keluar?",quitD:"Tahap ini tidak dihitung selesai.",quitNo:"Lanjut main"});

// XP exchange card
Object.assign(L.ko,{xpRule:`경험치 ${XP_RATE} XP = 1코인`,xpGo:'코인으로 바꾸기',xpMore:n=>`${n} XP 더 모으면 교환 가능`,xpReady:'지금 교환할 수 있어요',xpLvl:'레벨 진행도'});
Object.assign(L.en,{xpGo:'Swap for coins',xpMore:n=>`Earn ${n} more XP to swap`,xpReady:'Ready to swap now',xpLvl:'Level progress'});
Object.assign(L.zh,{xpGo:'兑换成金币',xpMore:n=>`再获得 ${n} 经验即可兑换`,xpReady:'现在可以兑换',xpLvl:'等级进度'});
Object.assign(L.ja,{xpGo:'コインに換える',xpMore:n=>`あと ${n} XPで交換できます`,xpReady:'今すぐ交換できます',xpLvl:'レベル進行度'});
Object.assign(L.ar,{xpGo:'استبدل بعملات',xpMore:n=>`اجمع ${n} خبرة أخرى للصرف`,xpReady:'جاهز للصرف الآن',xpLvl:'تقدم المستوى'});
Object.assign(L.es,{xpGo:'Cambiar por monedas',xpMore:n=>`Gana ${n} XP más para cambiar`,xpReady:'Listo para cambiar',xpLvl:'Progreso de nivel'});
Object.assign(L.vi,{xpGo:'Đổi sang xu',xpMore:n=>`Cần thêm ${n} XP để đổi`,xpReady:'Có thể đổi ngay',xpLvl:'Tiến độ cấp'});
Object.assign(L.th,{xpGo:'แลกเป็นเหรียญ',xpMore:n=>`ต้องมี XP อีก ${n} จึงจะแลกได้`,xpReady:'แลกได้เลยตอนนี้',xpLvl:'ความคืบหน้าเลเวล'});
Object.assign(L.id,{xpGo:'Tukar jadi koin',xpMore:n=>`Kumpulkan ${n} XP lagi untuk menukar`,xpReady:'Siap ditukar sekarang',xpLvl:'Progres level'});
// ranking
Object.assign(L.ko,{rank:'랭킹',rankTop:'랭킹 TOP 10',rankSold:'누적 판매량',rankRev:'누적 판매수익',rankN:n=>`${n}개`,rankMe:'내 가게',rankTest:'테스트용 예시 순위예요. 정식 서버 연결 후 실제 순위로 바뀌어요.'});
Object.assign(L.en,{rank:'Ranks',rankTop:'TOP 10',rankSold:'Total sold',rankRev:'Total earnings',rankN:n=>`${n}`,rankMe:'My shop',rankTest:'Sample ranks for testing. Real ranks appear once the server is connected.'});
Object.assign(L.zh,{rank:'排行',rankTop:'排行榜 TOP 10',rankSold:'累计销量',rankRev:'累计收入',rankN:n=>`${n}个`,rankMe:'我的店',rankTest:'这是测试用的示例排名，连接正式服务器后会显示真实排名。'});
Object.assign(L.ja,{rank:'ランク',rankTop:'ランキング TOP 10',rankSold:'累計販売数',rankRev:'累計売上',rankN:n=>`${n}個`,rankMe:'私の店',rankTest:'テスト用のサンプル順位です。サーバー接続後に実際の順位になります。'});
Object.assign(L.ar,{rank:'الترتيب',rankTop:'أفضل 10',rankSold:'إجمالي المبيعات',rankRev:'إجمالي الأرباح',rankN:n=>`${n}`,rankMe:'متجري',rankTest:'ترتيب تجريبي للاختبار. سيظهر الترتيب الحقيقي بعد ربط الخادم.'});
Object.assign(L.es,{rank:'Ranking',rankTop:'TOP 10',rankSold:'Ventas totales',rankRev:'Ganancias totales',rankN:n=>`${n}`,rankMe:'Mi tienda',rankTest:'Ranking de muestra para pruebas. El real aparecerá al conectar el servidor.'});
Object.assign(L.vi,{rank:'Xếp hạng',rankTop:'TOP 10',rankSold:'Tổng số đã bán',rankRev:'Tổng doanh thu',rankN:n=>`${n} cái`,rankMe:'Tiệm của tôi',rankTest:'Bảng xếp hạng mẫu để thử. Thứ hạng thật sẽ hiện khi kết nối máy chủ.'});
Object.assign(L.th,{rank:'อันดับ',rankTop:'อันดับ TOP 10',rankSold:'ยอดขายสะสม',rankRev:'รายได้สะสม',rankN:n=>`${n} ชิ้น`,rankMe:'ร้านของฉัน',rankTest:'อันดับตัวอย่างสำหรับทดสอบ อันดับจริงจะแสดงเมื่อเชื่อมต่อเซิร์ฟเวอร์'});
Object.assign(L.id,{rank:'Peringkat',rankTop:'TOP 10',rankSold:'Total terjual',rankRev:'Total pendapatan',rankN:n=>`${n}`,rankMe:'Tokoku',rankTest:'Peringkat contoh untuk uji coba. Peringkat asli muncul setelah server terhubung.'});
// stage receipt + ranking prompt
Object.assign(L.ko,{rcT:'정산 영수증',rcShop:'[판매 가게]',rcStage:'[스테이지]',rcItem:'그룹/상품',rcQty:'수량',rcAmt:'금액',rcGuests:'총 손님',rcN:n=>`${n}명`,rcAngry:'화내고 간 손님',rcRan:'돈 안 내고 간 손님',rcBurnt:'탄 붕어빵',rcSales:'이번 판 매출',rcCost:'재료값',rcNet:'순이익',rkAsk:'랭킹에 등록할까요?',rkAskD:n=>`지금 ${n}위에 오를 수 있는 점수예요!`,rkYes:'등록하기',rkNo:'나중에',rkDone:'랭킹에 등록했어요!'});
Object.assign(L.en,{rcT:'Receipt',rcShop:'[Shop]',rcStage:'[Stage]',rcItem:'Item',rcQty:'Qty',rcAmt:'Amount',rcGuests:'Guests',rcN:n=>`${n}`,rcAngry:'Left angry',rcRan:'Ran without paying',rcBurnt:'Burnt buns',rcSales:'Sales',rcCost:'Ingredients',rcNet:'Profit',rkAsk:'Join the ranking?',rkAskD:n=>`Your score can take place ${n}!`,rkYes:'Join',rkNo:'Later',rkDone:'You are on the ranking!'});
Object.assign(L.zh,{rcT:'结算小票',rcShop:'[店铺]',rcStage:'[关卡]',rcItem:'分类/商品',rcQty:'数量',rcAmt:'金额',rcGuests:'客人总数',rcN:n=>`${n}人`,rcAngry:'生气离开的客人',rcRan:'没付钱跑掉的客人',rcBurnt:'烤焦的鲷鱼烧',rcSales:'本局销售额',rcCost:'材料费',rcNet:'净利润',rkAsk:'要登记到排行榜吗？',rkAskD:n=>`现在的分数可以排到第${n}名！`,rkYes:'登记',rkNo:'以后再说',rkDone:'已登记到排行榜！'});
Object.assign(L.ja,{rcT:'精算レシート',rcShop:'[お店]',rcStage:'[ステージ]',rcItem:'グループ/商品',rcQty:'数量',rcAmt:'金額',rcGuests:'お客さん合計',rcN:n=>`${n}人`,rcAngry:'怒って帰った人',rcRan:'払わずに逃げた人',rcBurnt:'焦げたたい焼き',rcSales:'今回の売上',rcCost:'材料費',rcNet:'純利益',rkAsk:'ランキングに登録しますか？',rkAskD:n=>`今のスコアなら${n}位に入れます！`,rkYes:'登録する',rkNo:'あとで',rkDone:'ランキングに登録しました！'});
Object.assign(L.ar,{rcT:'إيصال الحساب',rcShop:'[المتجر]',rcStage:'[المرحلة]',rcItem:'الصنف',rcQty:'الكمية',rcAmt:'المبلغ',rcGuests:'إجمالي الزبائن',rcN:n=>`${n}`,rcAngry:'غادروا غاضبين',rcRan:'هربوا دون دفع',rcBurnt:'قطع محترقة',rcSales:'مبيعات الجولة',rcCost:'تكلفة المكونات',rcNet:'صافي الربح',rkAsk:'هل تسجل في الترتيب؟',rkAskD:n=>`نتيجتك تؤهلك للمركز ${n}!`,rkYes:'تسجيل',rkNo:'لاحقًا',rkDone:'تم التسجيل في الترتيب!'});
Object.assign(L.es,{rcT:'Recibo',rcShop:'[Tienda]',rcStage:'[Nivel]',rcItem:'Producto',rcQty:'Cant.',rcAmt:'Importe',rcGuests:'Clientes',rcN:n=>`${n}`,rcAngry:'Se fueron enfadados',rcRan:'Huyeron sin pagar',rcBurnt:'Quemados',rcSales:'Ventas',rcCost:'Ingredientes',rcNet:'Beneficio',rkAsk:'¿Entrar en el ranking?',rkAskD:n=>`¡Tu puntuación alcanza el puesto ${n}!`,rkYes:'Entrar',rkNo:'Luego',rkDone:'¡Ya estás en el ranking!'});
Object.assign(L.vi,{rcT:'Hóa đơn',rcShop:'[Cửa hàng]',rcStage:'[Màn]',rcItem:'Nhóm/Món',rcQty:'SL',rcAmt:'Số tiền',rcGuests:'Tổng khách',rcN:n=>`${n}`,rcAngry:'Khách giận bỏ đi',rcRan:'Khách chạy không trả tiền',rcBurnt:'Bánh bị cháy',rcSales:'Doanh thu màn này',rcCost:'Tiền nguyên liệu',rcNet:'Lợi nhuận',rkAsk:'Đăng ký lên bảng xếp hạng?',rkAskD:n=>`Điểm của bạn có thể đứng hạng ${n}!`,rkYes:'Đăng ký',rkNo:'Để sau',rkDone:'Đã lên bảng xếp hạng!'});
Object.assign(L.th,{rcT:'ใบเสร็จ',rcShop:'[ร้าน]',rcStage:'[ด่าน]',rcItem:'กลุ่ม/สินค้า',rcQty:'จำนวน',rcAmt:'ยอดเงิน',rcGuests:'ลูกค้าทั้งหมด',rcN:n=>`${n} คน`,rcAngry:'ลูกค้าที่โกรธแล้วกลับ',rcRan:'ลูกค้าที่หนีไม่จ่าย',rcBurnt:'ชิ้นที่ไหม้',rcSales:'ยอดขายรอบนี้',rcCost:'ค่าวัตถุดิบ',rcNet:'กำไรสุทธิ',rkAsk:'ลงทะเบียนในอันดับไหม?',rkAskD:n=>`คะแนนของคุณขึ้นอันดับ ${n} ได้!`,rkYes:'ลงทะเบียน',rkNo:'ไว้ทีหลัง',rkDone:'ลงทะเบียนในอันดับแล้ว!'});
Object.assign(L.id,{rcT:'Struk',rcShop:'[Toko]',rcStage:'[Tahap]',rcItem:'Grup/Produk',rcQty:'Jml',rcAmt:'Nominal',rcGuests:'Total tamu',rcN:n=>`${n}`,rcAngry:'Pergi karena marah',rcRan:'Kabur tanpa bayar',rcBurnt:'Gosong',rcSales:'Penjualan',rcCost:'Biaya bahan',rcNet:'Laba bersih',rkAsk:'Daftar ke peringkat?',rkAskD:n=>`Skormu bisa masuk peringkat ${n}!`,rkYes:'Daftar',rkNo:'Nanti',rkDone:'Sudah masuk peringkat!'});
// attendance streak gifts + booster pack
Object.assign(L.ko,{attWeek:'일주일 연속 출석하셨어요! 선물 드릴게요',attMonth:'한 달 내내 출석하셨어요! 부스터 패키지를 드릴게요',attPack:'부스터 패키지',attPackD:`즉시 굽기 ${ATT_PACK.bake}회 + 아이스 타임 ${ATT_PACK.ice}회 + 미니 붕어빵 ${ATT_PACK.mini}개 · 15% 할인`,attPackGot:'부스터 패키지를 받았어요!'});
Object.assign(L.en,{attWeek:'A full week of attendance! Here is a gift',attMonth:'A full month of attendance! Here is the booster pack',attPack:'Booster pack',attPackD:`Instant Bake ×${ATT_PACK.bake} + Ice Time ×${ATT_PACK.ice} + Mini buns ×${ATT_PACK.mini} · 15% off`,attPackGot:'Booster pack received!'});
Object.assign(L.zh,{attWeek:'连续签到一周！送你一份礼物',attMonth:'整月全勤！送你道具礼包',attPack:'道具礼包',attPackD:`瞬间烤熟 ${ATT_PACK.bake}次 + 冰爽时间 ${ATT_PACK.ice}次 + 迷你鲷鱼烧 ${ATT_PACK.mini}个 · 85折`,attPackGot:'获得道具礼包！'});
Object.assign(L.ja,{attWeek:'1週間連続で出席しました！プレゼントをどうぞ',attMonth:'1か月皆勤です！ブースターパックをどうぞ',attPack:'ブースターパック',attPackD:`即焼き ${ATT_PACK.bake}回 + アイスタイム ${ATT_PACK.ice}回 + ミニたい焼き ${ATT_PACK.mini}個 · 15%オフ`,attPackGot:'ブースターパックを受け取りました！'});
Object.assign(L.ar,{attWeek:'حضور أسبوع كامل! إليك هدية',attMonth:'حضور شهر كامل! إليك حزمة المعززات',attPack:'حزمة المعززات',attPackD:`خبز فوري ×${ATT_PACK.bake} + وقت الجليد ×${ATT_PACK.ice} + قطع صغيرة ×${ATT_PACK.mini} · خصم 15%`,attPackGot:'تم استلام حزمة المعززات!'});
Object.assign(L.es,{attWeek:'¡Una semana completa de asistencia! Toma un regalo',attMonth:'¡Un mes completo de asistencia! Toma el pack de potenciadores',attPack:'Pack de potenciadores',attPackD:`Horneado instantáneo ×${ATT_PACK.bake} + Tiempo de hielo ×${ATT_PACK.ice} + Mini ×${ATT_PACK.mini} · 15% dto.`,attPackGot:'¡Pack de potenciadores recibido!'});
Object.assign(L.vi,{attWeek:'Điểm danh đủ một tuần! Tặng bạn một món quà',attMonth:'Điểm danh đủ cả tháng! Tặng bạn gói tăng lực',attPack:'Gói tăng lực',attPackD:`Nướng ngay ×${ATT_PACK.bake} + Giờ băng ×${ATT_PACK.ice} + Bánh mini ×${ATT_PACK.mini} · giảm 15%`,attPackGot:'Đã nhận gói tăng lực!'});
Object.assign(L.th,{attWeek:'เช็กอินครบหนึ่งสัปดาห์! รับของขวัญเลย',attMonth:'เช็กอินครบทั้งเดือน! รับแพ็กบูสเตอร์เลย',attPack:'แพ็กบูสเตอร์',attPackD:`อบทันที ×${ATT_PACK.bake} + ไอซ์ไทม์ ×${ATT_PACK.ice} + มินิ ×${ATT_PACK.mini} · ลด 15%`,attPackGot:'ได้รับแพ็กบูสเตอร์แล้ว!'});
Object.assign(L.id,{attWeek:'Hadir seminggu penuh! Ini hadiahnya',attMonth:'Hadir sebulan penuh! Ini paket booster',attPack:'Paket booster',attPackD:`Panggang instan ×${ATT_PACK.bake} + Waktu es ×${ATT_PACK.ice} + Mini ×${ATT_PACK.mini} · diskon 15%`,attPackGot:'Paket booster diterima!'});
Object.assign(L.ko,{attNoteW:`일주일(일~토) 연속으로 도장을 찍으면 즉시 굽기 1개를 선물로 드려요`,attNoteM:`한 달 내내 도장을 찍으면 부스터 패키지(즉시 굽기 ${ATT_PACK.bake}회 + 아이스 타임 ${ATT_PACK.ice}회 + 미니 붕어빵 ${ATT_PACK.mini}개)를 드려요`});
Object.assign(L.en,{attNoteW:`Stamp all 7 days of a week (Sun–Sat) to get 1 Instant Bake`,attNoteM:`Stamp every day of the month to get the booster pack (Instant Bake ×${ATT_PACK.bake} + Ice Time ×${ATT_PACK.ice} + Mini buns ×${ATT_PACK.mini})`});
Object.assign(L.zh,{attNoteW:`一周（周日至周六）每天都盖章，送你瞬间烤熟 1次`,attNoteM:`整月每天都盖章，送你道具礼包（瞬间烤熟 ${ATT_PACK.bake}次 + 冰爽时间 ${ATT_PACK.ice}次 + 迷你鲷鱼烧 ${ATT_PACK.mini}个）`});
Object.assign(L.ja,{attNoteW:`1週間（日〜土）毎日スタンプを押すと、即焼き1回をプレゼント`,attNoteM:`1か月毎日スタンプを押すと、ブースターパック（即焼き${ATT_PACK.bake}回 + アイスタイム${ATT_PACK.ice}回 + ミニたい焼き${ATT_PACK.mini}個）をプレゼント`});
Object.assign(L.ar,{attNoteW:`اختم الأيام السبعة من الأسبوع (الأحد–السبت) لتحصل على خبز فوري ×1`,attNoteM:`اختم كل أيام الشهر لتحصل على حزمة المعززات (خبز فوري ×${ATT_PACK.bake} + وقت الجليد ×${ATT_PACK.ice} + قطع صغيرة ×${ATT_PACK.mini})`});
Object.assign(L.es,{attNoteW:`Sella los 7 días de la semana (dom–sáb) y recibe 1 Horneado instantáneo`,attNoteM:`Sella todos los días del mes y recibe el pack de potenciadores (Horneado instantáneo ×${ATT_PACK.bake} + Tiempo de hielo ×${ATT_PACK.ice} + Mini ×${ATT_PACK.mini})`});
Object.assign(L.vi,{attNoteW:`Đóng dấu đủ 7 ngày trong tuần (CN–T7) để nhận 1 Nướng ngay`,attNoteM:`Đóng dấu đủ cả tháng để nhận gói tăng lực (Nướng ngay ×${ATT_PACK.bake} + Giờ băng ×${ATT_PACK.ice} + Bánh mini ×${ATT_PACK.mini})`});
Object.assign(L.th,{attNoteW:`ประทับตราครบ 7 วันในสัปดาห์ (อา.–ส.) รับอบทันที 1 ครั้ง`,attNoteM:`ประทับตราครบทั้งเดือน รับแพ็กบูสเตอร์ (อบทันที ×${ATT_PACK.bake} + ไอซ์ไทม์ ×${ATT_PACK.ice} + มินิ ×${ATT_PACK.mini})`});
Object.assign(L.id,{attNoteW:`Cap semua 7 hari dalam seminggu (Min–Sab) untuk dapat 1 Panggang instan`,attNoteM:`Cap setiap hari dalam sebulan untuk dapat paket booster (Panggang instan ×${ATT_PACK.bake} + Waktu es ×${ATT_PACK.ice} + Mini ×${ATT_PACK.mini})`});
// streak warning + ranking overtake (notification text and the in-game popup)
Object.assign(L.ko,{nf_streak:"연속 출석 알림",nf_rank:"랭킹 추월 알림",pStreak:n=>`🔥 ${n}일 연속 출석 중! 오늘 도장을 안 찍으면 기록이 끊겨요`,pStreak7:n=>`🔥 ${n}일 연속 출석 중! 오늘 도장을 찍으면 7일차 보상을 받아요 🐟`,pRank:(s,p)=>`'${s}' 가게가 사장님을 추월했어요! 지금 ${p}위 📉 되찾으러 갈까요?`,rkLost:s=>`'${s}' 가게가 사장님을 추월했어요!`,rkLostD:(c,p)=>`${c} 순위가 ${p}위로 내려갔어요. 되찾으러 갈까요?`,rkGo:"랭킹 보기"});
Object.assign(L.en,{nf_streak:"Streak alerts",nf_rank:"Ranking alerts",pStreak:n=>`🔥 ${n}-day streak! Stamp today or it resets`,pStreak7:n=>`🔥 ${n}-day streak! Stamp today for the day-7 reward 🐟`,pRank:(s,p)=>`'${s}' just passed you! You're now #${p} 📉 Take it back?`,rkLost:s=>`'${s}' just passed you!`,rkLostD:(c,p)=>`You dropped to #${p} in ${c}. Take it back?`,rkGo:"See ranks"});
Object.assign(L.zh,{nf_streak:"连续签到通知",nf_rank:"排名被超通知",pStreak:n=>`🔥 已连续签到${n}天！今天不签到记录就断了`,pStreak7:n=>`🔥 已连续签到${n}天！今天签到可领第7天奖励 🐟`,pRank:(s,p)=>`“${s}”超过你了！现在第${p}名 📉 去夺回来吧？`,rkLost:s=>`“${s}”超过你了！`,rkLostD:(c,p)=>`${c}排名降到第${p}名了。去夺回来吧？`,rkGo:"查看排行"});
Object.assign(L.ja,{nf_streak:"連続出席のお知らせ",nf_rank:"ランキング逆転のお知らせ",pStreak:n=>`🔥 ${n}日連続出席中！今日スタンプを押さないと記録が途切れます`,pStreak7:n=>`🔥 ${n}日連続出席中！今日のスタンプで7日目のごほうびがもらえます 🐟`,pRank:(s,p)=>`「${s}」に抜かれました！現在${p}位 📉 取り返しに行きますか？`,rkLost:s=>`「${s}」に抜かれました！`,rkLostD:(c,p)=>`${c}の順位が${p}位に下がりました。取り返しに行きますか？`,rkGo:"ランキングを見る"});
Object.assign(L.ar,{nf_streak:"إشعارات الحضور المتتالي",nf_rank:"إشعارات تجاوز الترتيب",pStreak:n=>`🔥 ${n} أيام متتالية! اختم اليوم وإلا انقطع السجل`,pStreak7:n=>`🔥 ${n} أيام متتالية! اختم اليوم لتحصل على مكافأة اليوم السابع 🐟`,pRank:(s,p)=>`«${s}» تجاوزك! أنت الآن في المركز ${p} 📉 هل تستعيده؟`,rkLost:s=>`«${s}» تجاوزك!`,rkLostD:(c,p)=>`نزلت إلى المركز ${p} في ${c}. هل تستعيده؟`,rkGo:"عرض الترتيب"});
Object.assign(L.es,{nf_streak:"Avisos de racha",nf_rank:"Avisos de ranking",pStreak:n=>`🔥 ¡Racha de ${n} días! Sella hoy o se reinicia`,pStreak7:n=>`🔥 ¡Racha de ${n} días! Sella hoy y llévate el premio del día 7 🐟`,pRank:(s,p)=>`¡'${s}' te ha adelantado! Ahora vas en el puesto ${p} 📉 ¿Lo recuperas?`,rkLost:s=>`¡'${s}' te ha adelantado!`,rkLostD:(c,p)=>`Bajaste al puesto ${p} en ${c}. ¿Lo recuperas?`,rkGo:"Ver ranking"});
Object.assign(L.vi,{nf_streak:"Thông báo chuỗi điểm danh",nf_rank:"Thông báo bị vượt hạng",pStreak:n=>`🔥 Chuỗi ${n} ngày liên tiếp! Hôm nay không đóng dấu là mất chuỗi`,pStreak7:n=>`🔥 Chuỗi ${n} ngày liên tiếp! Đóng dấu hôm nay để nhận thưởng ngày thứ 7 🐟`,pRank:(s,p)=>`'${s}' vừa vượt qua bạn! Bạn đang hạng ${p} 📉 Giành lại nhé?`,rkLost:s=>`'${s}' vừa vượt qua bạn!`,rkLostD:(c,p)=>`Bạn tụt xuống hạng ${p} ở bảng ${c}. Giành lại nhé?`,rkGo:"Xem xếp hạng"});
Object.assign(L.th,{nf_streak:"แจ้งเตือนเช็กชื่อต่อเนื่อง",nf_rank:"แจ้งเตือนถูกแซงอันดับ",pStreak:n=>`🔥 เข้าต่อเนื่อง ${n} วันแล้ว! วันนี้ไม่ประทับตราสถิติจะขาด`,pStreak7:n=>`🔥 เข้าต่อเนื่อง ${n} วันแล้ว! ประทับตราวันนี้รับรางวัลวันที่ 7 🐟`,pRank:(s,p)=>`ร้าน '${s}' แซงคุณแล้ว! ตอนนี้อยู่อันดับ ${p} 📉 ไปทวงคืนกันไหม`,rkLost:s=>`ร้าน '${s}' แซงคุณแล้ว!`,rkLostD:(c,p)=>`อันดับ${c}ตกลงมาที่ ${p} ไปทวงคืนกันไหม`,rkGo:"ดูอันดับ"});
Object.assign(L.id,{nf_streak:"Notifikasi absensi beruntun",nf_rank:"Notifikasi disalip",pStreak:n=>`🔥 Absensi ${n} hari berturut-turut! Kalau hari ini tidak dicap, rekornya putus`,pStreak7:n=>`🔥 Absensi ${n} hari berturut-turut! Cap hari ini untuk hadiah hari ke-7 🐟`,pRank:(s,p)=>`'${s}' menyalipmu! Sekarang kamu peringkat ${p} 📉 Rebut kembali?`,rkLost:s=>`'${s}' menyalipmu!`,rkLostD:(c,p)=>`Kamu turun ke peringkat ${p} di ${c}. Rebut kembali?`,rkGo:"Lihat peringkat"});
Object.assign(L.ko,{advGo:'다음 단계 열기'});
Object.assign(L.en,{advGo:'Unlock next stage'});
Object.assign(L.zh,{advGo:'开启下一关'});
Object.assign(L.ja,{advGo:'次のステージを開く'});
Object.assign(L.ar,{advGo:'افتح المرحلة التالية'});
Object.assign(L.es,{advGo:'Abrir el siguiente nivel'});
Object.assign(L.vi,{advGo:'Mở màn tiếp theo'});
Object.assign(L.th,{advGo:'ปลดล็อกด่านถัดไป'});
Object.assign(L.id,{advGo:'Buka tahap berikutnya'});
Object.assign(L.ko,{bgm:'배경음악',bgmVol:'배경음악 볼륨'});
Object.assign(L.en,{bgm:'Music',bgmVol:'Music volume'});
Object.assign(L.zh,{bgm:'背景音乐',bgmVol:'背景音乐音量'});
Object.assign(L.ja,{bgm:'BGM',bgmVol:'BGM音量'});
Object.assign(L.ar,{bgm:'الموسيقى',bgmVol:'مستوى الموسيقى'});
Object.assign(L.es,{bgm:'Música',bgmVol:'Volumen de música'});
Object.assign(L.vi,{bgm:'Nhạc nền',bgmVol:'Âm lượng nhạc nền'});
Object.assign(L.th,{bgm:'เพลงพื้นหลัง',bgmVol:'ระดับเสียงเพลง'});
Object.assign(L.id,{bgm:'Musik latar',bgmVol:'Volume musik'});
Object.assign(L.ko,{goldOn:'✨ 황금붕어빵 등장! 모든 붕어빵이 바로 익었어요',goldGot:m=>`황금붕어빵 판매 +${m}`});
Object.assign(L.en,{goldOn:'✨ Golden bun! Every bun is done at once',goldGot:m=>`Golden bun sold +${m}`});
Object.assign(L.zh,{goldOn:'✨ 黄金鲷鱼烧出现！所有鲷鱼烧立刻烤好',goldGot:m=>`黄金鲷鱼烧售出 +${m}`});
Object.assign(L.ja,{goldOn:'✨ 黄金たい焼き登場！すべてすぐ焼き上がり',goldGot:m=>`黄金たい焼き販売 +${m}`});
Object.assign(L.ar,{goldOn:'✨ كعكة ذهبية! نضجت كل الكعكات فورًا',goldGot:m=>`بيع الكعكة الذهبية +${m}`});
Object.assign(L.es,{goldOn:'✨ ¡Pez dorado! Todos están listos al instante',goldGot:m=>`Pez dorado vendido +${m}`});
Object.assign(L.vi,{goldOn:'✨ Bánh vàng xuất hiện! Tất cả chín ngay',goldGot:m=>`Bán bánh vàng +${m}`});
Object.assign(L.th,{goldOn:'✨ ขนมปลาทองมาแล้ว! สุกทุกชิ้นทันที',goldGot:m=>`ขายขนมปลาทอง +${m}`});
Object.assign(L.id,{goldOn:'✨ Kue ikan emas! Semua langsung matang',goldGot:m=>`Kue ikan emas terjual +${m}`});
Object.assign(L.ko,{rkDel:'내 랭킹 기록 삭제',rkDelDone:'랭킹에서 내 기록을 삭제했어요'});
Object.assign(L.en,{rkDel:'Remove me from the ranking',rkDelDone:'Your ranking data was deleted'});
Object.assign(L.zh,{rkDel:'删除我的排名记录',rkDelDone:'已删除你的排名记录'});
Object.assign(L.ja,{rkDel:'ランキングの記録を削除',rkDelDone:'ランキングの記録を削除しました'});
Object.assign(L.ar,{rkDel:'حذف سجلي من التصنيف',rkDelDone:'تم حذف سجلك من التصنيف'});
Object.assign(L.es,{rkDel:'Borrar mis datos del ranking',rkDelDone:'Tus datos del ranking se borraron'});
Object.assign(L.vi,{rkDel:'Xóa dữ liệu của tôi khỏi bảng xếp hạng',rkDelDone:'Đã xóa dữ liệu xếp hạng của bạn'});
Object.assign(L.th,{rkDel:'ลบข้อมูลของฉันออกจากอันดับ',rkDelDone:'ลบข้อมูลอันดับของคุณแล้ว'});
Object.assign(L.id,{rkDel:'Hapus data saya dari peringkat',rkDelDone:'Data peringkat Anda telah dihapus'});

// ---------- login gate strings (js/auth.js) + ranking delete failure; other languages fall back to English ----------
Object.assign(L.ko,{authSub:'로그인하고 시작해요',authIn:n=>`${n}로 계속하기`,authGuest:'게스트로 시작',authSoon:'곧 지원돼요',authFail:'로그인에 실패했어요',guestAsk:'게스트로 시작할까요?',guestBody:'게스트 모드에서는 진행 기록이 저장되지 않아요. 계정에 보관되지 않아서 앱을 지우거나 기기를 바꾸면 사라져요.',authYes:'예',authNo:'아니오',rkDelFail:'삭제하지 못했어요. 인터넷을 확인하고 다시 눌러 주세요'});
Object.assign(L.en,{authSub:'Sign in to start',authIn:n=>`Continue with ${n}`,authGuest:'Play as guest',authSoon:'Coming soon',authFail:'Sign-in failed',guestAsk:'Start as a guest?',guestBody:'In guest mode your progress is not saved to an account. It is lost if you delete the app or change devices.',authYes:'Yes',authNo:'No',rkDelFail:'Could not delete. Check your connection and tap again'});
Object.assign(L.ja,{authSub:'ログインして始めよう',authIn:n=>`${n}で続ける`,authGuest:'ゲストで始める',authSoon:'近日対応予定です',authFail:'ログインに失敗しました',guestAsk:'ゲストで始めますか?',guestBody:'ゲストモードでは進行状況がアカウントに保存されません。アプリを削除したり機種変更すると消えます。',authYes:'はい',authNo:'いいえ',rkDelFail:'削除できませんでした。通信を確認してもう一度押してください'});
Object.assign(L.zh,{authSub:'登录后开始',authIn:n=>`使用${n}继续`,authGuest:'以游客身份开始',authSoon:'即将支持',authFail:'登录失败',guestAsk:'要以游客身份开始吗?',guestBody:'游客模式下进度不会保存到账号。删除应用或更换设备后会丢失。',authYes:'是',authNo:'否',rkDelFail:'删除失败,请检查网络后再试'});
Object.assign(L.es,{authSub:'Inicia sesión para empezar',authIn:n=>`Continuar con ${n}`,authGuest:'Jugar como invitado',authSoon:'Próximamente',authFail:'Error al iniciar sesión',guestAsk:'¿Empezar como invitado?',guestBody:'En modo invitado tu progreso no se guarda en una cuenta. Se pierde si borras la app o cambias de dispositivo.',authYes:'Sí',authNo:'No',rkDelFail:'No se pudo borrar. Revisa tu conexión e inténtalo de nuevo'});

// ---------- purchase messages (js/iap.js); other languages fall back to English ----------
Object.assign(L.ko,{iapPending:'결제 승인을 기다리는 중이에요. 승인되면 자동으로 지급돼요',iapFail:'결제하지 못했어요. 잠시 뒤 다시 시도해 주세요'});
Object.assign(L.en,{iapPending:'Waiting for payment approval. It will be delivered automatically',iapFail:'Purchase failed. Please try again in a moment'});
Object.assign(L.ja,{iapPending:'決済の承認待ちです。承認されると自動で付与されます',iapFail:'購入できませんでした。しばらくしてからもう一度お試しください'});
Object.assign(L.zh,{iapPending:'正在等待付款确认,确认后会自动发放',iapFail:'购买失败,请稍后再试'});
Object.assign(L.es,{iapPending:'Esperando la aprobación del pago. Se entregará automáticamente',iapFail:'No se pudo completar la compra. Inténtalo de nuevo más tarde'});

// ---------- diamonds (💎): packs bought with real money, spent on boosters ----------
Object.assign(L.ko,{gemPack:n=>`다이아 ${n}개`,gemPackD:'게임에서 쓰는 다이아예요. 부스터와 특별 아이템을 살 수 있어요',gemGot:n=>`다이아 ${n}개를 받았어요!`,tGem:'다이아가 부족해요. 다이아를 충전해 주세요'});
Object.assign(L.en,{gemPack:n=>`${n} Diamonds`,gemPackD:'In-game diamonds for boosters and special items',gemGot:n=>`You got ${n} diamonds!`,tGem:'Not enough diamonds. Get more in the shop'});
Object.assign(L.ja,{gemPack:n=>`ダイヤ${n}個`,gemPackD:'ブースターや特別アイテムに使えるダイヤです',gemGot:n=>`ダイヤ${n}個を受け取りました!`,tGem:'ダイヤが足りません。ショップでチャージしてください'});
Object.assign(L.zh,{gemPack:n=>`钻石${n}个`,gemPackD:'游戏内钻石,可购买加速道具和特别物品',gemGot:n=>`获得了${n}颗钻石!`,tGem:'钻石不足,请先充值'});
Object.assign(L.es,{gemPack:n=>`${n} diamantes`,gemPackD:'Diamantes del juego para potenciadores y objetos especiales',gemGot:n=>`¡Has recibido ${n} diamantes!`,tGem:'No tienes suficientes diamantes. Consigue más en la tienda'});

// ---------- diamond purchase confirmation + payment-not-open notice ----------
Object.assign(L.ko,{gemAsk:(n,left)=>`다이아 ${n}개를 사용해서 구매할까요? 구매 후 남는 다이아: ${left}개`,payNA:'이 버전에서는 다이아 결제를 아직 열지 않았어요. 구글 플레이 앱에서 충전할 수 있어요'});
Object.assign(L.en,{gemAsk:(n,left)=>`Spend ${n} diamonds on this? Diamonds left after buying: ${left}`,payNA:'Diamond payment is not open in this version yet. You can top up in the Google Play app'});
Object.assign(L.ja,{gemAsk:(n,left)=>`ダイヤ${n}個を使って購入しますか?購入後の残りダイヤ:${left}個`,payNA:'このバージョンではダイヤの決済はまだ開いていません。Google Playのアプリでチャージできます'});
Object.assign(L.zh,{gemAsk:(n,left)=>`要花费${n}颗钻石购买吗?购买后剩余钻石:${left}颗`,payNA:'此版本暂未开放钻石支付。可以在Google Play应用中充值'});
Object.assign(L.es,{gemAsk:(n,left)=>`¿Gastar ${n} diamantes en esto? Diamantes restantes: ${left}`,payNA:'El pago de diamantes aún no está abierto en esta versión. Puedes recargar en la app de Google Play'});
Object.assign(L.ko,{payGo:'결제하기'});Object.assign(L.en,{payGo:'Pay'});Object.assign(L.ja,{payGo:'決済する'});Object.assign(L.zh,{payGo:'支付'});Object.assign(L.es,{payGo:'Pagar'});
