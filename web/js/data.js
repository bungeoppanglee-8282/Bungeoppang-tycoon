// ---------- asset paths ----------
const SC={"prop_dknot": "assets/img/sc_prop_dknot.webp","prop_dpouch": "assets/img/sc_prop_dpouch.webp","prop_dgarland": "assets/img/sc_prop_dgarland.webp","prop_dbell": "assets/img/sc_prop_dbell.webp","prop_dmobile": "assets/img/sc_prop_dmobile.webp","prop_dsnowman": "assets/img/sc_prop_dsnowman.webp","prop_dwreath": "assets/img/sc_prop_dwreath.webp","prop_dglobe": "assets/img/sc_prop_dglobe.webp","prop_awning": "assets/img/sc_prop_awning.webp","prop_cloth": "assets/img/sc_prop_cloth.webp","prop_lantern": "assets/img/sc_prop_lantern.webp","prop_lights": "assets/img/sc_prop_lights.webp","tub_pizza": "assets/img/sc_tub_pizza.webp","tub_dubai": "assets/img/sc_tub_dubai.webp","cashbox": "assets/img/sc_cashbox.webp","prop_sign": "assets/img/sc_prop_sign.webp","prop_flower": "assets/img/sc_prop_flower.webp","tub_red": "assets/img/sc_tub_red.webp","tub_cream": "assets/img/sc_tub_cream.webp","fill_pizza": "assets/img/sc_fill_pizza.webp","fill_dubai": "assets/img/sc_fill_dubai.webp","bg_wood_day": "assets/img/sc_bg_wood_day.webp","bg_wood_night": "assets/img/sc_bg_wood_night.webp","bg_green": "assets/img/sc_bg_green.webp","cat_1": "assets/img/sc_cat_1.webp","cat_2": "assets/img/sc_cat_2.webp","cat_3": "assets/img/sc_cat_3.webp","cat_4": "assets/img/sc_cat_4.webp","icon_1": "assets/img/sc_icon_1.webp","icon_2": "assets/img/sc_icon_2.webp","icon_3": "assets/img/sc_icon_3.webp","icon_4": "assets/img/sc_icon_4.webp","icon_5": "assets/img/sc_icon_5.webp","icon_6": "assets/img/sc_icon_6.webp","icon_truck": "assets/img/sc_icon_truck.webp","bg_truck_day": "assets/img/sc_bg_truck_day.webp","bg_truck_night": "assets/img/sc_bg_truck_night.webp"};
const CPOSE={"dad_1": "assets/img/cpose_dad_1.webp", "dad_2": "assets/img/cpose_dad_2.webp", "dad_3": "assets/img/cpose_dad_3.webp", "dad_4": "assets/img/cpose_dad_4.webp", "auntie_1": "assets/img/cpose_auntie_1.webp", "auntie_2": "assets/img/cpose_auntie_2.webp", "auntie_3": "assets/img/cpose_auntie_3.webp", "auntie_4": "assets/img/cpose_auntie_4.webp", "student_1": "assets/img/cpose_student_1.webp", "student_2": "assets/img/cpose_student_2.webp", "student_3": "assets/img/cpose_student_3.webp", "student_4": "assets/img/cpose_student_4.webp", "girl_1": "assets/img/cpose_girl_1.webp", "girl_2": "assets/img/cpose_girl_2.webp", "girl_3": "assets/img/cpose_girl_3.webp", "girl_4": "assets/img/cpose_girl_4.webp", "worker_1": "assets/img/cpose_worker_1.webp", "worker_2": "assets/img/cpose_worker_2.webp", "worker_3": "assets/img/cpose_worker_3.webp", "worker_4": "assets/img/cpose_worker_4.webp", "gent_1": "assets/img/cpose_gent_1.webp", "gent_2": "assets/img/cpose_gent_2.webp", "gent_3": "assets/img/cpose_gent_3.webp", "gent_4": "assets/img/cpose_gent_4.webp", "grandpa_1": "assets/img/cpose_grandpa_1.webp", "grandpa_2": "assets/img/cpose_grandpa_2.webp", "grandpa_3": "assets/img/cpose_grandpa_3.webp", "grandpa_4": "assets/img/cpose_grandpa_4.webp", "bully_1": "assets/img/cpose_bully_1.webp", "bully_2": "assets/img/cpose_bully_2.webp", "bully_3": "assets/img/cpose_bully_3.webp", "bully_4": "assets/img/cpose_bully_4.webp", "jerk_1": "assets/img/cpose_jerk_1.webp", "jerk_2": "assets/img/cpose_jerk_2.webp", "jerk_3": "assets/img/cpose_jerk_3.webp", "jerk_4": "assets/img/cpose_jerk_4.webp", "bully_run": "assets/img/cpose_bully_run.webp"};
const CIMG={"auntie": "assets/img/cimg_auntie.webp", "worker": "assets/img/cpose_worker_1.webp", "dad": "assets/img/cimg_dad.webp", "mom": "assets/img/cimg_mom.webp", "student": "assets/img/cimg_student.webp", "kid": "assets/img/cimg_kid.webp", "girl": "assets/img/cpose_girl_1.webp", "gent": "assets/img/cpose_gent_1.webp", "grandpa": "assets/img/cpose_grandpa_1.webp", "bully": "assets/img/cpose_bully_1.webp", "jerk": "assets/img/cpose_jerk_1.webp"};
const W=720,H=1280;   // logical stage size
const IMGP='assets/img/';
const BUN=(b,k)=>`${IMGP}bun_${b}_${k}.webp`;
const MOLD=IMGP+'img_mold.webp';

