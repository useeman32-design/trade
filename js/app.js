/* =========================================================
   KASUWA — app.js
   Router, views, trading engine, portfolio, learning
   ========================================================= */

/* ---------------- Icons (inline feather-style SVG) ---------------- */
const ICONS = {
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  chart:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  swap:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  back:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  up:'<polyline points="7 17 17 7"/><polyline points="7 7 17 7 17 17"/>',
  down:'<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>',
  trendingUp:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  trendingDown:'<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  wallet:'<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  chevronRight:'<polyline points="9 18 15 12 9 6"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  pie:'<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
};
function icon(name){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
}
function injectIcons(root){
  (root||document).querySelectorAll("[data-icon]").forEach(el=>{
    if(!el.dataset.done){ el.innerHTML = icon(el.dataset.icon); el.dataset.done="1"; }
  });
}
function drawSpark(canvas, data, color){
  if(canvas && data) ChartEngine.drawSpark(canvas, data, color);
}
function drawSparksInView(){
  document.querySelector(".view.active").querySelectorAll("canvas.spark").forEach(c=>{
    if(c.dataset.sym) drawSpark(c, HISTORY[c.dataset.sym]["1D"], pctChange(c.dataset.sym)>=0?"#22c55e":"#f43f5e");
  });
}

/* ---------------- State ---------------- */
const LS_KEY = "kasuwa_state_v1";
const DEFAULT_STATE = { cash: 500000, positions: {}, watchlist: ["DANGCEM","GTCO","MTNN"], txns: [], completedLessons: [], onboarded: false, name: "Amina", equityHistory: [] };
let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){ const s = JSON.parse(raw); return Object.assign({}, DEFAULT_STATE, s); }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){} }

function computePortfolio(){
  let invested=0, marketValue=0, dayPnl=0, costBasis=0;
  const holdings = [];
  for(const sym in state.positions){
    const pos = state.positions[sym];
    const s = stockBySym(sym);
    const price = PRICES[sym];
    const value = pos.shares * price;
    const cost = pos.shares * pos.avgCost;
    const pnl = value - cost;
    const day = pos.shares * (price - s.prevClose);
    costBasis += cost; marketValue += value; dayPnl += day;
    holdings.push({ sym, name:s.name, sector:s.sector, color:s.color, shares:pos.shares, avgCost:pos.avgCost, price, value, pnl, pnlPct: cost>0? (pnl/cost)*100 : 0, day });
  }
  holdings.sort((a,b)=>b.value-a.value);
  const totalValue = state.cash + marketValue;
  return { cash: state.cash, invested: costBasis, marketValue, totalValue, dayPnl, totalPnl: marketValue - costBasis, holdings };
}

/* ---------------- Toasts ---------------- */
function toast(title, sub, type="success"){
  const box = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `<span class="toast ic">${icon(type==="success"?"check":"x")}</span><div><div class="tt">${title}</div>${sub?`<div class="ts">${sub}</div>`:""}</div>`;
  box.appendChild(el);
  setTimeout(()=>{ el.classList.add("out"); setTimeout(()=>el.remove(), 300); }, 3200);
}

/* ---------------- Router ---------------- */
const VIEWS = ["home","markets","trade","portfolio","learn","stock","lesson"];
let currentStock = null;

