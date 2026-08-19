/* =========================================================
   KASUWA — charts.js
   Lightweight canvas chart engine (line/area, candlestick, sparkline)
   ========================================================= */

const ChartEngine = (() => {

  function setupCanvas(canvas){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(10, Math.round(rect.width));
    const h = Math.max(10, Math.round(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return { ctx, w, h };
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function niceMinMax(min,max){
    const pad = (max-min)*0.08 || max*0.05 || 1;
    return { min: min-pad, max: max+pad };
  }

  // ---- Area/line chart with gradient ----
  function drawArea(canvas, data, opts={}){
    const { ctx, w, h } = setupCanvas(canvas);
    const up = opts.up !== false;
    const color = opts.color || (up ? "#22c55e" : "#f43f5e");
    const values = data.map(d => typeof d === "object" ? d.c : d);
    if(values.length < 2) return;
    const { min, max } = niceMinMax(Math.min(...values), Math.max(...values));
    const padL = 0, padR = 0, padT = 6, padB = 6;
    const plotW = w - padL - padR, plotH = h - padT - padB;
    const x = i => padL + (i/(values.length-1))*plotW;
    const y = v => padT + (1 - (v-min)/(max-min))*plotH;

    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,.05)";
    ctx.lineWidth = 1;
    for(let g=0; g<=3; g++){
      const gy = padT + (g/3)*plotH;
      ctx.beginPath(); ctx.moveTo(padL,gy); ctx.lineTo(w,gy); ctx.stroke();
    }

    // area fill
    const grad = ctx.createLinearGradient(0,padT,0,h);
    grad.addColorStop(0, hexA(color,.28));
    grad.addColorStop(1, hexA(color,0));
    ctx.beginPath();
    ctx.moveTo(x(0), y(values[0]));
    for(let i=1;i<values.length;i++) ctx.lineTo(x(i), y(values[i]));
    ctx.lineTo(x(values.length-1), h);
    ctx.lineTo(x(0), h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(x(0), y(values[0]));
    for(let i=1;i<values.length;i++) ctx.lineTo(x(i), y(values[i]));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // end dot
    ctx.beginPath();
    ctx.arc(x(values.length-1), y(values[values.length-1]), 3.5, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    ctx.beginPath();
    ctx.arc(x(values.length-1), y(values[values.length-1]), 6.5, 0, Math.PI*2);
    ctx.strokeStyle = hexA(color,.35); ctx.lineWidth = 2; ctx.stroke();

    return { min, max, x, y, values, plotW, plotT: padT, plotH };
  }

  // ---- Candlestick chart ----
  function drawCandles(canvas, data, opts={}){
    const { ctx, w, h } = setupCanvas(canvas);
    const upColor = "#22c55e", downColor = "#f43f5e";
    const highs = data.map(d=>d.h), lows = data.map(d=>d.l);
    const { min, max } = niceMinMax(Math.min(...lows), Math.max(...highs));
    const padL=0, padR=0, padT=10, padB=6;
    const plotW = w-padL-padR, plotH = h-padT-padB;
    const slot = plotW/data.length;
    const x = i => padL + slot*i + slot/2;
    const y = v => padT + (1-(v-min)/(max-min))*plotH;

    ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1;
    for(let g=0; g<=3; g++){
      const gy = padT + (g/3)*plotH;
      ctx.beginPath(); ctx.moveTo(padL,gy); ctx.lineTo(w,gy); ctx.stroke();
    }

    const bodyW = Math.max(2, Math.min(9, slot*0.62));
    data.forEach((d,i)=>{
      const up = d.c >= d.o;
      const color = up ? upColor : downColor;
      const cx = x(i);
      // wick
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, y(d.h)); ctx.lineTo(cx, y(d.l)); ctx.stroke();
      // body
      const top = y(Math.max(d.o,d.c)), bot = y(Math.min(d.o,d.c));
      const bh = Math.max(1, bot-top);
      ctx.fillStyle = up ? color : hexA(color,.85);
      ctx.beginPath();
      if(up){ ctx.rect(cx-bodyW/2, top, bodyW, bh); }
      else { roundRect(ctx, cx-bodyW/2, top, bodyW, bh, 1); }
      ctx.fill();
    });
    return { min, max, x, y, data, plotW, plotT: padT, plotH, slot };
  }

  // ---- Sparkline (compact, no axes) ----
  function drawSpark(canvas, data, color){
    const { ctx, w, h } = setupCanvas(canvas);
    const values = data.map(d => typeof d === "object" ? d.c : d);
    if(values.length < 2) return;
    const mn = Math.min(...values), mx = Math.max(...values);
    const rng = (mx-mn)||1;
    const x = i => (i/(values.length-1))*w;
    const y = v => h-2 - ((v-mn)/rng)*(h-4);
    ctx.beginPath();
    ctx.moveTo(x(0), y(values[0]));
    for(let i=1;i<values.length;i++) ctx.lineTo(x(i), y(values[i]));
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineJoin="round"; ctx.lineCap="round";
    ctx.stroke();
  }

  // ---- Crosshair overlay for detail charts ----
  function attachCrosshair(canvas, tooltipEl, getMeta, fmt){
    if(!canvas || !tooltipEl) return;
    const wrap = canvas.parentElement;
    canvas.addEventListener("mousemove", e=>{
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const m = getMeta();
      if(!m) return;
      const idx = Math.round(((px)/m.plotW)*(m.values.length-1));
      if(idx<0 || idx>=m.values.length) return;
      const cx = m.x(idx);
      // draw crosshair via overlay canvas
      const ov = wrap.querySelector(".crosshair-canvas");
      if(ov){
        const { ctx, w, h } = setupCanvas(ov);
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,h); ctx.stroke();
        ctx.setLineDash([]);
      }
      const v = m.values[idx];
      const c = v.c ?? v;
      tooltipEl.style.display = "block";
      tooltipEl.innerHTML = fmt(c, idx);
      const tw = tooltipEl.offsetWidth;
      let lx = cx + 12; if(lx + tw > rect.width) lx = cx - tw - 12;
      tooltipEl.style.left = lx + "px";
      tooltipEl.style.top = "8px";
    });
    canvas.addEventListener("mouseleave", ()=>{
      tooltipEl.style.display = "none";
      const ov = wrap.querySelector(".crosshair-canvas");
      if(ov){ const { ctx, w, h } = setupCanvas(ov); ctx.clearRect(0,0,w,h); }
    });
  }

  function hexA(hex, a){
    const h = hex.replace("#","");
    const r=parseInt(h.substring(0,2),16), g=parseInt(h.substring(2,4),16), b=parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ---- TradingView Lightweight Charts (professional main chart) ----
  let _lwChart = null, _lwSeries = null, _lwVolSeries = null, _lwMode = null;
  function destroyMainChart(){
    if(_lwChart){ try{ _lwChart.remove(); }catch(e){} _lwChart = null; }
    _lwSeries = null; _lwVolSeries = null; _lwMode = null;
  }
  function isLight(){ return document.body.classList.contains("light"); }

  function drawMainChart(container, data, mode){
    const LC = window.LightweightCharts;
    if(!LC){ return null; } // library not loaded
    destroyMainChart();
    container.innerHTML = "";
    const light = isLight();
    const chart = LC.createChart(container, {
      height: 360,
      layout: { background:{ type:'solid', color:'transparent' }, textColor: light?'#5a6a85':'#93a0b4', fontSize:11, fontFamily:'Inter, sans-serif' },
      grid: { vertLines:{ color: light?'rgba(15,23,42,0.05)':'rgba(255,255,255,0.04)' }, horzLines:{ color: light?'rgba(15,23,42,0.05)':'rgba(255,255,255,0.04)' } },
      crosshair: { mode: LC.CrosshairMode.Normal, vertLine:{ labelBackgroundColor:'#10b981' }, horzLine:{ labelBackgroundColor:'#10b981' } },
      rightPriceScale: { borderColor: light?'rgba(15,23,42,0.12)':'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: light?'rgba(15,23,42,0.12)':'rgba(255,255,255,0.1)', timeVisible:true, secondsVisible:false, rightOffset:2 },
      handleScroll: { vertTouchDrag:false, horzTouchDrag:true },
      handleScale: true,
    });
    _lwChart = chart;

    const seriesOpts = { priceFormat:{ type:'price', precision:2, minMove:0.01 } };
    if(mode === "candles"){
      const cs = chart.addCandlestickSeries(Object.assign({
        upColor:'#22c55e', downColor:'#f43f5e', borderUpColor:'#22c55e', borderDownColor:'#f43f5e',
        wickUpColor:'#22c55e', wickDownColor:'#f43f5e'
      }, seriesOpts));
      cs.setData(data.map(d=>({ time:d.time, open:d.o, high:d.h, low:d.l, close:d.c })));
      _lwSeries = cs;
    } else {
      const as = chart.addAreaSeries(Object.assign({
        lineColor:'#22c55e', topColor:'rgba(34,197,94,0.28)', bottomColor:'rgba(34,197,94,0)',
        lineWidth:2
      }, seriesOpts));
      as.setData(data.map(d=>({ time:d.time, value:d.c })));
      _lwSeries = as;
    }

    // volume histogram on a compressed bottom scale
    const vol = chart.addHistogramSeries({ priceFormat:{ type:'volume' }, priceScaleId:'' });
    vol.priceScale().applyOptions({ scaleMargins:{ top:0.82, bottom:0 } });
    vol.setData(data.map(d=>({
      time:d.time, value:d.v,
      color: d.c>=d.o ? (light?'rgba(22,163,74,0.30)':'rgba(34,197,94,0.32)') : (light?'rgba(225,29,72,0.30)':'rgba(244,63,94,0.32)')
    })));
    _lwVolSeries = vol;
    _lwMode = mode;

    chart.timeScale().fitContent();
    return chart;
  }

  // update the last bar in-place (live tick) instead of rebuilding
  function updateLastBar(d){
    if(!_lwSeries || !d) return;
    if(_lwMode === "candles"){
      _lwSeries.update({ time:d.time, open:d.o, high:d.h, low:d.l, close:d.c });
    } else {
      _lwSeries.update({ time:d.time, value:d.c });
    }
    if(_lwVolSeries){
      _lwVolSeries.update({ time:d.time, value:d.v, color: d.c>=d.o ? 'rgba(34,197,94,0.32)' : 'rgba(244,63,94,0.32)' });
    }
  }

  return { drawArea, drawCandles, drawSpark, attachCrosshair, setupCanvas, hexA, drawMainChart, destroyMainChart, updateLastBar };
})();