// ---------- numbers (owner decisions marked *) ----------
const GAS=[8,7.5,5,3];                    // * seconds per side by stove level
const GAS_COST=[0,8000,25000,60000];
const BASE_PRICE=200, START_MONEY=20000;   // * 200원 start (was 500), * 20,000원 opening event
const ROW_COST=10000, MAX_ROWS=5;           // * 3 molds per row, up to 5 rows
// cooling rack (4 rails): buns it holds, by stage
const rackCap=n=>n<=3?15:n<=10?25:n<=20?35:45;
const PLATES0=4, PLATES_MAX=6, PLATE_COST=8000, PLATE_CAP=8;
const CCTV_COST=30000, TRUCK_COST=500000;
const DECO=[{id:'awning',cost:15000,add:50},{id:'cloth',cost:10000,add:50},{id:'flower',cost:12000,add:50},{id:'lantern',cost:20000,add:50},{id:'sign',cost:25000,add:100},{id:'lights',cost:30000,add:100},
  {id:'dknot',cost:8000,add:20},{id:'dpouch',cost:12000,add:30},{id:'dgarland',cost:14000,add:30},{id:'dbell',cost:16000,add:30},{id:'dmobile',cost:18000,add:40},{id:'dsnowman',cost:20000,add:40},{id:'dwreath',cost:22000,add:40},{id:'dglobe',cost:28000,add:50}];
