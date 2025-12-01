#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the project root directory (where package.json and wrangler.toml are)
const projectRoot = process.cwd();
const workerPath = path.join(projectRoot, 'dist', '_worker.js', 'index.js');
const wranglerTomlPath = path.join(projectRoot, 'wrangler.toml');

console.log('Current working directory:', projectRoot);
console.log('Verifying build output...');
console.log('Looking for:', workerPath);

if (!fs.existsSync(workerPath)) {
  console.error('❌ ERROR: Build output not found at:', workerPath);
  console.error('Please ensure the build step completed successfully.');
  console.error('Run "npm run build" first, then deploy.');
  process.exit(1);
}

if (!fs.existsSync(wranglerTomlPath)) {
  console.error('❌ ERROR: wrangler.toml not found at:', wranglerTomlPath);
  process.exit(1);
}

console.log('✅ Build output found!');
console.log('✅ wrangler.toml found!');
console.log('Deploying to Cloudflare Pages from:', projectRoot);

try {
  // Use 'wrangler pages deploy' for Cloudflare Pages (NOT 'wrangler deploy' which is for Workers)
  // Astro Cloudflare adapter generates output for Pages, not Workers
  execSync('npx wrangler pages deploy dist --project-name=arktos-health-llc-website-2-0', { 
    stdio: 'inherit', 
    cwd: projectRoot,
    env: { ...process.env, PWD: projectRoot }
  });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

