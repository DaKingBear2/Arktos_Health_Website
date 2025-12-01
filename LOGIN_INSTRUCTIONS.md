# 🔐 Cloudflare Login Instructions

## The Issue

You tried: `wrangler login --api-token YOUR_TOKEN`

**Error:** `Unknown arguments: api-token, apiToken`

This is because newer versions of Wrangler don't support the `--api-token` flag on the `login` command.

## ✅ Solution: Two Ways to Authenticate

### Method 1: Browser OAuth (Recommended - Easiest)

Just run:
```powershell
wrangler login
```

This will:
1. Open your browser automatically
2. Show a Cloudflare login page
3. Ask you to authorize Wrangler
4. Click "Allow"
5. Done! You're authenticated

**No token needed!** This is the simplest method.

---

### Method 2: API Token via Environment Variable

If you prefer to use an API token:

**PowerShell:**
```powershell
# Set the token as an environment variable
$env:CLOUDFLARE_API_TOKEN = "YOUR_CLOUDFLARE_API_TOKEN_HERE"

# Verify it works
wrangler whoami
```

**For permanent setup (PowerShell):**
```powershell
# Set user-level environment variable (persists across sessions)
[System.Environment]::SetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "YOUR_CLOUDFLARE_API_TOKEN_HERE", "User")
```

Then restart your terminal/PowerShell.

---

## 🧪 Verify Authentication

After either method, verify you're logged in:

```powershell
wrangler whoami
```

You should see your Cloudflare account email.

---

## 🚀 Next Steps

Once authenticated:

1. **Set GitHub Token Secret:**
   ```powershell
   wrangler secret put GITHUB_TOKEN
   ```
   Paste your GitHub Personal Access Token (starts with `github_pat_...`)

2. **Build & Deploy:**
   ```powershell
   npm run build
   wrangler deploy
   ```

---

## 💡 Which Method Should I Use?

- **Browser OAuth (Method 1):** Use this if you're okay with browser-based login. It's simpler and more secure.
- **API Token (Method 2):** Use this if you need scripted/automated deployments or prefer not to use a browser.

Both methods work equally well!