function navigate(){
  const hash = location.hash || "#/home";
  const parts = hash.replace(/^#\//,"").split("/");
  const view = parts[0] || "home";
  let arg = parts[1];
  if(!VIEWS.includes(view)) return renderView("home");
  if(view==="stock" && arg){ currentStock = arg; renderView("stock"); }
  else if(view==="lesson" && arg){ renderView("lesson", arg); }
  else renderView(view);
  highlightNav(view);
  window.scrollTo({ top: 0 });
  document.getElementById("view-"+(view==="stock"?"stock":view==="lesson"?"lesson":view)).scrollTop = 0;
}

function highlightNav(view){
  const main = ["home","markets","trade","portfolio","learn"].includes(view) ? view : "markets";
  document.querySelectorAll("[data-nav]").forEach(a=>{
    a.classList.toggle("active", a.dataset.view === main);
  });
  // keep bottom nav Trade highlighted when in stock detail? no — highlight markets for stock.
}

function renderView(view, arg){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const map = { home:"view-home", markets:"view-markets", trade:"view-trade", portfolio:"view-portfolio", learn:"view-learn", stock:"view-stock", lesson:"view-lesson" };
  const el = document.getElementById(map[view]||"view-home");
  el.classList.add("active");
  const renderers = { home:renderHome, markets:renderMarkets, trade:renderTrade, portfolio:renderPortfolio, learn:renderLearn, stock:()=>renderStock(currentStock), lesson:()=>renderLesson(arg) };
  (renderers[view]||renderHome)();
  injectIcons(el);
}

/* ---------------- Shared stock row helpers ---------------- */
function tickerBadge(s, size){
  return `<div class="ticker-badge" style="background:linear-gradient(135deg,${s.color},${s.color}aa)">${s.sym.slice(0,4)}</div>`;
}
function stockRowHTML(s, {showSector=true}={}){
  const chg = pctChange(s.sym);
  const up = chg>=0;
  return `
    <div class="stock-row" data-sym="${s.sym}">
      ${tickerBadge(s)}
      <div class="sr-info">
        <div class="sr-sym">${s.sym} ${s.sector==="Banking" && s.shariah ? '<span class="tag halal">Halal</span>':""}</div>
        <div class="sr-name">${s.name}${showSector?` · ${s.sector}`:""}</div>
      </div>
      <div class="sr-spark"><canvas class="spark" data-sym="${s.sym}"></canvas></div>
      <div class="sr-right">
        <div class="sr-price">${fmtN(PRICES[s.sym])}</div>
        <div class="sr-chg ${up?"up":"down"}">${up?"▲":"▼"} ${fmtPct(chg)}</div>
      </div>
    </div>`;
}

/* =========================================================
   HOME
   ========================================================= */
function renderHome(){
  const pf = computePortfolio();
  const gainers = [...STOCKS].sort((a,b)=>pctChange(b.sym)-pctChange(a.sym)).slice(0,5);
  const losers = [...STOCKS].sort((a,b)=>pctChange(a.sym)-pctChange(b.sym)).slice(0,5);
  const watch = state.watchlist.map(sym=>stockBySym(sym)).filter(Boolean);
  const dayUp = pf.dayPnl>=0;

  document.getElementById("view-home").innerHTML = `
    <div class="greeting">Barka da zuwa, <strong style="color:var(--text)">${state.name}</strong> 👋</div>

    <div class="balance-hero" style="margin-top:14px">
      <div style="position:relative;z-index:1">
        <div class="balance-label">${icon("wallet")} Total portfolio value</div>
        <div class="balance-value">${fmtN0(pf.totalValue)}</div>
        <div class="balance-delta ${dayUp?"up":"down"}">${dayUp?"▲":"▼"} ${fmtN0(pf.dayPnl)} today · ${fmtPct(pf.totalValue>0?(pf.totalPnl/(pf.totalValue-pf.totalPnl||1))*100:0)} all-time</div>
        <div class="balance-sub">Cash ${fmtN0(pf.cash)} · Invested ${fmtN0(pf.marketValue)}</div>
        <div class="quick-actions">
          <button class="btn btn-ghost btn-sm" data-act="deposit">${icon("plus")} Add funds</button>
          <button class="btn btn-ghost btn-sm" data-act="withdraw">${icon("minus")} Withdraw</button>
          <button class="btn btn-primary btn-sm" data-act="trade">${icon("swap")} Trade</button>
        </div>
      </div>
      <canvas class="balance-spark" id="balanceSpark"></canvas>
    </div>

    <div class="stat-strip">
      <div class="glass mini-stat"><span class="k">Day P&L</span><span class="v ${dayUp?"up":"down"}">${dayUp?"+":""}${fmtN0(pf.dayPnl)}</span></div>
      <div class="glass mini-stat"><span class="k">Positions</span><span class="v">${pf.holdings.length}</span></div>
      <div class="glass mini-stat"><span class="k">Watchlist</span><span class="v">${state.watchlist.length}</span></div>
    </div>

    <div class="section">
      <div class="section-title">NGX All-Share Index <span class="link" data-go="markets">View market →</span></div>
      <div class="card index-card">
        <div class="index-left">
          <div class="index-name">Nigerian Exchange · All-Share Index</div>
          <div class="index-value">242,243.91</div>
          <span class="pill up">${icon("trendingUp")} +0.61%</span>
        </div>
        <canvas class="index-chart" id="indexChart"></canvas>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Top gainers <span class="muted" style="font-weight:400">today</span></div>
      <div class="hscroll">
        ${gainers.map(s=>moverCard(s)).join("")}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Top losers <span class="muted" style="font-weight:400">today</span></div>
      <div class="hscroll">
        ${losers.map(s=>moverCard(s)).join("")}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Your watchlist ${watch.length?`<span class="link" data-go="markets">Manage</span>`:""}</div>
      ${watch.length ? `<div class="glass" style="padding:6px">${watch.map(s=>stockRowHTML(s)).join("")}</div>`
        : `<div class="empty glass"><div class="empty-ic">${icon("star")}</div><h4>No watchlist yet</h4><p>Star stocks you like on the Markets tab to follow them here.</p></div>`}
    </div>

    <div class="section">
      <div class="learn-hero glass">
        <img src="assets/learn.png" alt="Learn to trade" class="learn-hero-img" />
        <div class="learn-hero-text">
          <span class="tag" style="margin-bottom:10px">${icon("award")} Learn to invest</span>
          <h3 style="font-size:20px;margin:8px 0 6px">New to stocks? Start here.</h3>
          <p class="muted" style="font-size:13.5px;line-height:1.6">Free lessons on how the Nigerian stock market works — from your first share to building long-term wealth.</p>
          <button class="btn btn-primary btn-sm" style="margin-top:14px" data-go="learn">${icon("book")} Start learning</button>
        </div>
      </div>
    </div>
  `;

  drawBalanceSpark(pf);
  drawIndexChart();
  drawSparksInView();
  bindHomeActions();
}

function moverCard(s){
  const chg = pctChange(s.sym), up = chg>=0;
  return `
    <div class="mover-card card" data-sym="${s.sym}" style="cursor:pointer">
      <div class="mover-top">
        ${tickerBadge(s)}
        <div style="min-width:0"><div class="mover-sym">${s.sym}</div><div class="mover-name">${s.name}</div></div>
      </div>
      <div class="mover-price">${fmtN(PRICES[s.sym])}</div>
      <div class="mover-chg ${up?"up":"down"}">${up?"▲":"▼"} ${fmtPct(chg)}</div>
    </div>`;
}

function bindHomeActions(){
  const root = document.getElementById("view-home");
  root.querySelectorAll("[data-sym]").forEach(el=>{
    el.addEventListener("click", ()=>{ location.hash = "#/stock/" + el.dataset.sym; });
  });
  root.querySelectorAll("[data-act]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const a = el.dataset.act;
      if(a==="deposit"){ state.cash += 100000; saveState(); toast("₦100,000 added","Paper funds topped up"); renderHome(); }
      if(a==="withdraw"){ if(state.cash>=100000){ state.cash-=100000; saveState(); toast("₦100,000 withdrawn"); renderHome(); } else toast("Insufficient cash","You need at least ₦100,000 to withdraw","error"); }
      if(a==="trade"){ location.hash = "#/trade"; }
    });
  });
  root.querySelectorAll("[data-go]").forEach(el=>{
    el.addEventListener("click", ()=>{ location.hash = "#/" + el.dataset.go; });
  });
}

function drawBalanceSpark(pf){
  // deterministic equity curve ending at current total
  const rnd = mulberry32(1234 + state.equityHistory.length);
  let pts = [];
  const target = pf.totalValue;
  let v = target * 0.82;
  for(let i=0;i<40;i++){ v = v + (target-v)*0.09 + (rnd()-0.48)*target*0.02; pts.push(v); }
  pts[pts.length-1] = target;
  const c = document.getElementById("balanceSpark");
  if(c) ChartEngine.drawArea(c, pts, { color: "#34d399" });
}
function drawIndexChart(){
  const rnd = mulberry32(777);
  const pts=[]; let v=235000;
  for(let i=0;i<60;i++){ v += (rnd()-0.48)*900; pts.push(v); }
  const c = document.getElementById("indexChart");
  if(c) ChartEngine.drawArea(c, pts, { color: "#34d399" });
}

/* =========================================================
   MARKETS
   ========================================================= */
let mktSector = "All";
let mktSort = "mcap";
let mktQuery = "";
let mktHalal = false;

