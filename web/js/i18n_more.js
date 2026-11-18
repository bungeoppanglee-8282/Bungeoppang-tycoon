// ---------- extra languages: Chinese (Simplified), Japanese, Arabic, Spanish ----------
// Missing keys fall back to English (see t() in game.js).
const LANGS=[['ko','한국어'],['en','English'],['zh','简体中文'],['ja','日本語'],['ar','العربية'],['es','Español']];
Object.assign(L.ko,{cover:'덮기',blop:'뽁!',kpBatter:'반죽',pickLang:'언어를 선택하세요',ok:'확인'});
Object.assign(L.en,{cover:'Cover',blop:'blop!',kpBatter:'batter',pickLang:'Choose your language',ok:'OK'});

L.zh={
  title:'鲷鱼烧大亨', stage:'关卡', stageN:n=>`第${n}关`, goal:'目标', start:'开始！', shop:'商店', map:'地图', pause:'暂停',
  resume:'继续', retry:'重试', next:'下一关', close:'关闭', owned:'已拥有', max:'满级', locked:'未解锁', wallet:'现金',
  day:'白天', night:'夜晚', sound:'声音', on:'开', off:'关', language:'语言', skin:'外观', modern:'现代', retro:'复古手机',
  season:'季节预览', auto:'自动', reset:'重新开始', resetQ:'清除所有进度并重新开始吗？', yes:'是的，清除', cancel:'取消',
  b_plain:'原味面糊', b_straw:'草莓', b_choco:'巧克力', b_ev:'季节面糊',
  f_red:'红豆', f_cream:'奶油', f_pizza:'披萨', f_dubai:'迪拜',
  ev_spring:'樱花鲷鱼烧', ev_summer:'冰淇淋鲷鱼烧', ev_autumn:'红薯鲷鱼烧', ev_winter:'雪花芝士鲷鱼烧',
  s_spring:'春', s_summer:'夏', s_autumn:'秋', s_winter:'冬',
  m_white:'牛奶', m_straw:'草莓牛奶', m_choco:'巧克力牛奶', milk:'牛奶', mini:'迷你鲷鱼烧', calm:'安抚',
  kid:'小朋友', family:'家庭', student:'学生', grandma:'奶奶', grandpa:'爷爷', worker:'上班族', gent:'时髦大叔', bully:'不良少年', jerk:'难缠客人',
  pack:'12个装', wantsMini:'要迷你的！',
  h_batter:'点击面糊桶，把面糊倒进模具', h_fill:'点击馅料桶放入馅料', h_cover:'点击模具，用面糊盖上', h_wait:'等蓝色火焰计时器填满',
  h_flip:'绿灯！点击翻面', h_take:'烤好了！点击放到盘子上', h_serve:'点击盘子递给客人', h_red:'红色表示快烤焦了！快点！',
  tFull:'盘子满了', tNoOne:'没有客人在等这个', tNoSlot:'没有空模具', tNoP1:'还没有倒面糊的模具',
  tCash:'现金不足', tBought:'购买成功！', tRun:n=>`没付钱就跑了！-${n}`, tLeft:n=>`${n}生气地走了`,
  tCat:'猫偷走了一个鲷鱼烧！', tShoo:'赶走了猫！', tClean:`清理碎屑 +₩${CRUMB_BONUS}`, tCalm:'用迷你鲷鱼烧安抚了客人',
  tNoMini:'没有迷你鲷鱼烧', tCups:'没有放杯子的位置了', tOpen:'开业活动！送你 ₩20,000 启动资金',
  tBurnt:'扔掉了烤焦的鲷鱼烧', tAngry:'没有需要安抚的客人', tDuring:'关卡结束后才能购物',
  clear:'过关！', fail:'差一点！', failSub:'没有达到目标金额', earned:'今日收入', starBonus:'新星星奖励',
  st1:g=>`赚取 ${g}`, st3:g=>`赚取 ${g}（150%）`, cont:'看广告 +30秒', toMap:'地图',
  mi_noBurn:'不烤焦任何鲷鱼烧', mi_noLeave:'不让客人生气离开', mi_serve:n=>`接待 ${n} 位客人`, mi_drinks:'卖出3杯牛奶',
  mi_minis:'用迷你鲷鱼烧安抚2次', mi_special:'卖出3个草莓/巧克力鲷鱼烧', mi_event:'卖出3个季节鲷鱼烧',
  boosters:'道具（看广告免费）', bo_mini:'5个迷你鲷鱼烧', bo_miniD:'立即安抚生气的客人', bo_spatula:'黄金锅铲', bo_spatulaD:'本关烤制快30%',
  bo_stool:'吧台椅', bo_stoolD:'客人坐着等 · 耐心+25%', bo_stove:'暖炉', bo_stoveD:'客人多等30%', watchAd:'看广告', got:'已获得 ✓', adTitle:'广告（测试画面）', adSub:'正式版会在这里播放广告',
  tabKitchen:'厨房', tabBatter:'面糊', tabDrink:'饮料', tabDeco:'装饰', tabStore:'摊位',
  i_row:n=>`模具一排（${n}/${MAX_ROWS}）`, i_rowD:'增加3个模具', i_gas:n=>`燃气灶 ${n}级`, i_gasD:(a,b)=>`每面 ${a}秒 → ${b}秒`,
  i_plate:n=>`盘子（${n}/${PLATES_MAX}）`, i_plateD:'能多放一些鲷鱼烧', i_mini:'迷你鲷鱼烧模具', i_miniD:'一次5个！安抚生气的客人',
  i_straw:'草莓面糊', i_strawD:'每个 +₩200，草莓爱好者会来', i_choco:'巧克力面糊', i_chocoD:`第${CHOCO_STAGE}关免费解锁 · 每个 +₩200`,
  i_milk:'牛奶机（原味）', i_milkD:'也能卖饮料', i_mstraw:'草莓牛奶', i_mchoco:'巧克力牛奶', i_mD:p=>`每杯 ${p}`,
  needStage:n=>`第${n}关开放`, needMilk:'需要先买牛奶机',
  awning:'条纹遮阳棚', cloth:'格子柜台布', flower:'花盆', lantern:'黄铜灯笼', sign:'木招牌', lights:'串灯',
  addP:n=>`每个 +₩${n}`, flowerD:'老人多等20%', lightsD:'夜晚客人 +25%',
  cctv:'监控券', cctvD:'逃单几率 35% → 8%', truck:'不锈钢餐车', truckD:'每个 +₩300 · 4位客人 · 难缠客人减少 · 迪拜鲷鱼烧',
  ms_pizza:'披萨鲷鱼烧 + 学生', ms_mini:'迷你模具（商店）', ms_choco:'巧克力面糊免费', ms_elder:'奶奶和爷爷', ms_milk:'牛奶机（商店）', ms_worker:'夜间12个装', ms_gent:'时髦大叔', ms_bully:'小心不良少年', ms_jerk:'难缠客人出现',
  ms_kinds3:'一单3种口味', ms_group:'家庭团购', ms_lunch:'午餐高峰（耐心↓）', ms_dubai:'迪拜开心果', ms_rush:'高峰时段（客人↑）', ms_four:'同时4位客人',
  msd_pizza:'解锁披萨馅，爱吃披萨的学生会来', msd_mini:'在商店买模具就能安抚生气的客人', msd_choco:'免费使用巧克力面糊 · 每个 +₩200', msd_elder:'喜欢红豆，也更有耐心',
  msd_milk:'买了牛奶机就能卖饮料', msd_worker:'晚上一次买12个红豆鲷鱼烧', msd_gent:'每次买2~4个', msd_bully:'可能不付钱就跑 · 用监控防止',
  msd_jerk:'一定要给迷你鲷鱼烧', msd_kinds3:'一单最多3种口味', msd_group:'家庭客人多买3个', msd_lunch:'客人耐心减少10%', msd_dubai:'不用餐车也能用迪拜馅 · 3倍价格',
  msd_rush:'客人来得多15%', msd_four:'柜台最多4位客人', todayMission:'今日任务', newToday:'本关新解锁！',
  unlockT:'解锁了新内容！', winT:'餐车开张！', winP:'你拥有了不锈钢餐车！迪拜开心果鲷鱼烧上架了。',
  intro:'把鲷鱼烧小摊做成不锈钢餐车！每关达到目标金额就能得到星星。',
  key:'键盘：1-9 模具 · * 面糊 · 0 上餐 · # 安抚',
  evs_spring:'樱花', evs_summer:'冰淇淋', evs_autumn:'红薯', evs_winter:'雪花芝士',
  evTitle:s=>`${s}季活动`, evPay:'收入翻倍！', evIntro:n=>`限时！卖出${n}，收入翻倍。`, evHow:f=>`季节面糊 + ${f}馅`,
  needFree:n=>`第${n}关免费`, turnHead:'在鱼头掉头！',
  prep:'准备', prepIntro:'开店前准备材料，赚点零花钱！', play:'开始',
  mg_bean:'煮红豆', mg_beanD:'用铲子一圈圈搅拌，红豆咕嘟咕嘟煮熟', mg_dough:'搅面糊', mg_doughD:'把面粉疙瘩全部搅开',
  prepLeft:(n,m)=>`剩余 ${n} / ${m}（过关恢复1次）`, prepEmpty:'今天的准备结束了！过关后可以再玩',
  mgHelp:'用手指在锅里快速画圈搅拌！', mgTurns:'圈', mgBonus:(n,m)=>`${n}圈奖励 ${m}`, mgDone:'准备完成！', mgTurnsN:n=>`搅了${n}圈`, mgBonusGot:m=>`完美！奖励 +${m}`,
  xpWhy:'卖出时获得与收入相同的经验值。完美出炉、清理、安抚和准备还会额外获得。升级可恢复1次准备！', xpHave:'可兑换的经验值', xpRule:'3 经验 = ₩1',
  xpAll:w=>`全部兑换（+${w}）`, xpSome:(x,w)=>`${x} 经验 → ${w}`, xpNone:'经验值不够兑换', xpDone:w=>`兑换了 ${w}！`, lvUp:l=>`升级！Lv.${l} · 准备 +1`, perfect:'完美！',
  churu:'猫条', churu10:'猫条10支装', churuD:n=>`猫会吃猫条，不偷鲷鱼烧 · 拥有 ${n}`, tChuru:'猫吃了猫条走了 😺',
  done:'完成', nextUp:'下一关！', stageRange:(a,b)=>`第${a}-${b}关`, burnerLv:n=>`炉子 ${n}级`, xpMult:m=>`经验 ×${m}`,
  coachNext:'下一步', coachGo:'开始吧！',
  c0:'欢迎，老板！烤出客人想要的鲷鱼烧卖给他们。我们一起做一个吧。',
  c1:'① 点击面糊桶，把面糊倒进模具。', c2:'② 这位客人要红豆。点击红豆桶放入馅料。', c3:'③ 点击模具用面糊盖上，火点着了！',
  c4:'等蓝色火焰计时器填满。', c5:'④ 绿灯！点击模具翻面。', c6:'⑤ 烤好了！点击模具放到盘子上。',
  c7:'⑥ 点击盘子递给等待的客人。', c8:'做得好！变红就会烤焦，要快一点。现在自己试试吧。',
  cover:'盖上', blop:'咕嘟！', kpBatter:'面糊', pickLang:'请选择语言', ok:'确定',
};