const DECO_NEW=['dknot','dpouch','dgarland','dbell','dmobile','dsnowman','dwreath','dglobe'];   // small ornaments: hung along the awning or set on the counter, never over guests' orders // * decor raises bun price
const BATTER={plain:{cost:8,add:0},straw:{cost:25,add:200,buy:15000},matcha:{cost:25,add:200,buy:20000},choco:{cost:25,add:200},ev:{cost:10,add:0}};
const FILL={red:{cost:12},cream:{cost:12},pizza:{cost:12,stage:3},dubai:{cost:55,mult:3}};
const MILK={white:{price:800,buy:12000},straw:{price:1000,buy:8000},choco:{price:1000,buy:8000}}; // white = the machine itself
const MILK_STAGE=11, MILK_TIME=2.5, MILK_COST=80, CUPS=3;
const MINI={buy:10000,time:6,cost:30,yield:5,cap:10,calm:.45,stage:5};
const CRUMB_BONUS=50;
const CHURU_ONE=500, CHURU_TEN=4000;   // cat treat: the cat eats one instead of stealing a bun
// experience: every won earned is also XP; skill moments add more. XP can be cashed in at 3 XP -> 1 won; level uses lifetime XP
const XP_RATE=6, XP_PERFECT=20, XP_CLEAN=10, XP_CALM=30, XP_STAR=200, XP_TURN=10;
const lvlOf=x=>Math.floor(Math.sqrt(x/500))+1, lvlXp=l=>500*(l-1)**2;
// seasonal event bun: batter look while cooking, required filling, finished image
const SEASON_OF=m=>m>=2&&m<=4?'spring':m>=5&&m<=7?'summer':m>=8&&m<=10?'autumn':'winter';
const EV={spring:{look:'sakura',fill:'cream'},summer:{look:'plain',fill:'cream'},autumn:{look:'purple',fill:'red'},winter:{look:'plain',fill:'pizza'}};
const CHOCO_STAGE=7;   // chocolate batter unlocks free at this stage
const EVENT_PAY=2;     // seasonal event stage pays double
// display height per customer image so every head renders about the same size
const CH={"assets/img/cimg_auntie.webp": 256, "assets/img/cimg_dad.webp": 265, "assets/img/cimg_kid.webp": 269, "assets/img/cimg_mom.webp": 232, "assets/img/cimg_student.webp": 258, "assets/img/cimg_worker.webp": 310, "assets/img/cpose_auntie_1.webp": 192, "assets/img/cpose_auntie_2.webp": 204, "assets/img/cpose_auntie_3.webp": 211, "assets/img/cpose_auntie_4.webp": 208, "assets/img/cpose_dad_1.webp": 208, "assets/img/cpose_dad_2.webp": 209, "assets/img/cpose_dad_3.webp": 218, "assets/img/cpose_dad_4.webp": 218, "assets/img/cpose_student_1.webp": 190, "assets/img/cpose_student_2.webp": 190, "assets/img/cpose_student_3.webp": 190, "assets/img/cpose_student_4.webp": 190, "assets/img/cpose_girl_1.webp": 190, "assets/img/cpose_girl_2.webp": 190, "assets/img/cpose_girl_3.webp": 190, "assets/img/cpose_girl_4.webp": 190, "assets/img/cpose_worker_1.webp": 205, "assets/img/cpose_worker_2.webp": 208, "assets/img/cpose_worker_3.webp": 212, "assets/img/cpose_worker_4.webp": 209, "assets/img/cpose_gent_1.webp": 190, "assets/img/cpose_gent_2.webp": 235, "assets/img/cpose_gent_3.webp": 229, "assets/img/cpose_gent_4.webp": 230, "assets/img/cpose_grandpa_1.webp": 190, "assets/img/cpose_grandpa_2.webp": 190, "assets/img/cpose_grandpa_3.webp": 190, "assets/img/cpose_grandpa_4.webp": 190, "assets/img/cpose_bully_1.webp": 223, "assets/img/cpose_bully_2.webp": 215, "assets/img/cpose_bully_3.webp": 223, "assets/img/cpose_bully_4.webp": 190, "assets/img/cpose_jerk_1.webp": 195, "assets/img/cpose_jerk_2.webp": 193, "assets/img/cpose_jerk_3.webp": 190, "assets/img/cpose_jerk_4.webp": 190, "assets/img/cpose_bully_run.webp": 223};

