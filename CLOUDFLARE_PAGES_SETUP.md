# Cloudflare Pages Deployment Setup

## Important: Remove Custom Deploy Command

For Astro with Cloudflare adapter on **Cloudflare Pages**, you should **NOT** use a custom deploy command. Cloudflare Pages automatically detects and deploys Astro projects.

## Cloudflare Pages Configuration

In your Cloudflare Pages project settings:

1. **Build command**: `npm run build`
2. **Build output directory**: `dist`
3. **Deploy command**: **(LEAVE EMPTY)** - Let Cloudflare Pages handle it automatically

## Why This Works

- Cloudflare Pages automatically detects Astro projects
- It reads your `wrangler.toml` file for configuration (KV bindings, etc.)
- It automatically deploys the `dist/_worker.js/index.js` file
- No need for `npx wrangler deploy` - that's only for Cloudflare Workers, not Pages

## If You're Using Cloudflare Workers (Not Pages)

Only use `wrangler deploy` if you're deploying to **Cloudflare Workers**, not **Cloudflare Pages**. For Workers:
- Use `npm run deploy` locally
- Or set deploy command to `npm run deploy` in your CI/CD

## Current Setup

Your project is configured for Cloudflare Pages:
- ✅ `astro.config.mjs` has Cloudflare adapter
- ✅ `wrangler.toml` has KV bindings and configuration
- ✅ Build script creates `dist/_worker.js/index.js`

Just remove the custom deploy command from Cloudflare Pages settings!