L.ja={
  title:'たい焼きタイクーン', stage:'ステージ', stageN:n=>`ステージ${n}`, goal:'目標', start:'スタート！', shop:'ショップ', map:'マップ', pause:'一時停止',
  resume:'つづける', retry:'もう一度', next:'次のステージ', close:'閉じる', owned:'所持中', max:'最大', locked:'ロック中', wallet:'所持金',
  day:'昼', night:'夜', sound:'サウンド', on:'オン', off:'オフ', language:'言語', skin:'画面', modern:'モダン', retro:'ガラケー',
  season:'季節プレビュー', auto:'自動', reset:'最初から', resetQ:'進行状況をすべて消して最初からやり直しますか？', yes:'はい、消します', cancel:'キャンセル',
  b_plain:'プレーン生地', b_straw:'いちご', b_choco:'チョコ', b_ev:'季節の生地',
  f_red:'あんこ', f_cream:'カスタード', f_pizza:'ピザ', f_dubai:'ドバイ',
  ev_spring:'桜たい焼き', ev_summer:'アイスたい焼き', ev_autumn:'さつまいもたい焼き', ev_winter:'雪チーズたい焼き',
  s_spring:'春', s_summer:'夏', s_autumn:'秋', s_winter:'冬',
  m_white:'牛乳', m_straw:'いちごミルク', m_choco:'チョコミルク', milk:'ミルク', mini:'ミニたい焼き', calm:'なだめる',
  kid:'こども', family:'家族', student:'学生', grandma:'おばあちゃん', grandpa:'おじいちゃん', worker:'会社員', gent:'おしゃれおじさん', bully:'不良', jerk:'困ったお客',
  pack:'12個入り', wantsMini:'ミニちょうだい！',
  h_batter:'生地の入れ物をタップして型に流しこもう', h_fill:'具の入れ物をタップして具を入れよう', h_cover:'型をタップして生地でふたをしよう', h_wait:'青い火のタイマーがたまるまで待とう',
  h_flip:'緑になった！タップしてひっくり返そう', h_take:'焼けた！タップしてお皿へ', h_serve:'お皿をタップしてお客さんに渡そう', h_red:'赤は焦げる合図！急いでタップ',
  tFull:'お皿がいっぱい', tNoOne:'それを待っているお客さんはいません', tNoSlot:'空いている型がありません', tNoP1:'生地を入れた型がまだありません',
  tCash:'お金が足りません', tBought:'購入しました！', tRun:n=>`お金を払わずに逃げた！ -${n}`, tLeft:n=>`${n}が怒って帰りました`,
  tCat:'猫がたい焼きを盗んだ！', tShoo:'猫を追い払った！', tClean:`くず掃除 +₩${CRUMB_BONUS}`, tCalm:'ミニたい焼きでなだめました',
  tNoMini:'ミニたい焼きがありません', tCups:'カップを置く場所がありません', tOpen:'オープン記念！開店資金 ₩20,000 をプレゼント',
  tBurnt:'焦げたたい焼きを捨てました', tAngry:'なだめるお客さんがいません', tDuring:'ステージ終了後に買えます',
  clear:'ステージクリア！', fail:'おしい！', failSub:'目標金額に届きませんでした', earned:'今日の売上', starBonus:'新しい星のボーナス',
  st1:g=>`${g} 稼ぐ`, st3:g=>`${g} 稼ぐ（150%）`, cont:'広告を見て +30秒', toMap:'マップ',
  mi_noBurn:'焦がさない', mi_noLeave:'怒って帰るお客さんを出さない', mi_serve:n=>`お客さん${n}人に対応`, mi_drinks:'ミルクを3杯売る',
  mi_minis:'ミニたい焼きで2回なだめる', mi_special:'いちご・チョコたい焼きを3個売る', mi_event:'季節のたい焼きを3個売る',
  boosters:'ブースター（広告で無料）', bo_mini:'ミニたい焼き5個', bo_miniD:'怒ったお客さんをすぐなだめる', bo_spatula:'金のへら', bo_spatulaD:'このステージは焼き30%速い',
  bo_stool:'バースツール', bo_stoolD:'座って待てる · 忍耐+25%', bo_stove:'あったかストーブ', bo_stoveD:'お客さんが30%長く待つ', watchAd:'広告を見る', got:'ゲット ✓', adTitle:'広告（テスト画面）', adSub:'本番アプリではここで広告が流れます',
  tabKitchen:'キッチン', tabBatter:'生地', tabDrink:'ドリンク', tabDeco:'飾り', tabStore:'屋台',
  i_row:n=>`型1列（${n}/${MAX_ROWS}）`, i_rowD:'型が3つ増える', i_gas:n=>`ガスコンロ Lv${n}`, i_gasD:(a,b)=>`片面 ${a}秒 → ${b}秒`,
  i_plate:n=>`お皿（${n}/${PLATES_MAX}）`, i_plateD:'たい焼きをもっと置ける', i_mini:'ミニたい焼きの型', i_miniD:'一度に5個！怒ったお客さんをなだめる',
  i_straw:'いちご生地', i_strawD:'1個 +₩200、いちご好きが来る', i_choco:'チョコ生地', i_chocoD:`ステージ${CHOCO_STAGE}で無料解放 · 1個 +₩200`,
  i_milk:'ミルクマシン（牛乳）', i_milkD:'飲み物も売れる', i_mstraw:'いちごミルク', i_mchoco:'チョコミルク', i_mD:p=>`1杯 ${p}`,
  needStage:n=>`ステージ${n}から`, needMilk:'ミルクマシンが先',
  awning:'しましまのひさし', cloth:'チェックのカウンタークロス', flower:'花の鉢', lantern:'真ちゅうのランタン', sign:'木の看板', lights:'電球ガーランド',
  addP:n=>`1個 +₩${n}`, flowerD:'お年寄りが20%長く待つ', lightsD:'夜のお客さん +25%',
  cctv:'防犯カメラ券', cctvD:'逃げる確率 35% → 8%', truck:'ステンレスキッチンカー', truckD:'1個 +₩300 · お客さん4人 · 困ったお客減少 · ドバイたい焼き',
  ms_pizza:'ピザたい焼き + 学生', ms_mini:'ミニたい焼きの型（ショップ）', ms_choco:'チョコ生地無料', ms_elder:'おばあちゃん・おじいちゃん', ms_milk:'ミルクマシン（ショップ）', ms_worker:'夜の12個入り', ms_gent:'おしゃれおじさん', ms_bully:'不良に注意', ms_jerk:'困ったお客登場',
  ms_kinds3:'一度に3種類の注文', ms_group:'家族のまとめ買い', ms_lunch:'ランチラッシュ（忍耐↓）', ms_dubai:'ドバイピスタチオ', ms_rush:'ラッシュアワー（お客さん↑）', ms_four:'お客さん4人同時',
  msd_pizza:'ピザの具が解放され、ピザ好きの学生が来ます', msd_mini:'ショップで型を買うと怒ったお客さんをなだめられます', msd_choco:'チョコ生地が無料で使えます · 1個 +₩200', msd_elder:'あんこが好きで、長く待ってくれます',
  msd_milk:'ミルクマシンを買うと飲み物も売れます', msd_worker:'夜にあんこたい焼きを12個まとめて買います', msd_gent:'2〜4個ずつ注文します', msd_bully:'お金を払わず逃げることも · 防犯カメラで防ぐ',
  msd_jerk:'ミニたい焼きが必ず必要です', msd_kinds3:'注文に最大3種類', msd_group:'家族が3個多く注文します', msd_lunch:'お客さんの忍耐が10%減ります', msd_dubai:'キッチンカーなしでもドバイの具が使える · 3倍の値段',
  msd_rush:'お客さんが15%多く来ます', msd_four:'カウンターにお客さんが4人まで', todayMission:'今日のミッション', newToday:'このステージで新登場！',
  unlockT:'新しいものが解放されました！', winT:'キッチンカー開店！', winP:'ステンレスキッチンカーを手に入れた！ドバイピスタチオたい焼きが登場。',
  intro:'たい焼き屋台をステンレスキッチンカーまで育てよう！各ステージの目標金額を稼ぐと星がもらえます。',
  key:'キー：1-9 型 · * 生地 · 0 提供 · # なだめる',
  evs_spring:'桜', evs_summer:'アイス', evs_autumn:'さつまいも', evs_winter:'雪チーズ',
  evTitle:s=>`${s}のイベント`, evPay:'報酬2倍！', evIntro:n=>`期間限定！${n}を売ると稼ぎが2倍に。`, evHow:f=>`季節の生地 + ${f}の具`,
  needFree:n=>`ステージ${n}で無料`, turnHead:'頭で折り返し！',
  prep:'仕込み', prepIntro:'開店前に材料を仕込んで、おこづかいを稼ごう！', play:'スタート',
  mg_bean:'あんこを煮る', mg_beanD:'へらでぐるぐる！あんこがぐつぐつ煮える', mg_dough:'生地を混ぜる', mg_doughD:'粉のダマを全部なくそう',
  prepLeft:(n,m)=>`残り ${n} / ${m}（クリアで1回回復）`, prepEmpty:'今日の仕込みは終わり！ステージをクリアするとまた遊べます',
  mgHelp:'指で鍋の中をぐるぐる速く混ぜよう！', mgTurns:'周', mgBonus:(n,m)=>`${n}周でボーナス ${m}`, mgDone:'仕込み完了！', mgTurnsN:n=>`${n}周混ぜました`, mgBonusGot:m=>`完璧！ボーナス +${m}`,
  xpWhy:'売上と同じだけ経験値がたまります。完璧な取り出し、掃除、なだめ、仕込みでもっとたまります。レベルアップで仕込み1回回復！', xpHave:'交換できる経験値', xpRule:'経験値3 = ₩1',
  xpAll:w=>`全部お金に換える（+${w}）`, xpSome:(x,w)=>`${x} XP → ${w}`, xpNone:'交換できる経験値が足りません', xpDone:w=>`${w} に交換しました！`, lvUp:l=>`レベルアップ！Lv.${l} · 仕込み +1`, perfect:'完璧！',
  churu:'猫のおやつ', churu10:'おやつ10本セット', churuD:n=>`猫がたい焼きの代わりにおやつを食べる · 所持 ${n}`, tChuru:'猫がおやつを食べて帰りました 😺',
  done:'完了', nextUp:'次！', stageRange:(a,b)=>`ステージ${a}〜${b}`, burnerLv:n=>`バーナー Lv${n}`, xpMult:m=>`経験値 ×${m}`,
  coachNext:'次へ', coachGo:'はじめよう！',
  c0:'ようこそ、店長！お客さんが欲しいたい焼きを焼いて売りましょう。一緒にやってみよう。',
  c1:'① 生地の入れ物をタップして、型に生地を流しこもう。', c2:'② このお客さんはあんこが欲しい。あんこの入れ物をタップして具を入れよう。', c3:'③ 型をタップして生地でふた。火がつくよ！',
  c4:'青い火のタイマーがたまるまで待とう。', c5:'④ 緑になった！型をタップしてひっくり返そう。', c6:'⑤ 焼けた！型をタップしてお皿へ。',
  c7:'⑥ お皿をタップして、待っているお客さんに渡そう。', c8:'よくできました！赤くなると焦げるので急いでね。さあ、自分でやってみよう。',
  cover:'ふた', blop:'ぽこっ！', kpBatter:'生地', pickLang:'言語を選んでください', ok:'OK',
};