// ---------- stages ----------
const STAGES=60;
// 10 stage spots along the road in the map background (x%, y%), bottom to top
const ROAD=[[29.01, 75.06], [58.55, 70.33], [54.94, 60.47], [23.38, 57.18], [46.44, 49.34], [77.05, 43.9], [52.71, 36.12], [21.15, 34.93], [35.18, 23.98], [66.63, 22.97]];
// prep pot art per gas-stove level: [left, top, width, height] % of the pot opening; stronger burner = more XP per stir
const POT_OPEN={"1": [21.3, 27.1, 59.8, 28.8], "2": [20.4, 25.1, 60.8, 26.2], "3": [20.0, 16.3, 65.1, 38.2], "4": [20.6, 20.3, 63.5, 33.0], "dough": [6.3, 19.4, 81.3, 42.1]}, BURNER_XP=[1,1.5,2,3];
// movable spoon per prep pot: width % of pot, head point % in the pot, head anchor % in the spoon image
const SPOON={"1": {"w": 50, "hx": 54.2, "hy": 42.9, "ax": 17.3, "ay": 82.5}, "2": {"w": 50, "hx": 53.8, "hy": 39.5, "ax": 17.3, "ay": 82.5}, "3": {"w": 50, "hx": 55.8, "hy": 37.3, "ax": 17.3, "ay": 82.5}, "4": {"w": 50, "hx": 55.5, "hy": 38.5, "ax": 17.3, "ay": 82.5}, "dough": {"w": 56, "hx": 51.0, "hy": 42.6, "ax": 17.3, "ay": 82.5}};
const POT_FR=[1,2];   // burner levels that have two steam frames
const PREP_MAX=3, PREP_TIME=15, PREP_PAY=50, PREP_BONUS_AT=30, PREP_BONUS=500;  // stir mini-game before opening
const r500=x=>Math.round(x/500)*500;
// stage length: 50s, 65s, 80s, then +2.5s per stage, never above 120s
const stageDur=n=>n<=3?[50,65,80][n-1]:Math.min(120,80+(n-3)*2.5);
// goal keeps the old earn-rate (it was tuned for 150s/165s stages), scaled to the shorter clock
// after stage 10 the goal eases to 80%: with max 3 guests 10s apart, a near-perfect run earns about 1.25x the goal at the top stages
const stageGoal=n=>Math.max(500,r500((3000+1000*(n-1)+8*(n-1)**2)*(stageDur(n)-15)/((n<4?150:165)-15)*(n<=10?1:Math.max(.8,1-(n-10)*.02))*(BASE_PRICE+15*n)/(500+15*n)));   // goals were tuned at a 500 base price; scale to the 200 base (decor adds ~15/stage)   // first ~15s of a stage is baking, so scale by selling time
const NIGHT_AT=.6;  // fraction of the stage after which it is night
// milestones shown on the staircase map and announced when reached
// something new every 2-3 stages up to 40; RAMP_END is where the difficulty curve tops out
const MILESTONE={3:'pizza',5:'mini',7:'choco',9:'elder',11:'milk',13:'worker',15:'gent',18:'bully',21:'jerk',24:'kinds3',27:'group',30:'lunch',33:'dubai',36:'rush'};
const RAMP_END=40, ramp=n=>Math.min(n,RAMP_END)/RAMP_END;
const MAX_ORDER=5, MAX_GUESTS=3, SPAWN_GAP=10;   // * at most 5 buns per order, 3 guests at once, a new guest at least 10s after the last
// permanent items bought with diamonds: [save flag, diamond price, icon]
const PERKS={noads:['noads',50,'🚫'],pat2:['pat2',40,'⏳'],rack2:['rack2',30,'assets/img/icon_rack2.webp']};
const AD_MINI=3;   // mini buns from the ad booster
const MINIBAG_PACK=20;   // paid pack of mini buns, used after the stage's own
// play modes: bake time, time before burning, seconds added between guests, guests at once, biggest order, extra buns per order, patience, goal
const MODE={easy:{cook:1,grace:1.8,gap:5,guests:2,order:3,plus:0,pat:1.08,goal:.65},
  normal:{cook:1,grace:1,gap:0,guests:3,order:5,plus:0,pat:1,goal:1},
  hard:{cook:.7,grace:.7,gap:-2,guests:3,order:5,plus:1,pat:.85,goal:1.5}};
