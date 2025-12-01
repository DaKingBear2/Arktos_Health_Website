# Step-by-Step Guide: Migrating from Cloudflare Pages to Cloudflare Workers

This guide will walk you through migrating your Astro website from Cloudflare Pages to Cloudflare Workers.

## 📋 Prerequisites

- Cloudflare account with Workers enabled
- GitHub repository access
- Wrangler CLI installed (or we'll install it)
- Node.js and npm installed

## ✅ Step 1: Verify Your Current Setup

Your project is already configured for Workers! Here's what's already done:

- ✅ Cloudflare adapter installed (`@astrojs/cloudflare`)
- ✅ `wrangler.toml` configured
- ✅ KV namespace configured
- ✅ Guestbook API updated for Workers

## 🔧 Step 2: Install Wrangler CLI

If you don't have Wrangler installed, install it globally:

```powershell
npm install -g wrangler
```

Or use it locally via npx (no installation needed):
```powershell
npx wrangler --version
```

## 🔐 Step 3: Create Cloudflare API Token (Optional)

**Note:** You can skip this if you use browser OAuth login (recommended).

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use the **"Edit Cloudflare Workers"** template, or create custom token with:
   - **Account** → **Cloudflare Workers** → **Edit**
   - **Zone** → **Zone** → **Read** (if you have a custom domain)
4. Copy the token (you'll only see it once!)

## 🔑 Step 4: Login to Cloudflare

**Option A: Browser OAuth (Recommended - Easiest)**

Open PowerShell in your project directory and run:

```powershell
wrangler login
```

This will automatically open your browser to authorize Wrangler. Just click "Allow" in the browser.

**Option B: Using API Token (If you prefer not to use browser)**

Set the API token as an environment variable:

```powershell
# Set the token (replace with your actual token)
$env:CLOUDFLARE_API_TOKEN = "YOUR_API_TOKEN_HERE"

# Verify authentication
wrangler whoami
```

**Note:** The `--api-token` flag on `wrangler login` is not supported in newer Wrangler versions. Use the environment variable method instead.

## 🗄️ Step 5: Verify/Create KV Namespace

Your `wrangler.toml` already has a KV namespace configured. To verify or create a new one:

1. Go to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers/kv/namespaces
2. Check if namespace ID `b0cda50d0f554903a3610a002e86e8a4` exists
3. If it doesn't exist, create a new one:
   - Click **"Create a namespace"**
   - Name it: `arktos-sessions`
   - Copy the namespace ID
   - Update `wrangler.toml` with the new ID

## 🔒 Step 6: Set Environment Variables in Cloudflare

**Important:** Move your GitHub token to Cloudflare secrets for security.

1. Go to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers/services/view/arktos-health
2. Click **"Settings"** → **"Variables"**
3. Click **"Add variable"**
4. Add:
   - **Variable name:** `GITHUB_TOKEN`
   - **Value:** Your GitHub personal access token
   - **Type:** **Secret** (encrypted)
5. Click **"Save"**

**Note:** The code has been updated to use `import.meta.env.GITHUB_TOKEN`, so it will automatically use this secret.

## 🏗️ Step 7: Build Your Project

Build the Astro project:

```powershell
npm run build
```

This creates the `dist` folder with:
- `dist/_worker.js/index.js` - Your Worker entry point
- `dist/` - Static assets (HTML, CSS, JS, images, etc.)

## 🚀 Step 8: Deploy to Cloudflare Workers

Deploy using Wrangler:

```powershell
wrangler deploy
```

This will:
- Upload your Worker code
- Upload static assets
- Deploy to: `https://arktos-health.YOUR_SUBDOMAIN.workers.dev`

**First-time deployment:** Wrangler will ask you to confirm creating the Worker. Type `y` and press Enter.

## 🌐 Step 9: Configure Custom Domain (Optional)

If you want to use your custom domain:

1. Go to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers/services/view/arktos-health
2. Click **"Triggers"** tab
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter your domain: `www.arktoshealth.com` or `arktoshealth.com`
6. Follow DNS setup instructions if needed

## ✅ Step 10: Verify Deployment

1. Visit your Worker URL: `https://arktos-health.YOUR_SUBDOMAIN.workers.dev`
2. Test all pages:
   - Homepage
   - Blog pages
   - Guestbook (test POST functionality)
   - All other features

## 🔄 Step 11: Update GitHub Repository (Optional)

If you want automatic deployments on git push:

1. Go to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers/services/view/arktos-health
2. Click **"Settings"** → **"Integrations"**
3. Connect your GitHub repository
4. Configure:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Root directory:** `/`

**Note:** Cloudflare Workers with GitHub integration works differently than Pages. You may need to use GitHub Actions for CI/CD instead.

## 📝 Step 12: Update DNS (If Using Custom Domain)

If you're using a custom domain and it was previously pointing to Pages:

1. Go to your domain's DNS settings in Cloudflare
2. Update any CNAME records pointing to Pages
3. The custom domain in Workers will handle routing automatically

## 🧪 Testing Locally

Test your Worker locally before deploying:

```powershell
npm run build
wrangler dev
```

This starts a local server at `http://localhost:8787` that mimics the Cloudflare Workers environment.

## 🆘 Troubleshooting

### Error: "Invalid binding SESSION"
- **Solution:** Create the KV namespace in Cloudflare Dashboard and update `wrangler.toml` with the correct ID

### Error: "GITHUB_TOKEN is undefined"
- **Solution:** Add `GITHUB_TOKEN` as a secret in Cloudflare Dashboard → Worker Settings → Variables

### Build fails
- **Solution:** Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)

### Static assets not loading
- **Solution:** The Astro Cloudflare adapter handles static assets automatically. Ensure `npm run build` completed successfully.

### Deployment fails
- **Solution:** Check `wrangler.toml` syntax
- Verify you're logged in: `wrangler whoami`
- Check account permissions

## 📊 Differences: Pages vs Workers

| Feature | Cloudflare Pages | Cloudflare Workers |
|---------|-----------------|-------------------|
| **Deployment** | Git-based, automatic | Manual via Wrangler or CI/CD |
| **Build** | Automatic on push | Manual or via CI/CD |
| **Static Assets** | Automatic | Handled by adapter |
| **Runtime** | Edge network | Edge network (same) |
| **API Routes** | Supported | Supported (same) |
| **Custom Domain** | Easy setup | Easy setup (same) |

## 🎯 Next Steps

1. ✅ Deploy to Workers
2. ✅ Test all functionality
3. ✅ Configure custom domain
4. ✅ Set up CI/CD (optional)
5. 🔮 Future: Discuss additional Cloudflare features (D1, R2, etc.)

## 📚 Additional Resources

- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**Ready to deploy?** Start with Step 2 and work through each step. If you encounter any issues, refer to the Troubleshooting section above.