L.ar={
  title:'إمبراطور البونغوبانغ', stage:'المرحلة', stageN:n=>`المرحلة ${n}`, goal:'الهدف', start:'ابدأ!', shop:'المتجر', map:'الخريطة', pause:'إيقاف مؤقت',
  resume:'متابعة', retry:'أعد المحاولة', next:'المرحلة التالية', close:'إغلاق', owned:'مملوك', max:'الحد الأقصى', locked:'مقفل', wallet:'النقود',
  day:'نهار', night:'ليل', sound:'الصوت', on:'تشغيل', off:'إيقاف', language:'اللغة', skin:'المظهر', modern:'حديث', retro:'هاتف كلاسيكي',
  season:'معاينة الموسم', auto:'تلقائي', reset:'من البداية', resetQ:'هل تريد مسح كل التقدم والبدء من جديد؟', yes:'نعم، امسح', cancel:'إلغاء',
  b_plain:'عجينة عادية', b_straw:'فراولة', b_choco:'شوكولاتة', b_ev:'عجينة الموسم',
  f_red:'فاصوليا حمراء', f_cream:'كاسترد', f_pizza:'بيتزا', f_dubai:'دبي',
  ev_spring:'كعكة زهر الكرز', ev_summer:'كعكة الآيس كريم', ev_autumn:'كعكة البطاطا الحلوة', ev_winter:'كعكة جبن الثلج',
  s_spring:'الربيع', s_summer:'الصيف', s_autumn:'الخريف', s_winter:'الشتاء',
  m_white:'حليب', m_straw:'حليب بالفراولة', m_choco:'حليب بالشوكولاتة', milk:'حليب', mini:'كعكات صغيرة', calm:'تهدئة',
  kid:'طفل', family:'عائلة', student:'طالبة', grandma:'جدة', grandpa:'جد', worker:'موظف', gent:'رجل أنيق', bully:'طالب مشاغب', jerk:'زبون مزعج',
  pack:'علبة 12', wantsMini:'صغيرة من فضلك!',
  h_batter:'اضغط على وعاء العجين لصبه في القالب', h_fill:'اضغط على وعاء الحشوة لإضافتها', h_cover:'اضغط على القالب لتغطيته بالعجين', h_wait:'انتظر حتى يمتلئ مؤقت النار الأزرق',
  h_flip:'أخضر! اضغط لقلبها', h_take:'جاهزة! اضغط لنقلها إلى الطبق', h_serve:'اضغط على الطبق لتقديمها للزبون', h_red:'الأحمر يعني أنها ستحترق! اضغط الآن',
  tFull:'الأطباق ممتلئة', tNoOne:'لا أحد ينتظر هذا', tNoSlot:'لا يوجد قالب فارغ', tNoP1:'لا يوجد قالب فيه عجين بعد',
  tCash:'النقود لا تكفي', tBought:'تم الشراء!', tRun:n=>`هرب دون أن يدفع! -${n}`, tLeft:n=>`${n} غادر غاضبًا`,
  tCat:'قطة سرقت كعكة!', tShoo:'طردت القطة!', tClean:`تنظيف الفتات +₩${CRUMB_BONUS}`, tCalm:'هدّأته بكعكة صغيرة',
  tNoMini:'لا توجد كعكات صغيرة', tCups:'لا مكان لكوب آخر', tOpen:'افتتاح كبير! إليك ₩20,000 لتبدأ',
  tBurnt:'رميت كعكة محترقة', tAngry:'لا يوجد زبون غاضب لتهدئته', tDuring:'يمكنك التسوق بعد المرحلة',
  clear:'اجتزت المرحلة!', fail:'كدت تنجح!', failSub:'لم تصل إلى الهدف', earned:'أرباح اليوم', starBonus:'مكافأة نجمة جديدة',
  st1:g=>`اربح ${g}`, st3:g=>`اربح ${g} (150%)`, cont:'شاهد إعلانًا: +30 ثانية', toMap:'الخريطة',
  mi_noBurn:'بدون كعكات محترقة', mi_noLeave:'لا يغادر أي زبون غاضبًا', mi_serve:n=>`قدّم لـ ${n} زبائن`, mi_drinks:'بِع 3 أكواب حليب',
  mi_minis:'هدّئ زبونين بكعكات صغيرة', mi_special:'بِع 3 كعكات فراولة/شوكولاتة', mi_event:'بِع 3 كعكات موسمية',
  boosters:'معززات (مجانية مع إعلان)', bo_mini:'5 كعكات صغيرة', bo_miniD:'تهدئ الزبائن الغاضبين فورًا', bo_spatula:'المِلعقة الذهبية', bo_spatulaD:'خبز أسرع بـ 30% في هذه المرحلة',
  bo_stool:'كراسي البار', bo_stoolD:'يجلس الزبائن وينتظرون · صبر +25%', bo_stove:'مدفأة دافئة', bo_stoveD:'ينتظر الزبائن أطول بـ 30%', watchAd:'شاهد إعلانًا', got:'تم ✓', adTitle:'إعلان (شاشة تجريبية)', adSub:'في التطبيق الحقيقي يظهر إعلان هنا',
  tabKitchen:'المطبخ', tabBatter:'العجين', tabDrink:'المشروبات', tabDeco:'الزينة', tabStore:'الكشك',
  i_row:n=>`صف قوالب (${n}/${MAX_ROWS})`, i_rowD:'3 قوالب إضافية', i_gas:n=>`موقد غاز مستوى ${n}`, i_gasD:(a,b)=>`${a} ث ← ${b} ث لكل جانب`,
  i_plate:n=>`طبق تقديم (${n}/${PLATES_MAX})`, i_plateD:'جهّز كعكات أكثر', i_mini:'قالب الكعكات الصغيرة', i_miniD:'5 مرة واحدة! تهدئ الزبائن الغاضبين',
  i_straw:'عجينة الفراولة', i_strawD:'+₩200 لكل كعكة، يأتي محبو الفراولة', i_choco:'عجينة الشوكولاتة', i_chocoD:`مجانية في المرحلة ${CHOCO_STAGE} · +₩200 لكل كعكة`,
  i_milk:'آلة الحليب (عادي)', i_milkD:'بِع المشروبات أيضًا', i_mstraw:'حليب بالفراولة', i_mchoco:'حليب بالشوكولاتة', i_mD:p=>`${p} للكوب`,
  needStage:n=>`من المرحلة ${n}`, needMilk:'تحتاج آلة الحليب أولًا',
  awning:'مظلة مخططة', cloth:'مفرش طاولة مربعات', flower:'أصص زهور', lantern:'فانوس نحاسي', sign:'لافتة خشبية', lights:'سلسلة أضواء',
  addP:n=>`+₩${n} لكل كعكة`, flowerD:'كبار السن ينتظرون أطول بـ 20%', lightsD:'+25% زبائن الليل',
  cctv:'قسيمة كاميرا مراقبة', cctvD:'احتمال الهروب 35% ← 8%', truck:'شاحنة طعام من الستانلس', truckD:'+₩300 لكل كعكة · 4 زبائن · مزعجون أقل · كعكة دبي',
  ms_pizza:'كعكات بيتزا + طلاب', ms_mini:'قالب الكعكات الصغيرة (المتجر)', ms_choco:'عجينة شوكولاتة مجانية', ms_elder:'الجدة والجد', ms_milk:'آلة الحليب (المتجر)', ms_worker:'علب 12 ليلًا', ms_gent:'الرجل الأنيق', ms_bully:'احذر الطالب المشاغب', ms_jerk:'وصول الزبون المزعج',
  ms_kinds3:'3 أنواع في الطلب', ms_group:'طلبات عائلية كبيرة', ms_lunch:'زحمة الغداء (صبر أقل)', ms_dubai:'فستق دبي', ms_rush:'ساعة الذروة (زبائن أكثر)', ms_four:'4 زبائن معًا',
  msd_pizza:'تُفتح حشوة البيتزا ويأتي طلاب يحبونها', msd_mini:'اشترِ القالب لتهدئة الزبائن الغاضبين', msd_choco:'استخدم عجينة الشوكولاتة مجانًا · +₩200 لكل كعكة', msd_elder:'يحبون الفاصوليا الحمراء وينتظرون أطول',
  msd_milk:'اشترِ آلة الحليب لتبيع المشروبات', msd_worker:'ليلًا يشترون 12 كعكة فاصوليا مرة واحدة', msd_gent:'يطلب 2-4 كعكات كل مرة', msd_bully:'قد يهرب دون أن يدفع · الكاميرا تساعد',
  msd_jerk:'يجب أن يحصل على كعكة صغيرة', msd_kinds3:'قد يجمع الطلب حتى 3 أنواع', msd_group:'العائلات تطلب 3 إضافية', msd_lunch:'صبر الزبائن أقل بـ 10%', msd_dubai:'حشوة دبي بدون الشاحنة · السعر ×3',
  msd_rush:'يأتي الزبائن أكثر بـ 15%', msd_four:'حتى 4 زبائن عند المنضدة', todayMission:'مهمة اليوم', newToday:'جديد في هذه المرحلة!',
  unlockT:'فُتح شيء جديد!', winT:'افتُتحت شاحنة الطعام!', winP:'أصبحت تملك شاحنة طعام من الستانلس! كعكات فستق دبي في القائمة الآن.',
  intro:'طوّر كشك البونغوبانغ (كعكة على شكل سمكة) إلى شاحنة طعام. حقق هدف كل مرحلة لتجمع النجوم.',
  key:'الأزرار: 1-9 القوالب · * العجين · 0 التقديم · # التهدئة',
  evs_spring:'زهر الكرز', evs_summer:'آيس كريم', evs_autumn:'بطاطا حلوة', evs_winter:'جبن الثلج',
  evTitle:s=>`فعالية ${s}`, evPay:'أجر مضاعف!', evIntro:n=>`لفترة محدودة! بِع ${n} وتتضاعف أرباحك.`, evHow:f=>`عجينة الموسم + حشوة ${f}`,
  needFree:n=>`مجانًا في المرحلة ${n}`, turnHead:'استدر عند الرأس!',
  prep:'التحضير', prepIntro:'حضّر المكونات قبل الافتتاح واربح مصروفًا!', play:'العب',
  mg_bean:'سلق الفاصوليا الحمراء', mg_beanD:'حرّك بالملعقة في دوائر حتى تغلي', mg_dough:'خلط العجين', mg_doughD:'فكّك كل كتل الطحين',
  prepLeft:(n,m)=>`متبقٍ ${n} / ${m} (اجتياز مرحلة يضيف واحدة)`, prepEmpty:'انتهى التحضير لليوم. اجتز مرحلة لتلعب مجددًا',
  mgHelp:'حرّك بسرعة في دوائر داخل القدر بإصبعك!', mgTurns:'دورات', mgBonus:(n,m)=>`${n} دورة = مكافأة ${m}`, mgDone:'اكتمل التحضير!', mgTurnsN:n=>`حرّكت ${n} دورة`, mgBonusGot:m=>`ممتاز! مكافأة +${m}`,
  xpWhy:'كل بيع يمنحك خبرة تساوي ما تربحه. الإخراج المثالي والتنظيف والتهدئة والتحضير تمنح المزيد. ارتقِ مستوى لتستعيد تحضيرًا واحدًا!', xpHave:'خبرة يمكنك صرفها', xpRule:'3 خبرة = ₩1',
  xpAll:w=>`اصرف الكل (+${w})`, xpSome:(x,w)=>`${x} خبرة ← ${w}`, xpNone:'الخبرة لا تكفي للصرف', xpDone:w=>`صرفت ${w}!`, lvUp:l=>`ارتقيت! المستوى ${l} · تحضير +1`, perfect:'مثالي!',
  churu:'حلوى القطط', churu10:'علبة 10 حلوى قطط', churuD:n=>`تأكل القطة الحلوى بدلًا من الكعكة · لديك ${n}`, tChuru:'أكلت القطة الحلوى وذهبت 😺',
  done:'تم', nextUp:'التالي!', stageRange:(a,b)=>`المراحل ${a}-${b}`, burnerLv:n=>`الموقد مستوى ${n}`, xpMult:m=>`خبرة ×${m}`,
  coachNext:'التالي', coachGo:'هيا بنا!',
  c0:'أهلًا يا معلم! اخبز البونغوبانغ الذي يريده الزبائن وبِعه. لنصنع واحدة معًا.',
  c1:'① اضغط على وعاء العجين لتصبه في القالب.', c2:'② هذا الزبون يريد فاصوليا حمراء. اضغط على وعائها لإضافة الحشوة.', c3:'③ اضغط على القالب لتغطيته بالعجين. النار تشتعل!',
  c4:'انتظر حتى يمتلئ مؤقت النار الأزرق.', c5:'④ ضوء أخضر! اضغط على القالب لتقلبها.', c6:'⑤ جاهزة! اضغط على القالب لنقلها إلى الطبق.',
  c7:'⑥ اضغط على الطبق لتقدمها للزبون المنتظر.', c8:'أحسنت! الأحمر يعني الاحتراق، فكن سريعًا. جرّب الآن بنفسك.',
  cover:'تغطية', blop:'بلوب!', kpBatter:'عجين', pickLang:'اختر لغتك', ok:'موافق',
};