function renderMarkets(){
  const sectors = ["All", ...new Set(STOCKS.map(s=>s.sector))];
  let list = STOCKS.filter(s=> mktSector==="All" || s.sector===mktSector)
                    .filter(s=> !mktHalal || s.shariah)
                    .filter(s=> !mktQuery || s.name.toLowerCase().includes(mktQuery) || s.sym.toLowerCase().includes(mktQuery));
  if(mktSort==="gainers") list.sort((a,b)=>pctChange(b.sym)-pctChange(a.sym));
  if(mktSort==="losers") list.sort((a,b)=>pctChange(a.sym)-pctChange(b.sym));
  if(mktSort==="az") list.sort((a,b)=>a.name.localeCompare(b.name));

  const gainers = [...STOCKS].sort((a,b)=>pctChange(b.sym)-pctChange(a.sym)).slice(0,3);

  document.getElementById("view-markets").innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Markets</div><div class="page-sub">${STOCKS.length} Nigerian stocks · NGX</div></div>
    </div>

    <div class="g-3" style="margin-bottom:18px">
      ${gainers.map((s,i)=>`
        <div class="card" data-sym="${s.sym}" style="cursor:pointer;display:flex;align-items:center;gap:12px">
          ${tickerBadge(s)}
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:13.5px">${s.sym}</div>
            <div class="muted" style="font-size:11.5px">${s.name}</div>
          </div>
          <div class="pill up">${fmtPct(pctChange(s.sym))}</div>
        </div>`).join("")}
    </div>

    <div class="filter-row">
      <div class="hscroll" style="padding:0;flex:1;min-width:200px">
        ${sectors.map(s=>`<button class="chip ${mktSector===s?"active":""}" data-sector="${s}">${s}</button>`).join("")}
      </div>
      <div class="filter-spacer"></div>
      <select class="chip" id="mktSort" style="appearance:none;padding-right:28px">
        <option value="mcap" ${mktSort==="mcap"?"selected":""}>By market cap</option>
        <option value="gainers" ${mktSort==="gainers"?"selected":""}>Top gainers</option>
        <option value="losers" ${mktSort==="losers"?"selected":""}>Top losers</option>
        <option value="az" ${mktSort==="az"?"selected":""}>A → Z</option>
      </select>
      <button class="icon-chip ${mktHalal?"active":""}" id="mktHalalBtn">${icon("shield")} Halal only</button>
    </div>

    <div class="glass" style="padding:6px">
      <div class="markets-table-head" style="display:none"></div>
      ${list.length ? list.map(s=>stockRowHTML(s)).join("") : `<div class="empty"><div class="empty-ic">${icon("search")}</div><h4>No matches</h4><p>Try a different search or filter.</p></div>`}
    </div>
  `;
  bindMarkets();
  drawSparksInView();
}

function bindMarkets(){
  const root = document.getElementById("view-markets");
  root.querySelectorAll("[data-sym]").forEach(el=>{
    el.addEventListener("click", ()=>{ location.hash = "#/stock/" + el.dataset.sym; });
  });
  root.querySelectorAll("[data-sector]").forEach(el=>{
    el.addEventListener("click", ()=>{ mktSector = el.dataset.sector; renderMarkets(); });
  });
  document.getElementById("mktSort").addEventListener("change", e=>{ mktSort = e.target.value; renderMarkets(); });
  document.getElementById("mktHalalBtn").addEventListener("click", ()=>{ mktHalal = !mktHalal; renderMarkets(); });
}

/* =========================================================
   STOCK DETAIL
   ========================================================= */
let stockTF = "1D";
let stockMode = "line"; // line | candles

function renderStock(sym){
  const s = stockBySym(sym);
  if(!s){ location.hash = "#/markets"; return; }
  stockTF = "1D"; stockMode = "line";
  const price = PRICES[sym], chg = pctChange(sym), up = chg>=0;
  const inWatch = state.watchlist.includes(sym);
  const pos = state.positions[sym];
  const tfs = ["1D","1W","1M","3M","1Y"];

  document.getElementById("view-stock").innerHTML = `
    <button class="back-btn" data-go="markets">${icon("back")} Back to markets</button>

    <div class="stock-head" style="margin-top:10px">
      <div class="stock-ident">
        <div class="stock-logo" style="background:linear-gradient(135deg,${s.color},${s.color}88)">${s.sym.slice(0,4)}</div>
        <div>
          <div class="stock-name">${s.name}</div>
          <div class="stock-symline">${s.sym} · ${s.sector} ${s.shariah?'<span class="tag halal">${icon("shield")} Halal</span>':""}</div>
        </div>
      </div>
      <button class="icon-btn" id="watchBtn" title="Watchlist">${icon(inWatch?"star":"star")}</button>
    </div>

    <div style="margin:18px 0 4px">
      <div class="price-big ${up?"up":"down"}">${fmtN(price)}</div>
      <div class="price-chg ${up?"up":"down"}" style="display:flex;align-items:center;gap:6px">${up?"▲":"▼"} ${fmtPct(chg)} <span class="muted" style="font-weight:400">today</span></div>
      <div class="price-range">Range ${fmtN(s.low52)} – ${fmtN(s.high52)} (52w)</div>
    </div>

    <div class="section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div class="timeframes">
          ${tfs.map(t=>`<button class="tf ${stockTF===t?"active":""}" data-tf="${t}">${t}</button>`).join("")}
        </div>
        <div class="segmented sm" style="width:auto" id="chartModeSeg">
          <button class="seg ${stockMode==="line"?"active buy":""}" data-mode="line" style="padding:8px 16px">Line</button>
          <button class="seg ${stockMode==="candles"?"active buy":""}" data-mode="candles" style="padding:8px 16px">Candles</button>
        </div>
      </div>
      <div class="card chart-wrap" style="margin-top:12px;position:relative">
        <canvas class="chart-canvas" id="stockChart"></canvas>
        <canvas class="crosshair-canvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"></canvas>
        <div class="chart-tooltip" id="chartTooltip"></div>
      </div>
    </div>

    <div class="section">
      <div class="trade-buttons">
        <button class="btn btn-buy" data-trade="buy">${icon("plus")} Buy ${s.sym}</button>
        <button class="btn btn-sell" data-trade="sell">${icon("minus")} Sell ${s.sym}</button>
      </div>
      ${pos ? `<div class="muted" style="font-size:13px;margin-top:10px">You hold ${pos.shares} shares · avg ${fmtN(pos.avgCost)}</div>`:""}
    </div>

    <div class="section">
      <div class="section-title">Key statistics</div>
      <div class="stats-grid">
        ${statCell("Market cap", s.mcap)}
        ${statCell("Volume", s.vol)}
        ${statCell("P/E ratio", s.pe)}
        ${statCell("Dividend yield", s.div + "%")}
        ${statCell("52w high", fmtN(s.high52))}
        ${statCell("52w low", fmtN(s.low52))}
        ${statCell("Prev. close", fmtN(s.prevClose))}
        ${statCell("Day range", fmtN(Math.min(s.prevClose,price)) + " – " + fmtN(Math.max(s.prevClose,price)))}
      </div>
    </div>

    <div class="section">
      <div class="section-title">About ${s.name}</div>
      <p class="about-text">${s.about}</p>
    </div>
  `;

  const watchBtn = document.getElementById("watchBtn");
  watchBtn.innerHTML = icon("star");
  watchBtn.style.color = inWatch ? "var(--gold-2)" : "";
  watchBtn.querySelector("svg").style.fill = inWatch ? "var(--gold-2)" : "none";
  watchBtn.addEventListener("click", ()=>{
    if(inWatch){ state.watchlist = state.watchlist.filter(x=>x!==sym); toast("Removed from watchlist", s.name); }
    else { state.watchlist.push(sym); toast("Added to watchlist", s.name); }
    saveState(); renderStock(sym);
  });

  bindStockDetail(sym);
  drawStockChart(sym);
}

function statCell(k,v){ return `<div class="stat-cell"><span class="k">${k}</span><span class="v">${v}</span></div>`; }

function bindStockDetail(sym){
  const root = document.getElementById("view-stock");
  root.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click", ()=>location.hash="#/"+el.dataset.go));
  root.querySelectorAll("[data-tf]").forEach(el=>el.addEventListener("click", ()=>{ stockTF=el.dataset.tf; renderStock(sym); }));
  root.querySelectorAll("[data-mode]").forEach(el=>el.addEventListener("click", ()=>{ stockMode=el.dataset.mode; renderStock(sym); }));
  root.querySelectorAll("[data-trade]").forEach(el=>el.addEventListener("click", ()=>{ openTradeSheet(sym, el.dataset.trade); }));
}

function drawStockChart(sym){
  const c = document.getElementById("stockChart");
  if(!c) return;
  const data = HISTORY[sym][stockTF];
  const up = pctChange(sym)>=0;
  const color = up ? "#22c55e" : "#f43f5e";
  let meta;
  if(stockMode==="candles") meta = ChartEngine.drawCandles(c, data, {});
  else meta = ChartEngine.drawArea(c, data, { up, color });

  const tip = document.getElementById("chartTooltip");
  ChartEngine.attachCrosshair(c, tip, ()=>meta, (v,idx)=>{
    const t = TIMEFRAMES[stockTF].interval;
    return `<div style="font-weight:600">${stockMode==="candles" ? `${fmtN(v.c)}` : `${fmtN(v)}`}</div><div class="muted" style="font-size:11px">${stockMode==="candles"? `O ${fmtN(v.o)} · H ${fmtN(v.h)} · L ${fmtN(v.l)} · C ${fmtN(v.c)}`:""}</div>`;
  });
}

/* =========================================================
   TRADE VIEW + SHEET
   ========================================================= */
let tradeSel = "DANGCEM";

function renderTrade(){
  const s = stockBySym(tradeSel);
  document.getElementById("view-trade").innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Trade</div><div class="page-sub">Buy and sell NGX stocks (paper money)</div></div>
    </div>
    <div class="trade-layout">
      <div>
        <div class="search-box picker-search">${icon("search")}<input id="tradePickerSearch" placeholder="Search stocks…" value="${mktQuery}"/></div>
        <div class="glass picker-list" id="tradePickerList">${STOCKS.map(s=>pickerItemHTML(s)).join("")}</div>
      </div>
      <div class="card order-card" id="tradeOrderCard"></div>
    </div>
  `;
  renderOrderForm(document.getElementById("tradeOrderCard"), tradeSel);
  const ps = document.getElementById("tradePickerSearch");
  ps.addEventListener("input", e=>{
    const q = e.target.value.toLowerCase();
    document.getElementById("tradePickerList").innerHTML = STOCKS.filter(s=>s.name.toLowerCase().includes(q)||s.sym.toLowerCase().includes(q)).map(s=>pickerItemHTML(s)).join("") || '<div class="empty" style="padding:20px"><p>No matches</p></div>';
    bindPickerItems();
  });
  bindPickerItems();
}

