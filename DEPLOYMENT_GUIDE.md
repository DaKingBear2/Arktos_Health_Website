# Cloudflare Workers Deployment Guide

This guide covers the migration from Cloudflare Pages to Cloudflare Workers for the Arktos Health website.

## ✅ Completed Steps

1. **Installed Cloudflare Adapter**
   - Added `@astrojs/cloudflare` package
   - Updated `astro.config.mjs` to use Cloudflare adapter

2. **Updated Guestbook API**
   - Removed file system dependencies (`fs`)
   - Updated to use GitHub API for both GET and POST operations
   - Works with Cloudflare Workers (no file system access)

3. **Created Configuration Files**
   - `wrangler.toml` - Cloudflare Workers configuration
   - All integrations preserved (React, MDX, Tailwind, etc.)

## 📋 Deployment Steps

### 1. Create Cloudflare KV Namespace (if needed)

The Cloudflare adapter uses KV for sessions. If you see errors about SESSION binding:

1. Go to Cloudflare Dashboard → Workers & Pages → KV
2. Create a new KV namespace (e.g., "arktos-sessions")
3. Update `wrangler.toml` with the namespace ID:
   ```toml
   [[kv_namespaces]]
   binding = "SESSION"
   id = "your-actual-kv-namespace-id"
   preview_id = "your-actual-preview-id"
   ```

### 2. Set Environment Variables

**Important Security Note:** The GitHub token is currently hardcoded in `src/pages/api/guestbook.ts`. For production:

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Variables
2. Add a secret variable:
   - Name: `GITHUB_TOKEN`
   - Value: Your GitHub personal access token
3. Update `src/pages/api/guestbook.ts` to use `import.meta.env.GITHUB_TOKEN` instead of hardcoded value

### 3. Deploy to Cloudflare Workers

#### Option A: Using Wrangler CLI (Recommended)

1. Install Wrangler CLI (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   wrangler deploy
   ```

#### Option B: Using Cloudflare Dashboard

1. Go to Cloudflare Dashboard → Workers & Pages
2. Create a new Worker
3. Connect to your GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `/`
5. Deploy

### 4. Configure Custom Domain

1. In Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Triggers
2. Add a custom domain: `www.ArktosHealth.com`
3. Update DNS records if needed

## 🔧 Configuration Files

### `wrangler.toml`
- Main entry point: `dist/_worker.js/index.js`
- Static assets: `dist` directory
- Node.js compatibility enabled for Buffer support

### `astro.config.mjs`
- Cloudflare adapter configured
- All integrations enabled (React, MDX, Tailwind, Sitemap, etc.)
- Site URL: `https://Arktoshealth.com`

## 🧪 Testing

1. **Local Testing:**
   ```bash
   npm run dev
   ```

2. **Build Test:**
   ```bash
   npm run build
   ```

3. **Test Guestbook API:**
   - GET: `http://localhost:4321/api/guestbook`
   - POST: Send JSON with `name` and `message` fields

## ⚠️ Important Notes

1. **GitHub Token Security**: Move the hardcoded token to environment variables before production deployment.

2. **KV Namespace**: The SESSION KV namespace is required by the Cloudflare adapter. Create it in the Cloudflare dashboard.

3. **Build Warning**: You may see a warning about a missing file during build. This is non-critical - the build completes successfully.

4. **Bark Quiz**: The bark quiz uses an external iframe (`https://www.barkquiz.com/`) and will work without changes.

5. **Guestbook**: Now uses GitHub API exclusively - no file system access needed.

## 📝 Next Steps

1. Create KV namespace in Cloudflare
2. Move GitHub token to environment variables
3. Deploy using Wrangler CLI or Cloudflare Dashboard
4. Test all functionality (guestbook, bark quiz, etc.)
5. Configure custom domain

## 🆘 Troubleshooting

- **"Invalid binding SESSION"**: Create KV namespace and update `wrangler.toml`
- **Build errors**: Ensure all dependencies are installed (`npm install`)
- **API errors**: Check GitHub token is valid and has repo write permissions
- **Deployment errors**: Verify `wrangler.toml` paths match your build output