L.es={
  title:'Bungeoppang Tycoon', stage:'Nivel', stageN:n=>`Nivel ${n}`, goal:'Meta', start:'¡Empezar!', shop:'Tienda', map:'Mapa', pause:'Pausa',
  resume:'Continuar', retry:'Reintentar', next:'Siguiente nivel', close:'Cerrar', owned:'Comprado', max:'Máximo', locked:'Bloqueado', wallet:'Dinero',
  day:'Día', night:'Noche', sound:'Sonido', on:'sí', off:'no', language:'Idioma', skin:'Estilo', modern:'Moderno', retro:'Móvil retro',
  season:'Vista de temporada', auto:'Auto', reset:'Empezar de nuevo', resetQ:'¿Borrar todo el progreso y empezar de nuevo?', yes:'Sí, borrar', cancel:'Cancelar',
  b_plain:'Masa normal', b_straw:'Fresa', b_choco:'Chocolate', b_ev:'Masa de temporada',
  f_red:'Judía roja', f_cream:'Crema', f_pizza:'Pizza', f_dubai:'Dubái',
  ev_spring:'Pez de cerezo', ev_summer:'Pez helado', ev_autumn:'Pez de boniato', ev_winter:'Pez de queso nevado',
  s_spring:'Primavera', s_summer:'Verano', s_autumn:'Otoño', s_winter:'Invierno',
  m_white:'Leche', m_straw:'Leche de fresa', m_choco:'Leche de chocolate', milk:'Leche', mini:'Minipeces', calm:'Calmar',
  kid:'Niño', family:'Familia', student:'Estudiante', grandma:'Abuela', grandpa:'Abuelo', worker:'Oficinista', gent:'Señor elegante', bully:'Gamberro', jerk:'Cliente pesado',
  pack:'Pack de 12', wantsMini:'¡Uno mini!',
  h_batter:'Toca un bote de masa para verterla en un molde', h_fill:'Toca un bote de relleno para añadirlo', h_cover:'Toca el molde para taparlo con masa', h_wait:'Espera a que se llene el temporizador azul',
  h_flip:'¡Verde! Toca para darle la vuelta', h_take:'¡Listo! Toca para ponerlo en un plato', h_serve:'Toca el plato para dárselo al cliente', h_red:'¡Rojo es que se quema! Toca ya',
  tFull:'Los platos están llenos', tNoOne:'Nadie está esperando eso', tNoSlot:'No hay moldes libres', tNoP1:'Aún no hay moldes con masa',
  tCash:'No tienes suficiente dinero', tBought:'¡Comprado!', tRun:n=>`¡Se fue sin pagar! -${n}`, tLeft:n=>`${n} se fue enfadado`,
  tCat:'¡Un gato robó un pez!', tShoo:'¡Gato espantado!', tClean:`Migas limpias +₩${CRUMB_BONUS}`, tCalm:'Calmado con un minipez',
  tNoMini:'No hay minipeces', tCups:'No caben más vasos', tOpen:'¡Gran apertura! Toma ₩20,000 para empezar',
  tBurnt:'Tiraste un pez quemado', tAngry:'No hay clientes enfadados', tDuring:'Puedes comprar al terminar el nivel',
  clear:'¡NIVEL SUPERADO!', fail:'¡Casi!', failSub:'No llegaste a la meta', earned:'Ganado hoy', starBonus:'Premio por estrella nueva',
  st1:g=>`Gana ${g}`, st3:g=>`Gana ${g} (150%)`, cont:'Ver anuncio: +30 s', toMap:'Mapa',
  mi_noBurn:'Sin peces quemados', mi_noLeave:'Ningún cliente se va enfadado', mi_serve:n=>`Atiende a ${n} clientes`, mi_drinks:'Vende 3 leches',
  mi_minis:'Calma a 2 clientes con minipeces', mi_special:'Vende 3 peces de fresa/chocolate', mi_event:'Vende 3 peces de temporada',
  boosters:'Potenciadores (gratis con anuncio)', bo_mini:'5 minipeces', bo_miniD:'Calman al instante a los enfadados', bo_spatula:'Espátula dorada', bo_spatulaD:'Cocinas un 30% más rápido en este nivel',
  bo_stool:'Taburetes altos', bo_stoolD:'Los clientes esperan sentados · +25% paciencia', bo_stove:'Estufa', bo_stoveD:'Los clientes esperan un 30% más', watchAd:'Ver anuncio', got:'¡Listo! ✓', adTitle:'Anuncio (pantalla de prueba)', adSub:'En la app real aquí sale un anuncio',
  tabKitchen:'Cocina', tabBatter:'Masa', tabDrink:'Bebidas', tabDeco:'Decoración', tabStore:'Puesto',
  i_row:n=>`Fila de moldes (${n}/${MAX_ROWS})`, i_rowD:'3 moldes más', i_gas:n=>`Fogón nivel ${n}`, i_gasD:(a,b)=>`${a} s → ${b} s por lado`,
  i_plate:n=>`Plato (${n}/${PLATES_MAX})`, i_plateD:'Ten más peces listos', i_mini:'Molde de minipeces', i_miniD:'¡5 de golpe! Calman a los enfadados',
  i_straw:'Masa de fresa', i_strawD:'+₩200 por pez, vienen fans de la fresa', i_choco:'Masa de chocolate', i_chocoD:`Gratis en el nivel ${CHOCO_STAGE} · +₩200 por pez`,
  i_milk:'Máquina de leche (normal)', i_milkD:'Vende bebidas también', i_mstraw:'Leche de fresa', i_mchoco:'Leche de chocolate', i_mD:p=>`${p} el vaso`,
  needStage:n=>`Desde el nivel ${n}`, needMilk:'Necesita la máquina de leche',
  awning:'Toldo de rayas', cloth:'Mantel de cuadros', flower:'Macetas', lantern:'Farol de latón', sign:'Letrero de madera', lights:'Guirnalda de luces',
  addP:n=>`+₩${n} por pez`, flowerD:'Los mayores esperan un 20% más', lightsD:'+25% clientes de noche',
  cctv:'Vale de cámara', cctvD:'Probabilidad de fuga 35% → 8%', truck:'Food truck de acero', truckD:'+₩300 por pez · 4 clientes · menos pesados · pez de Dubái',
  ms_pizza:'Peces de pizza + estudiantes', ms_mini:'Molde de minipeces (tienda)', ms_choco:'Masa de chocolate gratis', ms_elder:'Abuela y abuelo', ms_milk:'Máquina de leche (tienda)', ms_worker:'Packs de 12 por la noche', ms_gent:'Señor elegante', ms_bully:'Cuidado con los gamberros', ms_jerk:'Llegan los clientes pesados',
  ms_kinds3:'3 tipos por pedido', ms_group:'Pedidos familiares', ms_lunch:'Hora de comer (menos paciencia)', ms_dubai:'Pistacho de Dubái', ms_rush:'Hora punta (más clientes)', ms_four:'4 clientes a la vez',
  msd_pizza:'Se abre el relleno de pizza y vienen estudiantes que la adoran', msd_mini:'Compra el molde para calmar a los enfadados', msd_choco:'Usa masa de chocolate gratis · +₩200 por pez', msd_elder:'Les encanta la judía roja y esperan más',
  msd_milk:'Compra la máquina de leche para vender bebidas', msd_worker:'De noche compran 12 peces de judía roja de una vez', msd_gent:'Pide de 2 a 4 peces', msd_bully:'Puede irse sin pagar · la cámara ayuda',
  msd_jerk:'Necesita un minipez sí o sí', msd_kinds3:'Los pedidos mezclan hasta 3 tipos', msd_group:'Las familias piden 3 más', msd_lunch:'Los clientes tienen un 10% menos de paciencia', msd_dubai:'Relleno de Dubái sin el food truck · precio ×3',
  msd_rush:'Llegan un 15% más de clientes', msd_four:'Hasta 4 clientes en el mostrador', todayMission:'Misión de hoy', newToday:'¡Nuevo en este nivel!',
  unlockT:'¡Algo nuevo desbloqueado!', winT:'¡Food truck abierto!', winP:'¡Ya tienes un food truck de acero! Los peces de pistacho de Dubái están en el menú.',
  intro:'Haz crecer tu puesto de bungeoppang (pastelito con forma de pez) hasta un food truck de acero. Consigue la meta de cada nivel para ganar estrellas.',
  key:'Teclado: 1-9 moldes · * masa · 0 servir · # calmar',
  evs_spring:'Cerezo', evs_summer:'Helado', evs_autumn:'Boniato', evs_winter:'Queso nevado',
  evTitle:s=>`Evento de ${s}`, evPay:'¡Paga doble!', evIntro:n=>`¡Por tiempo limitado! Vende ${n} y todo lo que ganes se duplica.`, evHow:f=>`Masa de temporada + relleno de ${f}`,
  needFree:n=>`Gratis en el nivel ${n}`, turnHead:'¡Gira en la cabeza!',
  prep:'Preparar', prepIntro:'¡Prepara ingredientes antes de abrir y gana un dinerillo!', play:'Jugar',
  mg_bean:'Cocer judías rojas', mg_beanD:'Remueve en círculos hasta que burbujeen', mg_dough:'Batir la masa', mg_doughD:'Deshaz todos los grumos de harina',
  prepLeft:(n,m)=>`Quedan ${n} / ${m} (cada nivel superado suma uno)`, prepEmpty:'Ya preparaste por hoy. Supera un nivel para volver a jugar',
  mgHelp:'¡Remueve rápido en círculos dentro de la olla con el dedo!', mgTurns:'vueltas', mgBonus:(n,m)=>`${n} vueltas = premio ${m}`, mgDone:'¡Todo listo!', mgTurnsN:n=>`Diste ${n} vueltas`, mgBonusGot:m=>`¡Perfecto! Premio +${m}`,
  xpWhy:'Cada venta da tanta XP como lo que ganas. Sacar en el punto, limpiar, calmar y preparar dan más. ¡Sube de nivel para recuperar una preparación!', xpHave:'XP que puedes cambiar', xpRule:'3 XP = ₩1',
  xpAll:w=>`Cambiar todo (+${w})`, xpSome:(x,w)=>`${x} XP → ${w}`, xpNone:'No tienes XP suficiente', xpDone:w=>`¡Cambiaste ${w}!`, lvUp:l=>`¡Subes de nivel! Nv.${l} · +1 preparación`, perfect:'¡Perfecto!',
  churu:'Premio para gatos', churu10:'Pack de 10 premios', churuD:n=>`El gato come el premio en vez de un pez · Tienes ${n}`, tChuru:'El gato se comió el premio y se fue 😺',
  done:'Hecho', nextUp:'¡Siguiente!', stageRange:(a,b)=>`Niveles ${a}-${b}`, burnerLv:n=>`Fogón nivel ${n}`, xpMult:m=>`XP ×${m}`,
  coachNext:'Siguiente', coachGo:'¡Vamos!',
  c0:'¡Bienvenido, jefe! Hornea los bungeoppang que quieren tus clientes y véndelos. Hagamos uno juntos.',
  c1:'① Toca el bote de masa para verterla en un molde.', c2:'② Este cliente quiere judía roja. Toca su bote para añadir el relleno.', c3:'③ Toca el molde para taparlo con masa. ¡Se enciende el fuego!',
  c4:'Espera a que se llene el temporizador azul.', c5:'④ ¡Luz verde! Toca el molde para darle la vuelta.', c6:'⑤ ¡Está listo! Toca el molde para llevarlo a un plato.',
  c7:'⑥ Toca el plato para dárselo al cliente que espera.', c8:'¡Muy bien! Rojo es que se quema, así que date prisa. Ahora inténtalo tú.',
  cover:'Tapar', blop:'¡plop!', kpBatter:'masa', pickLang:'Elige tu idioma', ok:'Aceptar',
};
// keep the chocolate unlock stage in the existing languages in sync with data.js
L.ko.i_chocoD=`${CHOCO_STAGE}단계에 무료로 열려요 · 붕어빵 +200원`;L.en.i_chocoD=`Unlocks free at stage ${CHOCO_STAGE} · +₩200 per bun`;
Object.assign(L.ko,{kpServe:'서빙'});Object.assign(L.en,{kpServe:'serve'});Object.assign(L.zh,{kpServe:'上餐'});Object.assign(L.ja,{kpServe:'提供'});Object.assign(L.ar,{kpServe:'تقديم'});Object.assign(L.es,{kpServe:'servir'});
Object.assign(L.ko,{volume:'효과음 볼륨'});Object.assign(L.en,{volume:'Sound volume'});Object.assign(L.zh,{volume:'音效音量'});Object.assign(L.ja,{volume:'効果音の音量'});Object.assign(L.ar,{volume:'مستوى الصوت'});Object.assign(L.es,{volume:'Volumen'});
// cooling rack replaces plates
Object.assign(L.ko,{h_take:'다 익었어요! 눌러서 식힘망으로',h_serve:'식힘망의 붕어빵을 눌러 손님에게 건네요',tFull:'식힘망이 꽉 찼어요',c6:'⑤ 다 익었어요! 틀을 눌러 식힘망으로 옮겨요.',c7:'⑥ 식힘망의 붕어빵을 누르면 기다리는 손님에게 건네줘요.'});
Object.assign(L.en,{h_take:'Done! Tap to move it to the cooling rack',h_serve:'Tap the buns on the rack to hand them over',tFull:'The cooling rack is full',c6:'⑤ It is done! Tap the mold to move it to the cooling rack.',c7:'⑥ Tap the buns on the rack to hand them to the waiting guest.'});
Object.assign(L.zh,{h_take:'烤好了！点击放到晾架上',h_serve:'点击晾架上的鲷鱼烧递给客人',tFull:'晾架满了',c6:'⑤ 烤好了！点击模具放到晾架上。',c7:'⑥ 点击晾架上的鲷鱼烧递给等待的客人。'});
Object.assign(L.ja,{h_take:'焼けた！タップして網へ',h_serve:'網の上のたい焼きをタップして渡そう',tFull:'冷まし網がいっぱい',c6:'⑤ 焼けた！型をタップして冷まし網へ。',c7:'⑥ 網の上のたい焼きをタップして、待っているお客さんに渡そう。'});
Object.assign(L.ar,{h_take:'جاهزة! اضغط لنقلها إلى رف التبريد',h_serve:'اضغط على الكعكات في الرف لتقديمها',tFull:'رف التبريد ممتلئ',c6:'⑤ جاهزة! اضغط على القالب لنقلها إلى رف التبريد.',c7:'⑥ اضغط على الكعكات في الرف لتقدمها للزبون المنتظر.'});
Object.assign(L.es,{h_take:'¡Listo! Toca para llevarlo a la rejilla',h_serve:'Toca los peces de la rejilla para darlos',tFull:'La rejilla está llena',c6:'⑤ ¡Está listo! Toca el molde para llevarlo a la rejilla.',c7:'⑥ Toca los peces de la rejilla para dárselos al cliente que espera.'});
Object.assign(L.ko,{dbl:m=>`광고 보고 수익 2배 (+${m})`,dblGot:m=>`수익 2배 완료! +${m}`});Object.assign(L.en,{dbl:m=>`Watch ad: double earnings (+${m})`,dblGot:m=>`Doubled! +${m}`});
Object.assign(L.zh,{dbl:m=>`看广告收入翻倍（+${m}）`,dblGot:m=>`已翻倍！+${m}`});Object.assign(L.ja,{dbl:m=>`広告を見て売上2倍（+${m}）`,dblGot:m=>`2倍になりました！+${m}`});
Object.assign(L.ar,{dbl:m=>`شاهد إعلانًا لمضاعفة الأرباح (+${m})`,dblGot:m=>`تمت المضاعفة! +${m}`});Object.assign(L.es,{dbl:m=>`Ver anuncio: ganancias x2 (+${m})`,dblGot:m=>`¡Duplicado! +${m}`});
// rush rules, event triple pay, ice time
Object.assign(L.ko,{ms_worker:'퇴근길 회사원',msd_worker:'밤에 팥 붕어빵을 3~5개씩 사 가요',truckD:'붕어빵 +300원 · 손님이 더 자주 와요 · 진상 감소 · 두바이 해금',evTriple:'탄 것 없음 · 보상 3배!',evNoBurn:'하나도 안 태웠어요! 보상 3배',evNoBurnRule:'하나도 안 태우면 보상 3배!',ice:'아이스 타임',iceD:n=>`20초 동안 붕어빵이 타지 않아요 · ${ICE_PACK}개 묶음 · 보유 ${n}개`,iapTest:p=>`결제 테스트 화면이에요. 실제 앱에서는 스토어 결제(${p})로 진행돼요.`,iceGot:n=>`아이스 타임 ${n}개를 받았어요!`,iceNone:'아이스 타임이 없어요. 상점에서 살 수 있어요',iceOn:'❄️ 아이스 타임! 20초 동안 안 타요'});
Object.assign(L.en,{ms_worker:'Office workers at night',msd_worker:'At night they buy 3-5 red bean buns',truckD:'+₩300 per bun · guests come more often · fewer grumps · Dubai bun',evTriple:'Nothing burnt · triple pay!',evNoBurn:'Not a single burnt bun! Triple pay',evNoBurnRule:'Burn nothing for triple pay!',ice:'Ice Time',iceD:n=>`Buns can't burn for 20s · pack of ${ICE_PACK} · You have ${n}`,iapTest:p=>`Test checkout. The real app charges ${p} through the store.`,iceGot:n=>`Got ${n} Ice Time!`,iceNone:'No Ice Time left. Get some in the shop',iceOn:'❄️ Ice Time! Nothing burns for 20s'});
Object.assign(L.zh,{ms_worker:'下班的上班族',msd_worker:'晚上每次买3~5个红豆鲷鱼烧',truckD:'每个 +₩300 · 客人来得更勤 · 难缠客人减少 · 迪拜鲷鱼烧',evTriple:'零烤焦 · 收入3倍！',evNoBurn:'一个都没烤焦！收入3倍',evNoBurnRule:'一个都不烤焦就能拿3倍收入！',ice:'冰爽时间',iceD:n=>`20秒内鲷鱼烧不会烤焦 · ${ICE_PACK}个装 · 拥有 ${n}`,iapTest:p=>`这是测试结账画面。正式应用会通过商店收费（${p}）。`,iceGot:n=>`获得 ${n} 个冰爽时间！`,iceNone:'没有冰爽时间了，可以在商店购买',iceOn:'❄️ 冰爽时间！20秒内不会烤焦'});
Object.assign(L.ja,{ms_worker:'仕事帰りの会社員',msd_worker:'夜にあんこたい焼きを3〜5個ずつ買います',truckD:'1個 +₩300 · お客さんがよく来る · 困ったお客減少 · ドバイたい焼き',evTriple:'焦げゼロ · 報酬3倍！',evNoBurn:'ひとつも焦がさなかった！報酬3倍',evNoBurnRule:'ひとつも焦がさなければ報酬3倍！',ice:'アイスタイム',iceD:n=>`20秒間たい焼きが焦げない · ${ICE_PACK}個セット · 所持 ${n}`,iapTest:p=>`テスト用の決済画面です。本番アプリではストア決済（${p}）になります。`,iceGot:n=>`アイスタイムを${n}個ゲット！`,iceNone:'アイスタイムがありません。ショップで買えます',iceOn:'❄️ アイスタイム！20秒間焦げません'});
Object.assign(L.ar,{ms_worker:'موظفون بعد العمل',msd_worker:'ليلًا يشترون 3-5 كعكات فاصوليا',truckD:'+₩300 لكل كعكة · زبائن أكثر · مزعجون أقل · كعكة دبي',evTriple:'بلا احتراق · أجر ثلاثي!',evNoBurn:'لم تحترق أي كعكة! أجر ثلاثي',evNoBurnRule:'لا تحرق أي كعكة لتحصل على أجر ثلاثي!',ice:'وقت الثلج',iceD:n=>`لا تحترق الكعكات لمدة 20 ثانية · علبة ${ICE_PACK} · لديك ${n}`,iapTest:p=>`شاشة دفع تجريبية. التطبيق الحقيقي يدفع ${p} عبر المتجر.`,iceGot:n=>`حصلت على ${n} من وقت الثلج!`,iceNone:'لا يوجد وقت ثلج. اشترِه من المتجر',iceOn:'❄️ وقت الثلج! لا شيء يحترق لمدة 20 ثانية'});
Object.assign(L.es,{ms_worker:'Oficinistas de noche',msd_worker:'De noche compran 3-5 peces de judía roja',truckD:'+₩300 por pez · vienen más clientes · menos pesados · pez de Dubái',evTriple:'Nada quemado · ¡paga triple!',evNoBurn:'¡Ni un pez quemado! Paga triple',evNoBurnRule:'¡No quemes nada y cobra el triple!',ice:'Modo Hielo',iceD:n=>`Los peces no se queman durante 20 s · pack de ${ICE_PACK} · Tienes ${n}`,iapTest:p=>`Pago de prueba. La app real cobra ${p} en la tienda.`,iceGot:n=>`¡${n} Modo Hielo conseguidos!`,iceNone:'No te queda Modo Hielo. Cómpralo en la tienda',iceOn:'❄️ ¡Modo Hielo! Nada se quema en 20 s'});
// coins, milk chocolate, paid mini pack, XP tab, event XP x4
const COIN={ko:'코인',en:' coins',zh:' 金币',ja:'コイン',ar:' عملة',es:' monedas'};
Object.assign(L.ko,{b_choco:'밀크초코',i_choco:'밀크초코 반죽',ms_choco:'밀크초코 반죽 무료',msd_choco:'밀크초코 반죽을 무료로 써요 · 붕어빵 +200원',mi_special:'딸기·밀크초코 붕어빵 3개 팔기',miniBag:n=>`미니 붕어빵 ${n}개 묶음`,miniBagD:n=>`화난 손님을 바로 달래요 · 보유 ${n}개`,miniBagGot:n=>`미니 붕어빵 ${n}개를 받았어요!`,iapTest:p=>`결제 테스트 화면이에요. 실제 앱에서는 스토어 결제(${p})로 진행돼요.`,tabXp:'경험치 교환',evNoBurn:'하나도 안 태웠어요! 경험치 4배',evNoBurnRule:'하나도 안 태우고 끝내면 경험치 4배!',xpRule:'경험치 3 = 1코인'});
Object.assign(L.en,{b_choco:'Milk choco',i_choco:'Milk chocolate batter',ms_choco:'Free milk chocolate batter',msd_choco:'Use milk chocolate batter for free · +₩200 per bun',miniBag:n=>`${n} mini buns pack`,miniBagD:n=>`Calm angry guests at once · You have ${n}`,miniBagGot:n=>`Got ${n} mini buns!`,tabXp:'XP exchange',evNoBurn:'Not a single burnt bun! XP x4',evNoBurnRule:'Burn nothing for 4x XP!'});
Object.assign(L.zh,{b_choco:'牛奶巧克力',i_choco:'牛奶巧克力面糊',ms_choco:'牛奶巧克力面糊免费',msd_choco:'免费使用牛奶巧克力面糊 · 每个 +₩200',miniBag:n=>`迷你鲷鱼烧${n}个装`,miniBagD:n=>`立即安抚生气的客人 · 拥有 ${n}`,miniBagGot:n=>`获得 ${n} 个迷你鲷鱼烧！`,tabXp:'经验兑换',evNoBurn:'一个都没烤焦！经验4倍',evNoBurnRule:'一个都不烤焦就能拿4倍经验！'});
Object.assign(L.ja,{b_choco:'ミルクチョコ',i_choco:'ミルクチョコ生地',ms_choco:'ミルクチョコ生地無料',msd_choco:'ミルクチョコ生地が無料で使えます · 1個 +₩200',miniBag:n=>`ミニたい焼き${n}個セット`,miniBagD:n=>`怒ったお客さんをすぐなだめる · 所持 ${n}`,miniBagGot:n=>`ミニたい焼きを${n}個ゲット！`,tabXp:'経験値交換',evNoBurn:'ひとつも焦がさなかった！経験値4倍',evNoBurnRule:'ひとつも焦がさなければ経験値4倍！'});
Object.assign(L.ar,{b_choco:'شوكولاتة بالحليب',i_choco:'عجينة شوكولاتة بالحليب',ms_choco:'عجينة شوكولاتة بالحليب مجانية',msd_choco:'استخدم عجينة الشوكولاتة بالحليب مجانًا · +₩200 لكل كعكة',miniBag:n=>`علبة ${n} كعكة صغيرة`,miniBagD:n=>`تهدئ الزبائن الغاضبين فورًا · لديك ${n}`,miniBagGot:n=>`حصلت على ${n} كعكة صغيرة!`,tabXp:'صرف الخبرة',evNoBurn:'لم تحترق أي كعكة! خبرة ×4',evNoBurnRule:'لا تحرق أي كعكة لتحصل على خبرة ×4!'});
Object.assign(L.es,{b_choco:'Choco con leche',i_choco:'Masa de chocolate con leche',ms_choco:'Masa de chocolate con leche gratis',msd_choco:'Usa masa de chocolate con leche gratis · +₩200 por pez',miniBag:n=>`Pack de ${n} minipeces`,miniBagD:n=>`Calman al instante a los enfadados · Tienes ${n}`,miniBagGot:n=>`¡${n} minipeces conseguidos!`,tabXp:'Cambiar XP',evNoBurn:'¡Ni un pez quemado! XP x4',evNoBurnRule:'¡No quemes nada y gana 4x XP!'});
Object.assign(L.ko,{b_choco:'밀크초코 반죽'});Object.assign(L.en,{mi_special:'Sell 3 strawberry/milk choco buns'});
Object.assign(L.ko,{xpAll:w=>`모두 코인으로 바꾸기 (+${w})`});Object.assign(L.en,{xpAll:w=>`Swap all for coins (+${w})`});
Object.assign(L.en,{xpRule:'3,000 XP = $1'});
Object.assign(L.ko,{i_mini:'미니 붕어빵 틀',i_miniD:'매 단계 미니 붕어빵 5개를 받아요 · 화난 손님 달래기'});Object.assign(L.en,{i_miniD:'Get 5 mini buns every stage · calms upset guests'});Object.assign(L.zh,{i_miniD:'每关获得5个迷你鲷鱼烧 · 安抚生气的客人'});Object.assign(L.ja,{i_miniD:'毎ステージ ミニたい焼き5個 · 怒ったお客さんをなだめる'});Object.assign(L.ar,{i_miniD:'5 كعكات صغيرة كل مرحلة · تهدئ الزبائن الغاضبين'});Object.assign(L.es,{i_miniD:'5 minipeces en cada nivel · calman a los enfadados'});
// 600 XP = 100 coins
Object.assign(L.ko,{xpRule:`경험치 ${XP_RATE} = 1코인`});Object.assign(L.en,{xpRule:`${(XP_RATE*1000).toLocaleString("en-US")} XP = $1`});Object.assign(L.zh,{xpRule:`${XP_RATE} 经验 = 1 金币`});Object.assign(L.ja,{xpRule:`経験値${XP_RATE} = 1コイン`});Object.assign(L.ar,{xpRule:`${XP_RATE} خبرة = 1 عملة`});Object.assign(L.es,{xpRule:`${XP_RATE} XP = 1 moneda`});
// one flip: cover, then tap again to flip
Object.assign(L.ko,{h_flip2:'한 번 더 눌러 휙 뒤집어요!',c3:'③ 틀을 눌러 소 위에 반죽을 덮어요.',c5:'④ 한 번 더 누르면 휙 뒤집혀요. 불이 켜져요!'});
Object.assign(L.en,{h_flip2:'Tap again to flip it!',c3:'③ Tap the mold to cover the filling with batter.',c5:'④ Tap once more to flip it. The fire comes on!'});
Object.assign(L.zh,{h_flip2:'再点一下翻面！',c3:'③ 点击模具，在馅料上盖上面糊。',c5:'④ 再点一下翻面，火点着了！'});
Object.assign(L.ja,{h_flip2:'もう一度タップしてひっくり返そう！',c3:'③ 型をタップして、具の上に生地をかけよう。',c5:'④ もう一度タップするとひっくり返るよ。火がつくよ！'});
Object.assign(L.ar,{h_flip2:'اضغط مرة أخرى لقلبها!',c3:'③ اضغط على القالب لتغطية الحشوة بالعجين.',c5:'④ اضغط مرة أخرى لقلبها. النار تشتعل!'});
Object.assign(L.es,{h_flip2:'¡Toca otra vez para darle la vuelta!',c3:'③ Toca el molde para tapar el relleno con masa.',c5:'④ Toca otra vez para darle la vuelta. ¡Se enciende el fuego!'});
// commercial butane gas
Object.assign(L.ko,{fuel:'업소용 부탄가스',fuelD:n=>`남은 가스 ${n}% · 새 단계 15개마다 다 떨어져요 · 사면 100% 충전`,fuelLbl:'가스',gasEmpty:'가스가 다 떨어졌어요!',gasEmptyD:'상점에서 업소용 부탄가스를 사야 다음 단계를 열 수 있어요. 깬 단계는 다시 하면서 코인을 모을 수 있어요.'});
Object.assign(L.en,{fuel:'Commercial butane',fuelD:n=>`Gas left ${n}% · runs out every 15 new stages · refills to 100%`,fuelLbl:'Gas',gasEmpty:'Out of gas!',gasEmptyD:'Buy commercial butane in the shop to open the next stage. You can replay cleared stages to earn coins.'});
Object.assign(L.zh,{fuel:'商用丁烷气罐',fuelD:n=>`剩余燃气 ${n}% · 每15个新关卡用完 · 购买后充满100%`,fuelLbl:'燃气',gasEmpty:'燃气用完了！',gasEmptyD:'在商店购买商用丁烷气罐才能开启下一关。可以重玩已通过的关卡赚金币。'});
Object.assign(L.ja,{fuel:'業務用ガスボンベ',fuelD:n=>`残りガス ${n}% · 新ステージ15個ごとに空になる · 購入で100%`,fuelLbl:'ガス',gasEmpty:'ガスがなくなった！',gasEmptyD:'ショップで業務用ガスボンベを買うと次のステージが開きます。クリア済みのステージでコインを稼げます。'});
Object.assign(L.ar,{fuel:'غاز بوتان تجاري',fuelD:n=>`الغاز المتبقي ${n}% · ينفد كل 15 مرحلة جديدة · يمتلئ 100%`,fuelLbl:'الغاز',gasEmpty:'نفد الغاز!',gasEmptyD:'اشترِ غاز البوتان من المتجر لفتح المرحلة التالية. يمكنك إعادة المراحل السابقة لجمع العملات.'});
Object.assign(L.es,{fuel:'Butano industrial',fuelD:n=>`Gas restante ${n}% · se acaba cada 15 niveles nuevos · recarga al 100%`,fuelLbl:'Gas',gasEmpty:'¡Sin gas!',gasEmptyD:'Compra butano en la tienda para abrir el siguiente nivel. Puedes repetir niveles superados para ganar monedas.'});
Object.assign(L.ko,{i_gasD:(a,b)=>`굽는 시간 ${a}초 → ${b}초`});Object.assign(L.en,{i_gasD:(a,b)=>`Bake ${a}s → ${b}s`});Object.assign(L.zh,{i_gasD:(a,b)=>`烤制 ${a}秒 → ${b}秒`});Object.assign(L.ja,{i_gasD:(a,b)=>`焼き時間 ${a}秒 → ${b}秒`});Object.assign(L.ar,{i_gasD:(a,b)=>`الخبز ${a} ث ← ${b} ث`});Object.assign(L.es,{i_gasD:(a,b)=>`Horneado ${a} s → ${b} s`});
// easy / hard
Object.assign(L.ko,{mEasy:'🐢 이지\n모드',mHard:'🔥 하드\n모드',mEasyD:'이지 모드: 천천히 타고, 손님이 한 번에 2명·3개까지만 와요',mHardD:'하드 모드: 빨리 익고 빨리 타요. 주문도 많아져요',mNormalD:'보통 모드로 돌아왔어요'});
Object.assign(L.en,{mEasy:'🐢 Easy',mHard:'🔥 Hard',mEasyD:'Easy: buns burn slowly, at most 2 guests and 3 buns per order',mHardD:'Hard: buns cook and burn faster, bigger orders',mNormalD:'Back to normal mode'});
Object.assign(L.zh,{mEasy:'🐢 简单模式',mHard:'🔥 困难模式',mEasyD:'简单模式：烤焦得慢，最多同时2位客人、每单3个',mHardD:'困难模式：熟得快也焦得快，订单更多',mNormalD:'已回到普通模式'});
Object.assign(L.ja,{mEasy:'🐢 イージー',mHard:'🔥 ハード',mEasyD:'イージー：ゆっくり焦げる。お客さんは同時に2人、注文は3個まで',mHardD:'ハード：早く焼けて早く焦げる。注文も増える',mNormalD:'ふつうモードに戻りました'});
Object.assign(L.ar,{mEasy:'🐢 سهل',mHard:'🔥 صعب',mEasyD:'سهل: الاحتراق أبطأ، زبونان على الأكثر و3 كعكات للطلب',mHardD:'صعب: خبز واحتراق أسرع وطلبات أكبر',mNormalD:'عدت إلى الوضع العادي'});
Object.assign(L.es,{mEasy:'🐢 Fácil',mHard:'🔥 Difícil',mEasyD:'Fácil: se queman despacio, máximo 2 clientes y 3 peces por pedido',mHardD:'Difícil: se hacen y se queman antes, pedidos más grandes',mNormalD:'De vuelta al modo normal'});
// permanent paid perks
Object.assign(L.ko,{pk_noads:'광고 제거 + 부스터 무료',pkd_noads:'부스터, +30초, 수익 2배를 광고 없이 바로 받아요 · 한 번 구매',pk_pat2:'느긋한 손님',pkd_pat2:'손님 인내심이 2배로 늘어요 · 한 번 구매',pk_rack2:'식힘망 2배',pkd_rack2:'식힘망에 2배 더 많이 보관해요 · 한 번 구매',getFree:'바로 받기',contFree:'+30초 받기',dblFree:m=>`수익 2배 받기 (+${m})`});
Object.assign(L.en,{pk_noads:'No ads + free boosters',pkd_noads:'Boosters, +30s and double earnings without ads · one-time purchase',pk_pat2:'Patient guests',pkd_pat2:'Guests wait twice as long · one-time purchase',pk_rack2:'Double rack',pkd_rack2:'The cooling rack holds twice as many buns · one-time purchase',getFree:'Get it',contFree:'Get +30s',dblFree:m=>`Double earnings (+${m})`});
Object.assign(L.zh,{pk_noads:'去广告 + 道具免费',pkd_noads:'道具、+30秒、收入翻倍都无需看广告 · 一次性购买',pk_pat2:'耐心的客人',pkd_pat2:'客人的耐心变为2倍 · 一次性购买',pk_rack2:'晾架加倍',pkd_rack2:'晾架可多放一倍的鲷鱼烧 · 一次性购买',getFree:'立即领取',contFree:'领取 +30秒',dblFree:m=>`收入翻倍（+${m}）`});
Object.assign(L.ja,{pk_noads:'広告なし + ブースター無料',pkd_noads:'ブースター、+30秒、売上2倍を広告なしで受け取れます · 買い切り',pk_pat2:'のんびりお客さん',pkd_pat2:'お客さんの忍耐が2倍になります · 買い切り',pk_rack2:'冷まし網2倍',pkd_rack2:'冷まし網に2倍置けます · 買い切り',getFree:'受け取る',contFree:'+30秒を受け取る',dblFree:m=>`売上2倍を受け取る（+${m}）`});
Object.assign(L.ar,{pk_noads:'بدون إعلانات + معززات مجانية',pkd_noads:'المعززات و+30 ثانية ومضاعفة الأرباح بدون إعلانات · شراء لمرة واحدة',pk_pat2:'زبائن صبورون',pkd_pat2:'ينتظر الزبائن ضعف المدة · شراء لمرة واحدة',pk_rack2:'رف مضاعف',pkd_rack2:'يتسع رف التبريد لضعف العدد · شراء لمرة واحدة',getFree:'احصل عليه',contFree:'احصل على +30 ثانية',dblFree:m=>`ضاعف الأرباح (+${m})`});
Object.assign(L.es,{pk_noads:'Sin anuncios + potenciadores gratis',pkd_noads:'Potenciadores, +30 s y ganancias x2 sin anuncios · compra única',pk_pat2:'Clientes pacientes',pkd_pat2:'Los clientes esperan el doble · compra única',pk_rack2:'Rejilla doble',pkd_rack2:'La rejilla guarda el doble de peces · compra única',getFree:'Conseguir',contFree:'Conseguir +30 s',dblFree:m=>`Ganancias x2 (+${m})`});
// translation review pass: rules that changed (family +2, mold gives 5 a stage, coins) and wording fixes
Object.assign(L.ko,{msd_group:'가족 손님이 2개씩 더 주문해요',msd_mini:'상점에서 틀을 사면 매 단계 미니 붕어빵 5개로 화난 손님을 달래요',tCash:'코인이 부족해요',earned:'오늘 번 코인'});
Object.assign(L.en,{msd_group:'Families order 2 more',msd_mini:'Buy the mold to get 5 mini buns every stage and calm upset guests',tCash:'Not enough money'});
Object.assign(L.zh,{msd_group:'家庭客人多买2个',msd_mini:'在商店买模具，每关获得5个迷你鲷鱼烧来安抚客人',tCash:'金币不足',wallet:'金币',mi_special:'卖出3个草莓/牛奶巧克力鲷鱼烧',h_wait:'等蓝色火焰计时器转满',c4:'等蓝色火焰计时器转满。'});
Object.assign(L.ja,{msd_group:'家族が2個多く注文します',msd_mini:'ショップで型を買うと、毎ステージ ミニたい焼き5個で怒ったお客さんをなだめられます',tCash:'コインが足りません',wallet:'コイン',xpAll:w=>`全部コインに換える（+${w}）`,mi_special:'いちご・ミルクチョコたい焼きを3個売る',tRun:n=>`代金を払わずに逃げた！ -${n}`,msd_bully:'代金を払わず逃げることも · 防犯カメラで防ぐ'});
Object.assign(L.ar,{msd_group:'العائلات تطلب كعكتين إضافيتين',msd_mini:'اشترِ القالب لتحصل على 5 كعكات صغيرة كل مرحلة وتهدئ الزبائن الغاضبين',tCash:'العملات لا تكفي',wallet:'العملات',mi_special:'بِع 3 كعكات فراولة/شوكولاتة بالحليب',student:'طالب',bo_spatula:'المقلبة الذهبية',cloth:'مفرش مربعات'});
Object.assign(L.es,{msd_group:'Las familias piden 2 más',msd_mini:'Compra el molde para recibir 5 minipeces en cada nivel y calmar a los enfadados',tCash:'No tienes suficientes monedas',wallet:'Monedas',mi_special:'Vende 3 peces de fresa/chocolate con leche',on:'activado',off:'desactivado'});
// relaxed guests x1.5, rack name, ad booster gives 3 minis
Object.assign(L.ko,{pk_pat2:'느긋한 손님들',pkd_pat2:'모든 손님의 인내심이 1.5배로 늘어요 · 한 번 구매',pk_rack2:'식힘망 2배 용량업',bo_mini:`미니 붕어빵 ${AD_MINI}개`});
Object.assign(L.en,{pkd_pat2:'All guests wait 1.5x longer · one-time purchase',pk_rack2:'Double rack capacity',bo_mini:`${AD_MINI} mini buns`});
Object.assign(L.zh,{pkd_pat2:'所有客人的耐心变为1.5倍 · 一次性购买',pk_rack2:'晾架容量加倍',bo_mini:`${AD_MINI}个迷你鲷鱼烧`});
Object.assign(L.ja,{pk_pat2:'のんびりお客さんたち',pkd_pat2:'すべてのお客さんの忍耐が1.5倍になります · 買い切り',pk_rack2:'冷まし網の容量2倍',bo_mini:`ミニたい焼き${AD_MINI}個`});
Object.assign(L.ar,{pkd_pat2:'ينتظر كل الزبائن مدة أطول بمرة ونصف · شراء لمرة واحدة',pk_rack2:'سعة رف مضاعفة',bo_mini:`${AD_MINI} كعكات صغيرة`});
Object.assign(L.es,{pkd_pat2:'Todos los clientes esperan 1,5 veces más · compra única',pk_rack2:'Rejilla con doble capacidad',bo_mini:`${AD_MINI} minipeces`});
Object.assign(L.en,{shop:'Market'});