function pickerItemHTML(s){
  const chg = pctChange(s.sym), up=chg>=0;
  return `<div class="picker-item ${s.sym===tradeSel?"selected":""}" data-sym="${s.sym}">
    ${tickerBadge(s)}
    <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:14px">${s.sym}</div><div class="muted" style="font-size:12px">${s.name}</div></div>
    <div style="text-align:right"><div style="font-weight:600;font-size:14px">${fmtN(PRICES[s.sym])}</div><div class="${up?"up":"down"}" style="font-size:12px;font-weight:600">${fmtPct(chg)}</div></div>
  </div>`;
}
function bindPickerItems(){
  document.querySelectorAll("#tradePickerList .picker-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      tradeSel = el.dataset.sym;
      renderTrade();
    });
  });
}

let tradeSide = "buy";
let orderType = "market";

function renderOrderForm(container, sym){
  const s = stockBySym(sym);
  const price = PRICES[sym];
  const chg = pctChange(sym);
  container.innerHTML = `
    <div class="trade-price-row" style="margin-bottom:14px">
      <span class="trade-price">${fmtN(price)}</span>
      <span class="trade-change ${chg>=0?"up":"down"}">${fmtPct(chg)}</span>
    </div>
    <div class="field">
      <div class="segmented" id="ofSide">
        <button class="seg ${tradeSide==="buy"?"active buy":""}" data-side="buy">Buy</button>
        <button class="seg ${tradeSide==="sell"?"active sell":""}" data-side="sell">Sell</button>
      </div>
    </div>
    <div class="field">
      <label>Order type</label>
      <div class="segmented sm" id="ofType">
        <button class="seg ${orderType==="market"?"active buy":""}" data-type="market">Market</button>
        <button class="seg ${orderType==="limit"?"active buy":""}" data-type="limit">Limit</button>
      </div>
    </div>
    <div class="field" id="ofLimit" ${orderType==="limit"?"":"hidden"}>
      <label>Limit price (₦)</label>
      <input type="number" class="input" id="ofLimitPrice" value="${price}" inputmode="decimal" />
    </div>
    <div class="field">
      <label>Amount (₦)</label>
      <input type="number" class="input input-lg" id="ofAmount" placeholder="0.00" inputmode="decimal" />
      <div class="quick-amounts">
        <button class="qa" data-amt="10000">₦10k</button>
        <button class="qa" data-amt="50000">₦50k</button>
        <button class="qa" data-amt="100000">₦100k</button>
        <button class="qa" data-amt="500000">₦500k</button>
        <button class="qa" data-amt="max">Max</button>
      </div>
    </div>
    <div class="trade-summary glass" id="ofSummary"></div>
    <p class="trade-error" id="ofError" hidden></p>
    <button class="btn ${tradeSide==="buy"?"btn-buy":"btn-sell"} btn-block" id="ofConfirm">${tradeSide==="buy"?"Confirm buy":"Confirm sell"}</button>
  `;
  bindOrderForm(container, sym);
  updateOrderSummary(container, sym);
}

function bindOrderForm(container, sym){
  container.querySelectorAll("#ofSide .seg").forEach(b=>b.addEventListener("click", ()=>{ tradeSide=b.dataset.side; renderOrderForm(container,sym); }));
  container.querySelectorAll("#ofType .seg").forEach(b=>b.addEventListener("click", ()=>{ orderType=b.dataset.type; renderOrderForm(container,sym); }));
  container.querySelectorAll(".qa").forEach(b=>b.addEventListener("click", ()=>{
    const amt = b.dataset.amt;
    const price = orderType==="limit" ? parseFloat(container.querySelector("#ofLimitPrice").value)||PRICES[sym] : PRICES[sym];
    let v;
    if(amt==="max") v = tradeSide==="buy" ? state.cash/(1.003) : (state.positions[sym]? state.positions[sym].shares*price : 0);
    else v = parseFloat(amt);
    container.querySelector("#ofAmount").value = Math.floor(v);
    updateOrderSummary(container, sym);
  }));
  container.querySelector("#ofAmount").addEventListener("input", ()=>updateOrderSummary(container,sym));
  const lp = container.querySelector("#ofLimitPrice");
  if(lp) lp.addEventListener("input", ()=>updateOrderSummary(container,sym));
  container.querySelector("#ofConfirm").addEventListener("click", ()=>executeOrder(container, sym));
}

function updateOrderSummary(container, sym){
  const s = stockBySym(sym);
  const amount = parseFloat(container.querySelector("#ofAmount").value) || 0;
  const price = orderType==="limit" ? (parseFloat(container.querySelector("#ofLimitPrice").value)||PRICES[sym]) : PRICES[sym];
  const fee = amount * 0.003;
  const shares = amount/price;
  const err = container.querySelector("#ofError");
  err.hidden = true;
  container.querySelector("#ofSummary").innerHTML = `
    <div class="ts-row"><span>Est. shares</span><span>${shares ? shares.toLocaleString("en-NG",{maximumFractionDigits:2}) : "—"}</span></div>
    <div class="ts-row"><span>Price per share</span><span>${fmtN(price)}</span></div>
    <div class="ts-row"><span>Fees (0.3%)</span><span>${fmtN(fee)}</span></div>
    <div class="ts-row ts-total"><span>Total</span><span>${fmtN(tradeSide==="buy"?amount+fee:amount-fee)}</span></div>
    <div class="ts-row"><span>Available cash</span><span>${fmtN(state.cash)}</span></div>
  `;
}

