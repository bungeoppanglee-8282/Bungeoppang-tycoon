// What things cost. The server owns these numbers, so a client can never pick its own price.
// Keep equal to web/js/data.js (GEM_PACKS, GEM_COST, PERKS): tests/pay.test.js checks it.
const PACKS={gem50:[50,4900],gem100:[100,8900],gem200:[200,17500],gem300:[300,24500]};   // pack id -> [diamonds, won]
const COSTS={minibag:20,attpack:50,bake:40,ice:30,noads:50,pat2:40,rack2:30};            // item id -> diamonds
// Toss app (Apps in Toss): the product id (sku) each pack gets in the Apps in Toss console. '' = not registered yet.
// Keep equal to TOSS_SKU in web/js/tossiap.js (tests/toss.test.js checks it). If the console lets you choose the id and you use gem50 ... gem300, leave these empty.
const TOSS_SKU={gem50:'',gem100:'',gem200:'',gem300:''};
const packOfSku=sku=>Object.keys(TOSS_SKU).find(k=>TOSS_SKU[k]&&TOSS_SKU[k]===sku)||(PACKS[sku]&&!TOSS_SKU[sku]?sku:null);
module.exports={PACKS,COSTS,TOSS_SKU,packOfSku};
