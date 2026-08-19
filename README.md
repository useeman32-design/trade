# Kasuwa 📈 — Nigerian Stock Trading App

**Kasuwa** ("market" in Hausa) is a modern, mobile-first stock trading app built for Nigeria — with special love for the North. Trade NGX stocks, track your portfolio, and learn how to invest, all in a sleek glassmorphism interface.

> ⚠️ **Demo / paper-trading only.** Prices are indicative and simulated. No real money is involved.

## ✨ Features

- 📊 **Live market** — 20 real Nigerian stocks (Dangote Cement, MTN, GTCO, Zenith, BUA Foods, Seplat…), with an NGX All-Share Index ticker
- 📈 **Interactive charts** — area/line and **candlestick** charts across 1D / 1W / 1M / 3M / 1Y timeframes, with a crosshair tooltip (custom canvas engine, zero dependencies)
- 💸 **Trading** — buy & sell with market/limit orders, fee calculation, and instant P&L
- 💼 **Portfolio** — live holdings, day & total P&L, transaction history, performance chart (persists in `localStorage`)
- ⭐ **Watchlist** — star stocks to follow them from Home
- 🕌 **Shariah-compliant filter** — a gold "Halal" tag + a "Halal only" filter (a thoughtful touch for Northern Nigeria)
- 🎓 **Kasuwa Academy** — 8 free lessons (what is the stock market, charts, fundamental & technical analysis, risk management, long-term investing, and Shariah-compliant investing)
- 📱 **Mobile-first** — bottom navigation with a raised Trade button, glassy cards, and full desktop support (sidebar layout)
- 🖼️ **AI-generated brand assets** — logo, hero mockup, and learning illustration

## 🛠 Tech

Pure **HTML + CSS + vanilla JavaScript** — no frameworks, no build step, no chart libraries. Charts are drawn on `<canvas>`.

```
kasuwa/
├── index.html
├── css/styles.css
├── js/
│   ├── data.js      # stocks + price engine
│   ├── charts.js    # canvas chart engine
│   └── app.js       # router, views, trading, learning
└── assets/          # logo, hero, learn images
```

## 🚀 Run locally

Any static server works:

```bash
cd kasuwa
python3 -m http.server 8080
# open http://localhost:8080
```

## 🌍 Deploy to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys on every push to `main`.

```bash
# one-time setup
git remote add origin https://github.com/<your-username>/<repo-name>.git

# deploy
git push -u origin main
```

Then in the repo: **Settings → Pages → Source → GitHub Actions**. Done — your app is live at `https://<your-username>.github.io/<repo-name>/`.