function executeOrder(container, sym){
  const s = stockBySym(sym);
  const amount = parseFloat(container.querySelector("#ofAmount").value) || 0;
  const price = orderType==="limit" ? (parseFloat(container.querySelector("#ofLimitPrice").value)||PRICES[sym]) : PRICES[sym];
  const fee = amount * 0.003;
  const err = container.querySelector("#ofError");

  if(!amount || amount<=0){ err.textContent = "Enter an amount to continue."; err.hidden=false; return; }
  if(tradeSide==="buy"){
    if(amount + fee > state.cash){ err.textContent = "Not enough cash. Add funds or reduce the amount."; err.hidden=false; return; }
    const pos = state.positions[sym] || { shares:0, avgCost:0 };
    const newShares = amount/price;
    const totShares = pos.shares + newShares;
    pos.avgCost = pos.shares ? (pos.shares*pos.avgCost + amount)/totShares : price;
    pos.shares = totShares;
    state.positions[sym] = pos;
    state.cash -= (amount + fee);
    state.txns.unshift({ id:Date.now(), type:"buy", sym, name:s.name, shares:newShares, price, total:amount+fee, date:Date.now() });
    saveState();
    toast(`Bought ${s.sym}`, `${newShares.toLocaleString("en-NG",{maximumFractionDigits:2})} shares @ ${fmtN(price)}`);
    afterTrade(sym);
  } else {
    const pos = state.positions[sym];
    if(!pos || pos.shares<=0){ err.textContent = "You don't hold this stock."; err.hidden=false; return; }
    const shares = amount/price;
    if(shares > pos.shares){ err.textContent = `You only hold ${pos.shares} shares.`; err.hidden=false; return; }
    pos.shares -= shares;
    if(pos.shares < 0.0001) delete state.positions[sym];
    state.cash += (amount - fee);
    state.txns.unshift({ id:Date.now(), type:"sell", sym, name:s.name, shares, price, total:amount-fee, date:Date.now() });
    saveState();
    toast(`Sold ${s.sym}`, `${shares.toLocaleString("en-NG",{maximumFractionDigits:2})} shares @ ${fmtN(price)}`);
    afterTrade(sym);
  }
  updateOrderSummary(container, sym);
  container.querySelector("#ofAmount").value = "";
  updateOrderSummary(container, sym);
}

