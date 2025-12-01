# 🚀 Deploy Now - Quick Steps

## Your GitHub Token

**Important:** Your GitHub token should be set in Cloudflare Dashboard as a secret. Never commit tokens to the repository!

## ⚡ Fast Deployment (3 Steps)

### Step 1: Login to Cloudflare

**Option A: Browser OAuth (Easiest)**
```powershell
wrangler login
```
This will open your browser to authenticate.

**Option B: Using API Token (If you prefer)**
Set the token as an environment variable:
```powershell
$env:CLOUDFLARE_API_TOKEN = "YOUR_CLOUDFLARE_API_TOKEN_HERE"
wrangler whoami
```
This verifies your authentication without opening a browser.

### Step 2: Set GitHub Token as Secret
```powershell
wrangler secret put GITHUB_TOKEN
```
When prompted, paste your GitHub Personal Access Token (starts with `github_pat_...`)

**OR** use the Dashboard method (see `SET_GITHUB_TOKEN.md`)

### Step 3: Build & Deploy
```powershell
npm run build
wrangler deploy
```

## ✅ Done!

Your site will be live at: `https://arktos-health.YOUR_SUBDOMAIN.workers.dev`

---

## 📋 Alternative: Use Automated Script

```powershell
.\deploy-worker.ps1
```

Then manually add the GitHub token secret via Dashboard or CLI.

---

## 🔍 Verify Deployment

1. Visit your Worker URL
2. Test the guestbook (should work now with the token set)
3. Check all pages load correctly

---

## 📚 Need More Help?

- **Full Guide:** See `MIGRATE_TO_WORKERS.md`
- **Token Setup:** See `SET_GITHUB_TOKEN.md`
- **Quick Reference:** See `QUICK_START_WORKERS.md`

