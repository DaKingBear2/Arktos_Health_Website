# Setting GitHub Token in Cloudflare

## 🔐 Your GitHub Token

You've provided your GitHub Personal Access Token. **DO NOT commit this to any files!**

## ✅ Step-by-Step: Add Token to Cloudflare

### Method 1: Via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Login to your account

2. **Navigate to Your Worker**
   - Click **"Workers & Pages"** in the left sidebar
   - Find and click on **"arktos-health"** (or your worker name)
   - If the worker doesn't exist yet, deploy it first with `wrangler deploy`

3. **Add the Secret Variable**
   - Click the **"Settings"** tab
   - Scroll down to **"Variables"** section
   - Click **"Add variable"**
   - Fill in:
     - **Variable name:** `GITHUB_TOKEN`
     - **Value:** Your GitHub Personal Access Token (paste it here, starts with `github_pat_...`)
     - **Type:** Select **"Secret"** (this encrypts it)
   - Click **"Save"**

4. **Redeploy Your Worker**
   - After adding the secret, you need to redeploy for it to take effect:
   ```powershell
   wrangler deploy
   ```

### Method 2: Via Wrangler CLI

You can also set secrets via command line:

```powershell
wrangler secret put GITHUB_TOKEN
```

When prompted, paste your GitHub Personal Access Token (starts with `github_pat_...`)

**Note:** This method requires the worker to exist first. Deploy once, then add the secret.

## 🧪 Verify It Works

After setting the token and redeploying:

1. Visit your Worker URL
2. Test the guestbook functionality
3. Check Cloudflare Worker logs if there are any issues

## 🔒 Security Notes

- ✅ Token is stored as a **Secret** in Cloudflare (encrypted)
- ✅ Token is **NOT** in your code or repository
- ✅ Token is only accessible to your Worker at runtime
- ✅ You can rotate/update the token anytime in Cloudflare Dashboard

## 🆘 Troubleshooting

**If guestbook doesn't work:**
- Verify the token is set: Check Cloudflare Dashboard → Worker → Settings → Variables
- Verify the token has correct permissions: GitHub → Settings → Developer settings → Personal access tokens
- Check Worker logs: Cloudflare Dashboard → Worker → Logs
- Redeploy after adding the secret: `wrangler deploy`

## 📝 For Local Development

If you want to test locally, create a `.env` file in your project root:

```env
GITHUB_TOKEN=your_github_token_here
```

**Important:** Add `.env` to your `.gitignore` file to prevent committing it!

---

**Next Step:** After setting the token, deploy your Worker with `wrangler deploy`