function afterTrade(sym){
  if(!document.getElementById("tradeSheet").hidden) closeTradeSheet();
  updateSideBalance();
  // re-render current view
  const view = (location.hash||"#/home").replace(/^#\//,"").split("/")[0];
  if(view==="trade") renderTrade();
  else if(view==="portfolio") renderPortfolio();
  else if(view==="stock") renderStock(currentStock);
  else renderHome();
}

/* ---------------- Trade sheet (modal) ---------------- */
let SHEET_BODY_TEMPLATE = "";
function openTradeSheet(sym, side){
  tradeSide = side || "buy";
  orderType = "market";
  const s = stockBySym(sym);
  const sheet = document.getElementById("tradeSheet");
  const body = sheet.querySelector(".sheet-body");
  if(!SHEET_BODY_TEMPLATE) SHEET_BODY_TEMPLATE = body.innerHTML;
  document.getElementById("tradeSheetTitle").textContent = (side==="sell"?"Sell ":"Buy ") + s.sym;
  document.getElementById("tradeSheetSub").textContent = s.name + " · NGX";
  body.innerHTML = '<div class="order-holder"></div>';
  renderOrderForm(body.querySelector(".order-holder"), sym);
  sheet.hidden = false;
  sheet.querySelector(".sheet-body").scrollTop = 0;
}
function closeTradeSheet(){
  const sheet = document.getElementById("tradeSheet");
  sheet.hidden = true;
  if(SHEET_BODY_TEMPLATE) sheet.querySelector(".sheet-body").innerHTML = SHEET_BODY_TEMPLATE;
}

/* =========================================================
   PORTFOLIO
   ========================================================= */
function renderPortfolio(){
  const pf = computePortfolio();
  const dayUp = pf.dayPnl>=0, totalUp = pf.totalPnl>=0;

  document.getElementById("view-portfolio").innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Portfolio</div><div class="page-sub">Track your holdings and performance</div></div>
      <button class="btn btn-ghost btn-sm" data-act="trade">${icon("swap")} New trade</button>
    </div>

    <div class="balance-hero pf-hero">
      <div>
        <div class="balance-label">${icon("pie")} Total value</div>
        <div class="pf-total">${fmtN0(pf.totalValue)}</div>
        <div class="pf-stats">
          <div class="pf-stat"><span class="k">Day P&L</span><span class="v ${dayUp?"up":"down"}">${dayUp?"+":""}${fmtN0(pf.dayPnl)}</span></div>
          <div class="pf-stat"><span class="k">Total P&L</span><span class="v ${totalUp?"up":"down"}">${totalUp?"+":""}${fmtN0(pf.totalPnl)}</span></div>
          <div class="pf-stat"><span class="k">Cash</span><span class="v">${fmtN0(pf.cash)}</span></div>
          <div class="pf-stat"><span class="k">Invested</span><span class="v">${fmtN0(pf.marketValue)}</span></div>
        </div>
      </div>
      <canvas id="pfChart" style="width:220px;height:110px"></canvas>
    </div>

    <div class="section">
      <div class="section-title">Holdings (${pf.holdings.length})</div>
      ${pf.holdings.length ? `<div class="glass" style="padding:6px">${pf.holdings.map(h=>holdingRow(h)).join("")}</div>`
        : `<div class="empty glass"><div class="empty-ic">${icon("briefcase")}</div><h4>No positions yet</h4><p>Buy your first stock and watch your portfolio grow.</p><button class="btn btn-primary" data-act="trade">${icon("swap")} Start trading</button></div>`}
    </div>

    <div class="section">
      <div class="section-title">Recent activity</div>
      ${state.txns.length ? `<div class="glass" style="padding:6px">${state.txns.slice(0,12).map(txnRow).join("")}</div>`
        : `<div class="glass empty" style="margin-top:0"><div class="empty-ic">${icon("file")}</div><p style="margin-top:0">Your trades will appear here.</p></div>`}
    </div>
  `;
  drawPfChart(pf);
  drawSparksInView();
  document.getElementById("view-portfolio").querySelectorAll("[data-act]").forEach(el=>el.addEventListener("click", ()=>{ location.hash = "#/trade"; }));
  document.getElementById("view-portfolio").querySelectorAll("[data-sym]").forEach(el=>{
    el.addEventListener("click", ()=>{ location.hash = "#/stock/" + el.dataset.sym; });
  });
  document.getElementById("view-portfolio").querySelectorAll("[data-sell]").forEach(el=>{
    el.addEventListener("click", (e)=>{ e.stopPropagation(); openTradeSheet(el.dataset.sell, "sell"); });
  });
}

function holdingRow(h){
  const up = h.pnl>=0;
  return `<div class="holding-row" data-sym="${h.sym}" style="cursor:pointer">
    ${tickerBadge({sym:h.sym,color:h.color})}
    <div style="flex:1;min-width:0">
      <div style="font-weight:600;font-size:14px">${h.sym}</div>
      <div class="muted" style="font-size:12px">${h.shares.toLocaleString("en-NG",{maximumFractionDigits:2})} sh · avg ${fmtN(h.avgCost)}</div>
    </div>
    <canvas class="spark" data-sym="${h.sym}" style="width:70px;height:30px"></canvas>
    <div class="hr-right">
      <div style="font-weight:600;font-size:14px">${fmtN(h.value)}</div>
      <div class="hr-pnl ${up?"up":"down"}">${up?"▲":"▼"} ${fmtN(h.pnl)} (${fmtPct(h.pnlPct)})</div>
    </div>
    <button class="icon-btn-ghost" data-sell="${h.sym}" title="Sell">${icon("swap")}</button>
  </div>`;
}
function txnRow(t){
  const buy = t.type==="buy";
  const d = new Date(t.date);
  return `<div class="txn-row">
    <div class="txn-ic ${buy?"buy":"sell"}">${icon(buy?"plus":"minus")}</div>
    <div class="txn-info">
      <div class="txn-title">${buy?"Bought":"Sold"} ${t.sym} — ${t.name}</div>
      <div class="txn-date">${d.toLocaleDateString("en-NG",{day:"numeric",month:"short"})} · ${t.shares.toLocaleString("en-NG",{maximumFractionDigits:2})} sh @ ${fmtN(t.price)}</div>
    </div>
    <div style="font-weight:600;font-size:14px" class="${buy?"":"muted"}">${buy?"−":"+"}${fmtN(t.total)}</div>
  </div>`;
}
function drawPfChart(pf){
  const rnd = mulberry32(4321 + state.txns.length);
  const pts=[]; let v = pf.totalValue*0.8;
  for(let i=0;i<50;i++){ v = v + (pf.totalValue-v)*0.08 + (rnd()-0.47)*pf.totalValue*0.03; pts.push(v); }
  pts[pts.length-1] = pf.totalValue;
  const c = document.getElementById("pfChart");
  if(c) ChartEngine.drawArea(c, pts, { color: pf.totalPnl>=0?"#22c55e":"#f43f5e" });
}

/* =========================================================
   LEARN
   ========================================================= */
const LESSONS = [
  { id:"stock-market", title:"What is the Stock Market?", level:"Beginner", dur:"4 min", icon:"pie", color:"#10b981",
    desc:"Understand shares, the NGX, and why companies list on the exchange.",
    blocks:[
      {h:"A share is a slice of a company"},
      {p:"When you buy a share (also called a stock), you buy a tiny piece of a company and become a part-owner. If the company does well and grows, your slice becomes more valuable — and you may even receive a share of its profits as dividends."},
      {h:"How the Nigerian Exchange works"},
      {p:"Stocks in Nigeria are bought and sold on the Nigerian Exchange Group (NGX), headquartered in Lagos. Prices move up and down based on supply and demand: when more people want to buy a stock than sell it, the price rises."},
      {ul:["Over 150 companies are listed on the NGX","The NGX All-Share Index tracks the overall market","Trading happens weekdays, roughly 9:30am–2:30pm WAT"]},
      {key:"Think of the market like a big, organised kasuwa (market) — except instead of grains and cattle, people buy and sell ownership in companies like Dangote Cement and MTN."},
      {h:"Why companies list"},
      {p:"Companies list on the exchange to raise money for expansion. In return, they give the public a chance to own part of the business and share in its future success."},
    ]},
  { id:"buy-sell", title:"How to Buy & Sell Stocks", level:"Beginner", dur:"5 min", icon:"swap", color:"#0ea5e9",
    desc:"Brokers, CSCS accounts, and the difference between market and limit orders.",
    blocks:[
      {h:"You trade through a broker"},
      {p:"In Nigeria you can't buy shares directly from the exchange — you go through a licensed stockbroking firm, or a digital platform (app) that is partnered with a broker. Your shares are kept safe in an electronic account with the CSCS (Central Securities Clearing System)."},
      {h:"Market vs limit orders"},
      {p:"A market order buys or sells immediately at the current best price. A limit order lets you set the exact price you're willing to pay — it only executes if the market reaches that price."},
      {ul:["Market order: fastest, price may vary slightly","Limit order: more control, may not fill immediately","Both incur broker and exchange fees (often ~0.3%)"]},
      {key:"Always start with a practice (paper) account — like the one you're using right now in Kasuwa — before risking real money."},
    ]},
  { id:"charts", title:"Reading a Stock Chart", level:"Beginner", dur:"6 min", icon:"chart", color:"#f5b83d",
    desc:"Candlesticks, trends, and support & resistance explained simply.",
    blocks:[
      {h:"Candlesticks tell a story"},
      {p:"Each candlestick shows one period's price action: the open, close, high and low. A green candle means the price closed higher than it opened; a red candle means it closed lower. The 'body' shows open→close, the 'wicks' show the extremes."},
      {h:"Trends"},
      {p:"An uptrend is a series of higher highs and higher lows. A downtrend is the opposite. The trend is your friend — most beginners do better trading in the direction of the longer trend."},
      {h:"Support & resistance"},
      {p:"Support is a price level where buyers tend to step in (a 'floor'). Resistance is a level where sellers tend to step in (a 'ceiling'). Prices often bounce between these levels until something changes."},
      {key:"You don't need to predict every move. Learn to read the trend and manage risk — that beats trying to be right all the time."},
    ]},
  { id:"fundamentals", title:"Fundamental Analysis", level:"Intermediate", dur:"7 min", icon:"briefcase", color:"#22c55e",
    desc:"How to judge a company's real value with P/E, EPS, and dividends.",
    blocks:[
      {h:"Earnings per share (EPS)"},
      {p:"EPS is the company's profit divided by the number of shares. It tells you how much profit each share 'earned'. A rising EPS over time is usually a sign of a healthy business."},
      {h:"Price-to-earnings (P/E) ratio"},
      {p:"P/E compares the share price to EPS. A P/E of 5 means you're paying ₦5 for every ₦1 of profit — generally 'cheaper' than a P/E of 25. Nigerian banks often have low P/E ratios, which is why they're popular with value investors."},
      {h:"Dividend yield"},
      {p:"The dividend yield is the yearly dividend as a percentage of the price. A 7% yield means you receive ₦7 per ₦100 invested each year. Many Nigerian banks pay high, consistent dividends."},
      {ul:["Compare P/E to similar companies, not the whole market","Check if profits and revenue are growing","Watch for heavy debt, especially foreign-currency debt"]},
      {key:"Fundamentals answer 'is this a good business at a fair price?' — while charts answer 'when should I buy it?'."},
    ]},
  { id:"technical", title:"Technical Analysis Basics", level:"Intermediate", dur:"8 min", icon:"trendingUp", color:"#8b5cf6",
    desc:"Moving averages, volume, and spotting momentum in the market.",
    blocks:[
      {h:"Moving averages"},
      {p:"A moving average smooths out price over a number of days (e.g. 20 or 50 days). When the price is above its moving average, the trend is considered healthy; below, it's weak. Crossovers of short and long averages are common buy/sell signals."},
      {h:"Volume confirms moves"},
      {p:"Volume is how many shares traded. A price move on high volume is more meaningful than one on low volume — it shows real conviction. Watch for breakouts on rising volume."},
      {ul:["Price above 20-day average: bullish bias","Price below 20-day average: caution","Rising volume + rising price = strong trend"]},
      {key:"Indicators are tools, not crystal balls. Use them to tilt the odds in your favour and to set clear entry and exit rules."},
    ]},
  { id:"risk", title:"Risk Management", level:"Essential", dur:"5 min", icon:"shield", color:"#f43f5e",
    desc:"Protect your capital — position sizing, diversification, and stop-losses.",
    blocks:[
      {h:"Never risk money you can't afford to lose"},
      {p:"The stock market can fall, and falls can be sharp. Only invest money you won't need for years, and never borrow to trade. This single rule saves more investors than any strategy."},
      {h:"Position sizing"},
      {p:"Don't put everything into one stock. A common rule is to risk no more than 1–2% of your capital on any single trade, and to spread your money across different companies and sectors."},
      {h:"Diversification"},
      {p:"Holding 8–15 different stocks across sectors (banks, cement, telecoms, consumer) reduces the damage if one company stumbles. It's the closest thing to a free lunch in investing."},
      {ul:["Risk 1–2% per trade","Spread across sectors","Have a plan for when to exit"]},
      {key:"In the market, survival comes first. Protecting your capital lets you stay in the game long enough for compounding to work its magic."},
    ]},
  { id:"long-term", title:"Building a Long-term Portfolio", level:"Intermediate", dur:"6 min", icon:"target", color:"#14b8a6",
    desc:"Dollar-cost averaging, compounding, and thinking in years not days.",
    blocks:[
      {h:"Invest regularly, not perfectly"},
      {p:"Dollar-cost averaging (DCA) means investing a fixed amount on a schedule — e.g. ₦50,000 every month — regardless of price. You buy more shares when prices are low and fewer when they're high, smoothing out your average cost."},
      {h:"The power of compounding"},
      {p:"Reinvest your dividends and let your profits earn their own profits. Over 10–20 years, compounding can turn modest, steady investing into real wealth. Time in the market beats timing the market."},
      {ul:["Set a monthly amount and stick to it","Reinvest dividends automatically","Rebalance once or twice a year"]},
      {key:"The best investors aren't the smartest — they're the most patient. Great portfolios are built over decades, not days."},
    ]},
  { id:"shariah", title:"Shariah-Compliant Investing", level:"Essential", dur:"5 min", icon:"shield", color:"#facc15",
    desc:"Investing that aligns with Islamic principles — halal stocks and avoiding riba.",
    blocks:[
      {h:"What makes investing halal?"},
      {p:"Islamic finance encourages investing and profit-sharing, but prohibits riba (interest), excessive uncertainty, and businesses that deal in haram activities such as alcohol, gambling, or conventional interest-based banking."},
      {h:"Shariah screening"},
      {p:"A stock is 'Shariah-compliant' if the company's main business is halal and its interest-bearing debt and interest income stay below set thresholds. In Nigeria, the NGX has a dedicated Lotus Islamic Index tracking compliant stocks — and funds like the Lotus Halal Equity ETF let you invest in a basket of screened stocks at once."},
      {ul:["Avoid interest-based banks and lenders","Avoid alcohol, gambling, and pork-related businesses","Look for the Lotus Islamic Index on the NGX"]},
      {key:"On Kasuwa, look for the gold 'Halal' tag — those stocks pass a simplified Shariah screen so you can invest with peace of mind."},
    ]},
];

function renderLearn(){
  const done = state.completedLessons.length;
  const pct = Math.round((done/LESSONS.length)*100);
  document.getElementById("view-learn").innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Learn</div><div class="page-sub">Free courses to grow your investing knowledge</div></div>
    </div>

    <div class="learn-hero glass">
      <img src="assets/learn.png" alt="Learn" class="learn-hero-img" />
      <div class="learn-hero-text">
        <span class="tag">${icon("award")} Kasuwa Academy</span>
        <h3 style="font-size:22px;margin:10px 0 6px">Master the Nigerian stock market</h3>
        <p class="muted" style="font-size:14px;line-height:1.6">Short, practical lessons — from your first share to long-term wealth. No jargon, no hype.</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="muted" style="font-size:12.5px;margin-top:8px">${done}/${LESSONS.length} lessons completed · ${pct}%</div>
      </div>
    </div>

    <div class="section">
      <div class="lesson-grid">
        ${LESSONS.map((l,i)=>lessonCard(l,i)).join("")}
      </div>
    </div>
  `;
  document.getElementById("view-learn").querySelectorAll("[data-lesson]").forEach(el=>{
    el.addEventListener("click", ()=>{ location.hash = "#/lesson/" + el.dataset.lesson; });
  });
}

function lessonCard(l, i){
  const done = state.completedLessons.includes(l.id);
  const gradient = `linear-gradient(135deg, ${l.color}33, ${l.color}11)`;
  return `<div class="lesson-card card" data-lesson="${l.id}">
    <div class="lesson-thumb" style="background:${gradient}">
      <div class="lt-bg" style="background:radial-gradient(circle at 80% 20%, ${l.color}55, transparent 60%)"></div>
      <div class="lt-num" style="color:${l.color}">${icon(l.icon)}</div>
    </div>
    <div class="lesson-body">
      <div class="lesson-meta"><span class="tag">${l.level}</span><span class="tag">${icon("clock")} ${l.dur}</span>${done?'<span class="lesson-done">'+icon("checkCircle")+' Done</span>':""}</div>
      <div class="lesson-title">${l.title}</div>
      <div class="lesson-desc">${l.desc}</div>
      <div style="display:flex;align-items:center;gap:5px;color:var(--green-2);font-weight:600;font-size:13px">${done?"Review lesson":"Start lesson"} ${icon("chevronRight")}</div>
    </div>
  </div>`;
}

function renderLesson(id){
  const l = LESSONS.find(x=>x.id===id);
  if(!l){ location.hash="#/learn"; return; }
  const done = state.completedLessons.includes(id);
  const idx = LESSONS.findIndex(x=>x.id===id);
  const next = LESSONS[idx+1];

  document.getElementById("view-lesson").innerHTML = `
    <div class="lesson-content">
      <button class="back-btn" data-go="learn">${icon("back")} All lessons</button>
      <div class="lesson-cover" style="margin-top:12px;background:linear-gradient(135deg,${l.color}33,#0a1020)">
        <div class="cover-veil"></div>
        <div class="cover-tag">${l.title}</div>
      </div>
      <div class="lesson-meta" style="margin-bottom:6px"><span class="tag">${l.level}</span><span class="tag">${icon("clock")} ${l.dur} read</span>${done?'<span class="lesson-done">'+icon("checkCircle")+' Completed</span>':""}</div>
      <div class="prose">
        ${l.blocks.map(b=>{
          if(b.h) return `<h3>${b.h}</h3>`;
          if(b.p) return `<p>${b.p}</p>`;
          if(b.ul) return `<ul>${b.ul.map(x=>`<li>${x}</li>`).join("")}</ul>`;
          if(b.key) return `<div class="keypoint">${b.key}</div>`;
          return "";
        }).join("")}
      </div>
      <button class="btn ${done?"btn-ghost":"btn-primary"} btn-block" id="completeLesson" style="margin-top:8px">${icon(done?"checkCircle":"check")} ${done?"Mark as not completed":"Mark as completed"}</button>
      ${next?`<button class="btn btn-ghost btn-block" data-go="lesson:${next.id}" style="margin-top:10px">Next: ${next.title} ${icon("chevronRight")}</button>`:""}
    </div>
  `;
  document.getElementById("completeLesson").addEventListener("click", ()=>{
    if(state.completedLessons.includes(id)) state.completedLessons = state.completedLessons.filter(x=>x!==id);
    else state.completedLessons.push(id);
    saveState(); renderLesson(id);
    toast(done?"Marked as not completed":"Lesson completed 🎉", l.title);
  });
  document.getElementById("view-lesson").querySelectorAll("[data-go]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const g = el.dataset.go;
      if(g.startsWith("lesson:")) location.hash = "#/lesson/" + g.slice(7);
      else location.hash = "#/" + g;
    });
  });
}

