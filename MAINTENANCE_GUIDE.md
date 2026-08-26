# 🌟 Star Plus Travel & Tourism LLC - Website Maintenance & Deployment Guide

Welcome to the maintenance and deployment manual for the official Star Plus Travel & Tourism LLC website. This guide provides quick, clear instructions on making future text/image edits and deploying updates live automatically.

---

## 🚀 1. Continuous Deployment Setup (Auto-Deploy)

This codebase is pre-configured with continuous deployment pipelines for all major hosting platforms:

### Option A: Vercel (Recommended - Fastest & Easiest)
1. Push this folder to a GitHub / GitLab repository.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"** -> **"Import Git Repository"**.
3. Select your repository and click **"Deploy"** (Vercel automatically reads `vercel.json`).
4. **Result**: Every time you push a change to your repository, Vercel rebuilds and deploys the live site in under 15 seconds with global edge CDN and automatic SSL!

### Option B: Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Netlify will detect `netlify.toml` and `_redirects` automatically.
3. Click **"Deploy Site"**.

### Option C: GitHub Pages (Free via GitHub Actions)
1. In your GitHub repository, go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, choose **GitHub Actions**.
3. The pre-configured `.github/workflows/deploy.yml` workflow will automatically deploy your website upon every `git push`.

---

## 📝 2. How to Edit Website Text & Content

### A. Updating Tour Packages & Pricing
All tour package information is centralized in [`js/app.js`](js/app.js) inside the `PACKAGES` array (lines 17–200):
```javascript
{
  id: 'dubai-luxury',
  title: 'Ultimate Dubai & Desert Safari Extravaganza',
  destination: 'Dubai, UAE',
  priceAED: 2450,           // Change base price here
  originalPriceAED: 3100,   // Change strike-through price
  duration: '5 Days / 4 Nights',
  perks: [
    '5★ Luxury Hotel Stay',
    'VIP Desert Safari & BBQ'
  ],
  // ...
}
```
> **Note**: Base currency is **AED**. The live currency switcher (USD, EUR, GBP, LKR) automatically calculates foreign exchange rates in real-time from this base value.

### B. Updating Contact Details & Regional Emails
- **UAE Office / HR Desk**: `info@starplustraveluae.com`
- **Sri Lanka Office / HR Desk**: `info@starplustravelsl.com`
- To update phone numbers or physical addresses, search for `+971 45 751 321` (UAE) or `+94 70 467 6900` (Sri Lanka) in [`index.html`](index.html) and [`careers.html`](careers.html).

### C. Updating Visa Services & Processing Fees
All visa details are located in [`js/app.js`](js/app.js) inside the `VISA_DATA` object (lines 205–300):
```javascript
uae_30: {
  title: '30-Day UAE Tourist Visa (Single Entry)',
  time: '24 - 48 Hours Express',
  priceAED: 350,
  docs: ['Color passport bio-page scan', 'Passport photo with white background']
}
```

### D. Adding / Editing Job Openings on the Careers Page
Open [`careers.html`](careers.html) and find the `<div id="jobGrid">` section. You can edit any existing job card or duplicate one to post a new job vacancy. Ensure the `openApplyModal()` button passes the correct regional target (`'uae'`, `'sl'`, or `'both'`).

---

## 🖼️ 3. How to Update Images, Logos & Video

| Asset Type | Location / How to Change |
|---|---|
| **Header / Brand Logo** | Replace [`assets/logo-white-text.png`](assets/logo-white-text.png) (dark mode) and [`assets/original-removebg-preview.png`](assets/original-removebg-preview.png) (light mode). |
| **Browser Favicon** | Replace [`assets/favicon.ico`](assets/favicon.ico) or [`assets/favicon.svg`](assets/favicon.svg). |
| **Client / Corporate Logos** | Place new client transparent PNG files into the [`assets/clients/`](assets/clients/) folder. |
| **Tour Package Photos** | In [`js/app.js`](js/app.js), update the `image: 'https://...'` property on any package card with your new photo URL or local path (`assets/tours/my-tour.jpg`). |
| **Hero Background Video** | In [`index.html`](index.html), locate the `<video>` element (around line 270) and update the `src` attribute. |

---

## 🎨 4. Seasonal Theme Manager (Automatic Calendar Windows)

The website automatically enables celebratory animations during holiday periods and reverts cleanly when they pass:
1. **✨ New Year** (Dec 31 – Jan 5) -> Fireworks & Sparkles
2. **🌹 Valentine's Day** (Feb 10 – Feb 16) -> Floating Rose Petals
3. **🌙 Ramadan** (Islamic Month 9: Dynamic Hijri Date) -> Golden Lanterns & Crescents
4. **✨ Eid Mubarak** (Islamic Shawwal 1–4 & Dhu al-Hijjah 9–13) -> Emerald Stars & Radiant Crescents
5. **🎄 Christmas** (Dec 15 – Dec 28) -> Falling Soft Snow

*To preview any theme during development, append `?season=ramadan`, `?season=eid`, `?season=christmas`, `?season=newyear`, `?season=valentine`, or `?season=off` to the URL.*

---

## ⚡ 5. Standard Deployment Workflow (Step-by-Step)

Whenever you make any edits:

1. **Make your changes** in your code editor (e.g. edit text in `index.html` or `js/app.js`).
2. **Test locally** by opening `http://localhost:3000/`.
3. **Commit & Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update summer tour prices and add new client logo"
   git push origin main
   ```
4. **Done!** Your continuous deployment pipeline will automatically publish the update to your live domain within seconds.
