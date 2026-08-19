/* =========================================================
   KASUWA — data.js
   Nigerian stocks (NGX) + deterministic price simulation
   ========================================================= */

// Seeded PRNG (mulberry32) so charts are stable across reloads
function mulberry32(a){
  return function(){
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}
function hashSeed(str){
  let h=2166136261;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}

// ---- Stock universe (real NGX names, realistic indicative prices) ----
const STOCKS = [
  { sym:"DANGCEM",  name:"Dangote Cement",  sector:"Cement",      price:698.00, prevClose:684.30, mcap:"₦11.7tn", vol:"4.2m", pe:19.6, div:2.8, high52:760, low52:420, shariah:true,  color:"#8b5cf6", about:"Dangote Cement is Africa's largest cement producer with a 10%+ share of the entire NGX. Its pan-African footprint and massive domestic capacity make it a bellwether for Nigerian industry and construction." },
  { sym:"MTNN",      name:"MTN Nigeria",     sector:"Telecoms",    price:822.00, prevClose:798.00, mcap:"₦16.4tn", vol:"8.9m", pe:12.4, div:5.1, high52:860, low52:560, shariah:false, color:"#f59e0b", about:"MTN Nigeria is the country's largest mobile network operator with over 90 million subscribers. A dominant cash-flow generator, its stock is a favourite for income and defensive investors." },
  { sym:"BUAFOODS",  name:"BUA Foods",       sector:"Consumer",    price:939.00, prevClose:921.00, mcap:"₦15.2tn", vol:"3.1m", pe:24.0, div:1.6, high52:990, low52:520, shariah:true,  color:"#22c55e", about:"BUA Foods is one of West Africa's largest food businesses, spanning sugar, flour, pasta, rice and edible oils. A play on Nigeria's fast-growing consumer demand." },
  { sym:"AIRTELAFRI",name:"Airtel Africa",   sector:"Telecoms",    price:2150.00, prevClose:2130.00, mcap:"₦8.5tn", vol:"0.7m", pe:9.1, div:6.2, high52:2310, low52:1600, shariah:false, color:"#ef4444", about:"Airtel Africa operates mobile and mobile-money services across 14 African countries. Its strong dividend yield and mobile-money growth story attract international investors." },
  { sym:"GTCO",      name:"Guaranty Trust Holding", sector:"Banking", price:126.50, prevClose:124.00, mcap:"₦4.3tn", vol:"21.4m", pe:4.8, div:7.5, high52:138, low52:88, shariah:true,  color:"#fb923c", about:"GTCO is one of Nigeria's most profitable banks, famed for its efficiency and strong return on equity. A core holding in almost every Nigerian equity portfolio." },
  { sym:"ZENITHBANK",name:"Zenith Bank",     sector:"Banking",     price:55.20, prevClose:54.60, mcap:"₦3.5tn", vol:"32.6m", pe:3.9, div:8.1, high52:62, low52:38, shariah:true,  color:"#e11d48", about:"Zenith Bank is a Tier-1 Nigerian bank with a huge retail and corporate franchise. It consistently pays among the highest dividends on the NGX." },
  { sym:"BUACEMENT", name:"BUA Cement",      sector:"Cement",      price:96.50, prevClose:95.00, mcap:"₦7.1tn", vol:"6.4m", pe:22.1, div:2.2, high52:110, low52:60, shariah:true,  color:"#14b8a6", about:"BUA Cement is Nigeria's second-largest cement maker, with ultra-modern plants in Edo and Sokoto — a major employer across northern Nigeria." },
  { sym:"SEPLAT",    name:"Seplat Energy",   sector:"Oil & Gas",   price:4850.00, prevClose:4790.00, mcap:"₦5.0tn", vol:"0.4m", pe:11.2, div:4.5, high52:5200, low52:3200, shariah:false, color:"#0ea5e9", about:"Seplat Energy is a leading indigenous Nigerian oil and gas producer listed on both the NGX and the London Stock Exchange." },
  { sym:"ARADEL",    name:"Aradel Holdings", sector:"Oil & Gas",   price:612.00, prevClose:598.00, mcap:"₦4.8tn", vol:"1.8m", pe:13.5, div:1.9, high52:680, low52:380, shariah:false, color:"#6366f1", about:"Aradel Holdings (formerly NDEP) is an integrated energy company and one of the NGX's strongest recent performers." },
  { sym:"WAPCO",     name:"Lafarge Africa",  sector:"Cement",      price:134.50, prevClose:132.00, mcap:"₦3.2tn", vol:"5.5m", pe:18.2, div:3.4, high52:150, low52:88, shariah:false, color:"#f43f5e", about:"Lafarge Africa (WAPCO) is a leading building-materials producer, part of the global Holcim group, with plants across Nigeria." },
  { sym:"FBNH",      name:"FBN Holdings",    sector:"Banking",     price:47.90, prevClose:46.50, mcap:"₦2.3tn", vol:"44.1m", pe:4.2, div:4.0, high52:52, low52:30, shariah:false, color:"#84cc16", about:"FBN Holdings is the parent of First Bank, Nigeria's oldest bank, with a massive branch network and a deep retail deposit base." },
  { sym:"UBA",       name:"United Bank for Africa", sector:"Banking", price:40.00, prevClose:39.30, mcap:"₦2.1tn", vol:"28.8m", pe:3.6, div:6.5, high52:44, low52:24, shariah:false, color:"#facc15", about:"UBA operates in 20 African countries plus the UK, USA and France — one of the most diversified pan-African banking franchises." },
  { sym:"STANBIC",   name:"Stanbic IBTC",    sector:"Banking",     price:72.00, prevClose:71.00, mcap:"₦2.1tn", vol:"2.9m", pe:5.1, div:6.8, high52:80, low52:52, shariah:true,  color:"#06b6d4", about:"Stanbic IBTC is a member of Standard Bank Group, with strengths in corporate banking, wealth and asset management." },
  { sym:"ACCESSCORP",name:"Access Holdings", sector:"Banking",     price:24.50, prevClose:24.10, mcap:"₦1.4tn", vol:"52.3m", pe:2.9, div:7.2, high52:27, low52:16, shariah:false, color:"#a855f7", about:"Access Holdings is Nigeria's largest bank by assets after its landmark merger with Diamond Bank, with a pan-African ambition." },
  { sym:"WEMABANK",  name:"Wema Bank",       sector:"Banking",     price:12.40, prevClose:12.20, mcap:"₦1.1tn", vol:"18.2m", pe:4.4, div:3.1, high52:14, low52:7.5, shariah:false, color:"#ec4899", about:"Wema Bank pioneered ALAT, Nigeria's first fully digital bank, and is a growing Tier-2 lender with a strong fintech edge." },
  { sym:"FIDELITYBK",name:"Fidelity Bank",   sector:"Banking",     price:15.80, prevClose:15.60, mcap:"₦1.0tn", vol:"25.7m", pe:3.2, div:5.0, high52:18, low52:11, shariah:false, color:"#3b82f6", about:"Fidelity Bank is a fast-growing Nigerian commercial bank with strong retail and SME lending franchises." },
  { sym:"OANDO",     name:"Oando Plc",       sector:"Oil & Gas",   price:68.00, prevClose:66.50, mcap:"₦0.9tn", vol:"15.4m", pe:8.7, div:0.0, high52:75, low52:30, shariah:false, color:"#f97316", about:"Oando is Nigeria's leading indigenous energy group, spanning upstream, midstream and trading, and returning to profitability after restructuring." },
  { sym:"TRANSCORP", name:"Transcorp",       sector:"Conglomerate", price:52.00, prevClose:50.80, mcap:"₦0.8tn", vol:"30.1m", pe:10.2, div:2.4, high52:58, low52:24, shariah:false, color:"#22d3ee", about:"Transcorp is a diversified conglomerate with interests in power (Transcorp Power), hospitality (Transcorp Hotels) and energy." },
  { sym:"NESTLE",    name:"Nestle Nigeria",  sector:"Consumer",    price:905.00, prevClose:910.00, mcap:"₦0.7tn", vol:"0.5m", pe:28.4, div:3.8, high52:1000, low52:780, shariah:false, color:"#10b981", about:"Nestlé Nigeria is a leading food and beverage company and a consumer staple, though FX pressures have weighed on recent earnings." },
  { sym:"DANGSUGAR", name:"Dangote Sugar",   sector:"Consumer",    price:42.50, prevClose:41.80, mcap:"₦0.5tn", vol:"11.3m", pe:9.5, div:4.6, high52:48, low52:30, shariah:true,  color:"#f472b6", about:"Dangote Sugar Refinery is the country's largest sugar producer, central to the Dangote group's backward-integration strategy." },
];

// ---- Real company logos (downloaded favicons; null → styled initials) ----
const LOGOS = {
  DANGCEM:"assets/logos/DANGCEM.png", MTNN:"assets/logos/MTNN.png", BUAFOODS:"assets/logos/BUAFOODS.png",
  AIRTELAFRI:"assets/logos/AIRTELAFRI.png", GTCO:"assets/logos/GTCO.png", ZENITHBANK:"assets/logos/ZENITHBANK.png",
  BUACEMENT:"assets/logos/BUACEMENT.png", SEPLAT:"assets/logos/SEPLAT.png", WAPCO:"assets/logos/WAPCO.png",
  FBNH:"assets/logos/FBNH.png", UBA:"assets/logos/UBA.png", ACCESSCORP:"assets/logos/ACCESSCORP.png",
  WEMABANK:"assets/logos/WEMABANK.png", FIDELITYBK:"assets/logos/FIDELITYBK.png", OANDO:"assets/logos/OANDO.png",
  TRANSCORP:"assets/logos/TRANSCORP.png", NESTLE:"assets/logos/NESTLE.png", DANGSUGAR:"assets/logos/DANGSUGAR.png",
};

// ---- Generate deterministic history for each stock ----
const HISTORY = {};
const TIMEFRAMES = {
  "1D":  { points: 96,  step: 300,    label:"5m" },
  "1W":  { points: 84,  step: 3600,   label:"1h" },
  "1M":  { points: 30,  step: 86400,  label:"1d" },
  "3M":  { points: 66,  step: 86400,  label:"1d" },
  "1Y":  { points: 52,  step: 604800, label:"1w" },
};

function generateOHLC(sym){
  const s = STOCKS.find(x=>x.sym===sym);
  const rnd = mulberry32(hashSeed(sym));
  const data = {};
  const endTime = Math.floor(Date.now()/1000);
  for(const tf in TIMEFRAMES){
    const n = TIMEFRAMES[tf].points;
    const step = TIMEFRAMES[tf].step;
    const arr = [];
    const target = s.price;
    // start price: a plausible distance from current price depending on horizon
    const startBias = tf==="1D" ? 0.998 : tf==="1W" ? 0.985 : tf==="1M" ? 0.97 : tf==="3M" ? 0.90 : 0.80;
    let price = target * (startBias + rnd()*0.04);
    const volBase = tf==="1D" ? 0.0018 : tf==="1W" ? 0.004 : tf==="1M" ? 0.008 : tf==="3M" ? 0.012 : 0.016;
    // 2-3 sine waves per series to give it a realistic ebb & flow
    const waves = 2 + Math.floor(rnd()*2);
    const phases = [];
    for(let w=0; w<waves; w++) phases.push({ amp: 0.4+rnd()*0.8, freq: 0.6+rnd()*1.8, ph: rnd()*Math.PI*2 });
    for(let i=0;i<n;i++){
      const progress = i/(n-1);
      // mean-reverting drift toward the target
      const pull = (target - price) * (0.03 + progress*0.12);
      // gentle cyclical component
      let wave = 0;
      for(const w of phases) wave += Math.sin(progress*w.freq*Math.PI*2 + w.ph) * w.amp;
      wave *= price * volBase * 0.4;
      const noise = (rnd()-0.5) * price * volBase * 1.6;
      const drift = pull + wave + noise;
      const open = price;
      let close = price + drift;
      if(close <= target*0.5) close = target*0.5;
      const spread = price * volBase * (0.5 + rnd()*0.9);
      const high = Math.max(open,close) + spread*rnd();
      const low = Math.min(open,close) - spread*rnd();
      const volume = Math.round((s.vol ? parseFloat(s.vol)*1e6 : 2e6) * (0.4+rnd()*1.3));
      arr.push({ time: endTime - (n-1-i)*step, o:+open.toFixed(2), h:+high.toFixed(2), l:+low.toFixed(2), c:+close.toFixed(2), v:volume });
      price = close;
    }
    data[tf] = arr;
  }
  return data;
}
STOCKS.forEach(s => { s.logo = LOGOS[s.sym] || null; HISTORY[s.sym] = generateOHLC(s.sym); });

// ---- Live price engine ----
const PRICES = {};
STOCKS.forEach(s => { PRICES[s.sym] = s.price; });

let tickSeq = 0;
function liveTick(){
  tickSeq++;
  for(const s of STOCKS){
    const rnd = Math.random() - 0.5;
    const move = s.price * rnd * 0.0016;
    let p = PRICES[s.sym] + move;
    if(p <= s.price*0.92 || p >= s.price*1.08) p = s.price; // guard rails
    PRICES[s.sym] = p;
  }
  // update the "live" end of the 1D series occasionally
  if(tickSeq % 6 === 0){
    for(const s of STOCKS){
      const arr = HISTORY[s.sym]["1D"];
      const last = arr[arr.length-1];
      last.c = PRICES[s.sym];
      last.h = Math.max(last.h, last.c);
      last.l = Math.min(last.l, last.c);
    }
  }
}

function pctChange(sym){
  const s = STOCKS.find(x=>x.sym===sym);
  return ((PRICES[sym]-s.prevClose)/s.prevClose)*100;
}
function stockBySym(sym){ return STOCKS.find(x=>x.sym===sym); }

// ---- Formatting helpers ----
const naira = new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2,maximumFractionDigits:2});
const naira0 = new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:0,maximumFractionDigits:0});
const numFmt = new Intl.NumberFormat("en-NG");

function fmtN(v){ return naira.format(v); }
function fmtN0(v){ return naira0.format(v); }
function fmtNum(v){ return numFmt.format(v); }
function fmtPct(v, signed=true){
  const s = signed && v>0 ? "+" : "";
  return s + v.toFixed(2) + "%";
}
function compact(n){
  if(n>=1e12) return (n/1e12).toFixed(2)+"tn";
  if(n>=1e9) return (n/1e9).toFixed(2)+"bn";
  if(n>=1e6) return (n/1e6).toFixed(1)+"m";
  if(n>=1e3) return (n/1e3).toFixed(1)+"k";
  return String(Math.round(n));
}