/* =========================================================
   START FLOW (splash → onboarding slides → auth mock)
   ========================================================= */
function setupStartFlow(){
  const flow = document.getElementById("startFlow");
  const steps = flow.querySelectorAll(".sf-step");
  let slideIndex = 0;
  const slides = document.getElementById("sfSlides");
  const dots = document.getElementById("sfDots");

  function showStep(name){
    steps.forEach(s=>{ s.hidden = (s.dataset.step !== name); });
    if(name==="onboard") buildDots();
  }
  function buildDots(){
    const n = slides.children.length;
    dots.innerHTML = "";
    for(let i=0;i<n;i++){
      const d = document.createElement("span");
      d.className = "sf-dot" + (i===slideIndex?" active":"");
      dots.appendChild(d);
    }
  }
  function setSlide(i){
    slideIndex = Math.max(0, Math.min(i, slides.children.length-1));
    slides.scrollTo({ left: slideIndex * slides.clientWidth, behavior: "smooth" });
    updateDots();
    const next = document.getElementById("sfNext");
    next.textContent = (slideIndex === slides.children.length-1) ? "Get started" : "Next";
  }
  function updateDots(){
    [...dots.children].forEach((d,i)=>d.classList.toggle("active", i===slideIndex));
  }

  function enterApp(){
    state.onboarded = true; saveState();
    flow.hidden = true;
    toast("Welcome to Kasuwa 👋", "You're using a ₦500,000 demo account");
  }

  if(!state.onboarded){
    flow.hidden = false;
    showStep("splash");
  } else {
    flow.hidden = true;
  }

  // Splash
  document.getElementById("sfContinue").addEventListener("click", ()=>{ showStep("onboard"); setSlide(0); });
  document.getElementById("sfToLogin").addEventListener("click", ()=>{ showStep("auth"); setAuthMode("login"); });

  // Onboarding
  document.getElementById("sfSkip1").addEventListener("click", enterApp);
  document.getElementById("sfNext").addEventListener("click", ()=>{
    if(slideIndex >= slides.children.length-1){ showStep("auth"); setAuthMode("login"); }
    else setSlide(slideIndex+1);
  });
  slides.addEventListener("scroll", ()=>{
    const i = Math.round(slides.scrollLeft / slides.clientWidth);
    if(i !== slideIndex){ slideIndex = i; updateDots(); const next=document.getElementById("sfNext"); next.textContent = (i===slides.children.length-1)?"Get started":"Next"; }
  }, { passive:true });

  // Auth
  document.getElementById("sfSkip2").addEventListener("click", enterApp);
  document.getElementById("sfTabs").querySelectorAll(".sf-tab").forEach(t=>{
    t.addEventListener("click", ()=>setAuthMode(t.dataset.tab));
  });
  document.getElementById("sfEye").addEventListener("click", ()=>{
    const pw = document.getElementById("sfPassword");
    const eye = document.getElementById("sfEye");
    const show = pw.type === "password";
    pw.type = show ? "text" : "password";
    eye.textContent = show ? "🙈" : "👁";
  });
  document.getElementById("sfForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    toast("Auth coming soon 🔒", "This is a design preview — logging you in as a guest.");
    enterApp();
  });
  document.querySelectorAll(".sf-social-btn").forEach(b=>{
    b.addEventListener("click", ()=>{
      toast(b.dataset.provider + " login", "Social sign-in isn't wired up yet (demo)");
    });
  });

  function setAuthMode(mode){
    const login = mode === "login";
    document.querySelectorAll("#sfTabs .sf-tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===mode));
    document.getElementById("sfAuthTitle").textContent = login ? "Welcome back" : "Create your account";
    document.getElementById("sfAuthSub").textContent = login ? "Log in to continue trading" : "Start your investing journey";
    document.getElementById("sfNameField").hidden = login;
    document.getElementById("sfForgot").style.display = login ? "block" : "none";
    document.getElementById("sfSubmit").textContent = login ? "Log in" : "Create account";
  }
}

