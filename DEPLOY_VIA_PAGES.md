# Deploy to Cloudflare Pages - Step by Step Guide

## Method 1: Via Cloudflare Dashboard (Recommended)

### Step 1: Access Pages
1. In your Cloudflare dashboard, look at the **left sidebar**
2. Find and **expand** the **"Compute & AI"** section
3. Click on **"Workers & Pages"** (or just "Pages" if you see it)
4. If you still don't see it, go directly to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/pages

### Step 2: Create a New Project
1. Click **"Create application"** button
2. Select **"Pages"** tab (not Workers)
3. Click **"Connect to Git"**

### Step 3: Connect GitHub Repository
1. Authorize Cloudflare to access your GitHub account
2. Select repository: **`DaKingBear2/Arktos_Health_Website`**
3. Click **"Begin setup"**

### Step 4: Configure Build Settings
- **Project name:** `arktos-health` (or any name you prefer)
- **Production branch:** `main`
- **Framework preset:** `Astro` (or "None" if Astro isn't listed)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty or put `/`)

### Step 5: Environment Variables (Important!)
Click **"Add variable"** and add:
- **Variable name:** `GITHUB_TOKEN`
- **Value:** Your GitHub personal access token
- **Mark as:** **Secret** (encrypted)

### Step 6: Deploy
1. Click **"Save and Deploy"**
2. Wait for the build to complete
3. Your site will be available at: `https://arktos-health.pages.dev`

### Step 7: Connect Custom Domain
1. Go to your Pages project → **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter: `www.arktoshealth.com` or `arktoshealth.com`
4. Follow the DNS setup instructions

## Method 2: Using Wrangler CLI (Alternative)

If dashboard access is limited, use the CLI:

### Step 1: Create API Token
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. Set permissions:
   - **Account** → **Cloudflare Workers** → **Edit**
   - **Zone** → **Zone** → **Read** (for arktoshealth.com)
5. Copy the token

### Step 2: Login with Token
```bash
wrangler login --api-token YOUR_TOKEN_HERE
```

### Step 3: Build and Deploy
```bash
npm run build
wrangler pages deploy dist --project-name=arktos-health
```

## Method 3: Direct URL Access

Try accessing Pages directly:
- https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/pages
- Replace `[YOUR_ACCOUNT_ID]` with your account ID (visible in dashboard URL)

## Troubleshooting

**If you see "No Access":**
- Your account might need Workers/Pages enabled
- Contact Cloudflare support or check if you need to upgrade plan
- Free plan should have Pages access

**If build fails:**
- Check build logs in Cloudflare dashboard
- Ensure `GITHUB_TOKEN` environment variable is set
- Verify build command and output directory are correct

