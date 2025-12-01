# Quick Start: Deploy to Cloudflare Workers

## 🚀 Fast Track (5 Steps)

### 1. Install & Login
```powershell
npm install -g wrangler
wrangler login
```

### 2. Build
```powershell
npm run build
```

### 3. Deploy
```powershell
wrangler deploy
```

### 4. Set GitHub Token (First Time Only)
- Go to: Cloudflare Dashboard → Workers → arktos-health → Settings → Variables
- Add secret: `GITHUB_TOKEN` = your GitHub token

### 5. Done! 
Visit: `https://arktos-health.YOUR_SUBDOMAIN.workers.dev`

---

## 📋 Or Use the Automated Script

```powershell
.\deploy-worker.ps1
```

This script handles everything automatically!

---

## 🔧 What Changed?

✅ **Already Done:**
- Cloudflare adapter configured
- `wrangler.toml` updated for Workers
- Guestbook API uses environment variables
- KV namespace configured

✅ **You Need To:**
- Login to Cloudflare (`wrangler login`)
- Set `GITHUB_TOKEN` secret in Cloudflare Dashboard
- Deploy (`wrangler deploy`)

---

## 📖 Full Guide

See `MIGRATE_TO_WORKERS.md` for detailed step-by-step instructions.