/* =========================================================
   Global search + tick loop + init
   ========================================================= */
function setupGlobalSearch(){
  const input = document.getElementById("globalSearch");
  let dd = null;
  input.addEventListener("input", ()=>{
    const q = input.value.toLowerCase().trim();
    if(!dd){
      dd = document.createElement("div");
      dd.className = "search-dropdown glass-strong";
      dd.style.cssText = "position:absolute;top:52px;left:0;right:0;z-index:90;border-radius:14px;padding:6px;max-height:340px;overflow-y:auto;display:none";
      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(dd);
    }
    if(!q){ dd.style.display="none"; return; }
    const matches = STOCKS.filter(s=>s.name.toLowerCase().includes(q)||s.sym.toLowerCase().includes(q)).slice(0,8);
    dd.innerHTML = matches.length ? matches.map(s=>`
      <div class="picker-item" data-sym="${s.sym}" style="border-radius:10px">
        ${tickerBadge(s)}<div style="flex:1"><div style="font-weight:600;font-size:13.5px">${s.sym}</div><div class="muted" style="font-size:12px">${s.name}</div></div>
        <div style="text-align:right"><div style="font-weight:600;font-size:13.5px">${fmtN(PRICES[s.sym])}</div></div>
      </div>`).join("") : '<div class="muted" style="padding:14px;text-align:center;font-size:13px">No stocks found</div>';
    dd.style.display = "block";
    dd.querySelectorAll("[data-sym]").forEach(el=>el.addEventListener("click", ()=>{ input.value=""; dd.style.display="none"; location.hash="#/stock/"+el.dataset.sym; }));
  });
  input.addEventListener("blur", ()=>{ setTimeout(()=>{ if(dd) dd.style.display="none"; }, 150); });
}

function updateSideBalance(){
  const pf = computePortfolio();
  document.getElementById("sideBalance").textContent = fmtN0(pf.totalValue);
}

function tickLoop(){
  liveTick();
  updateSideBalance();
  const view = (location.hash||"#/home").replace(/^#\//,"").split("/")[0];
  // gentle periodic refresh so prices feel live without disrupting scroll/focus
  if(tickSeq % 10 === 0){
    if(view==="markets") renderMarkets();
    else if(view==="portfolio") renderPortfolio();
    else if(view==="home") renderHome();
  }
  if(view==="stock" && currentStock) drawStockChart(currentStock);
}

function init(){
  injectIcons(document);

  // start flow (splash → onboarding → auth)
  setupStartFlow();

  // trade sheet
  document.getElementById("tradeSheetClose").addEventListener("click", closeTradeSheet);
  document.getElementById("tradeSheet").addEventListener("click", e=>{ if(e.target.id==="tradeSheet") closeTradeSheet(); });

  // nav
  document.querySelectorAll("[data-nav]").forEach(a=>a.addEventListener("click", ()=>{ /* hash change triggers navigate */ }));

  // notifications
  document.getElementById("notifBtn").addEventListener("click", ()=>{
    toast("Market update", "NGX All-Share Index +0.61% today. 17 gainers vs 38 losers.");
  });

  setupGlobalSearch();
  updateSideBalance();

  window.addEventListener("hashchange", navigate);
  navigate();

  setInterval(tickLoop, 3000);
}

document.addEventListener("DOMContentLoaded", init);