// live features (js/live.js). LIVE_FAST turns hours into seconds so test builds can be tried at once
const LIVE_FAST=false, DELIVERY_H=[24,48];   // * decor ships in 1-2 days
const SP_NEED=30, SP_MIN=3.5,SP_BATS=['plain','straw','choco'],SP_FILLS=['red','cream'], SP_REWARD=5000, SP_XP=500, SP_STAGE=3, SP_AWAY_H=20;   // * special order: 30 buns in 30 minutes, once a day
const FUEL_COST=70000, FUEL_STAGES=15;   // * commercial butane: a full tank lasts 15 new stages, refill costs 70,000 coins
// store/AdMob policy info: fill before release (Play Console needs a public privacy-policy URL)
const SUPPORT_EMAIL='bungeoppanglee@gmail.com', PRIVACY_URL='https://bungeoppanglee-8282.github.io/Bungeoppang-tycoon/', TERMS_URL='https://bungeoppanglee-8282.github.io/Bungeoppang-tycoon/terms.html', DELETE_URL='https://bungeoppanglee-8282.github.io/Bungeoppang-tycoon/delete.html', APP_VER='1.0.0';
const GOLD_EVERY=3, GOLD_PRICE=4000;   // every 3rd stage: once the grill is full one bun turns golden (sells for 4,000) and every bun finishes at once
const BAKE_HOLD=5;   // instant-baked buns sparkle and cannot burn for this many seconds
const BAKE_PACK=20;   // paid booster: every bun on the grill is done at once; pack of 20
const ICE_TIME=20, ICE_PACK=3;   // paid booster: ready buns cannot burn for 20s; pack of 3
const UNLOCK_AT=k=>+Object.keys(MILESTONE).find(n=>MILESTONE[n]===k);

// ---------- customers ----------
// pose: base name in CPOSE (1 greet, 2 order, 3 impatient, 4 happy); img: fallback still; tint: stand-in look until own art exists
const CT={
  kid:    {stage:1, w:3,  pat:50, img:['kid','girl'],   lo:1,hi:2, pose:{girl:'girl'}},
  family: {stage:1, w:2,  pat:60, img:['dad','mom'],    lo:2,hi:4, pose:{dad:'dad'}},
  student:{stage:3, w:3,  pat:46, img:['student'],      lo:2,hi:4, pose:{student:'student'}, like:'pizza'},
  grandma:{stage:9, w:1.2,pat:70, img:['auntie'],       lo:2,hi:3, pose:{auntie:'auntie'}, like:'red', elder:true},
  grandpa:{stage:9, w:1,  pat:70, img:['grandpa'],      lo:2,hi:3, like:'red', elder:true, pose:{grandpa:'grandpa'}},
  gent:   {stage:15, w:1.5,pat:60, img:['gent'],         lo:2,hi:4, pose:{gent:'gent'}},
  worker: {stage:13, w:3,  pat:85, img:['worker'],       lo:3,hi:5, night:true, like:'red', pose:{worker:'worker'}},
  bully:  {stage:18,w:1.4,pat:45, img:['bully'],        lo:2,hi:3, pose:{bully:'bully'}},
  jerk:   {stage:21,w:1.2,pat:55, img:['jerk'],         lo:1,hi:3, mini:true, pose:{jerk:'jerk'}},
};
const CUST_SPOTS=[100,265,455,620];
// ranking: no server yet, so the other shops are sample rivals. shortcut: sample data only, replace RANK_SAMPLE with a server fetch when a backend exists
const RANK_SAMPLE=[['황금붕어',9850],['팥부자',8720],['슈크림왕',7640],['바삭붕어',6980],['밤시장',6420],['반죽달인',5810],['노릇노릇',5390],['붕어공방',4950],['달콤팥',4520],['첫붕어',4180]], RANK_REV=450;
// booster pack: month-long attendance gift, also sold in the shop. Price = unit prices (3,900/20, 2,900/3, 2,200/20) x 5 each = 6,358 -> 15% off = 5,404 -> 5,400
const ATT_PACK={bake:5,ice:5,mini:5};
// Diamonds (💎) are the only thing sold for real money. List price 1 💎 = ₩100; discount per pack: 50 → 2%, 100 → 11%, 200 → 12.5%, 300 → 18%.
// GEM_PACKS key = Play Console product id (must match exactly, type: consumable) -> [diamonds, label used only by the test checkout]. The real price comes from Play.
const GEM_PACKS={gem50:[50,'₩4,900'],gem100:[100,'₩8,900'],gem200:[200,'₩17,500'],gem300:[300,'₩24,500']}, IAP_IDS=Object.keys(GEM_PACKS);
const GEM_COST={minibag:20,attpack:50,bake:40,ice:30};   // diamond price of the booster packs (permanent items: see PERKS)
