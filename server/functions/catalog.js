// What things cost. The server owns these numbers, so a client can never pick its own price.
// Keep equal to web/js/data.js (GEM_PACKS, GEM_COST, PERKS): tests/pay.test.js checks it.
const PACKS={gem50:[50,4900],gem100:[100,8900],gem200:[200,17500],gem300:[300,24500]};   // pack id -> [diamonds, won]
const COSTS={minibag:20,attpack:50,bake:40,ice:30,noads:50,pat2:40,rack2:30};            // item id -> diamonds
module.exports={PACKS,COSTS};
