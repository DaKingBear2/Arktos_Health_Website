#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workerPath = path.join(process.cwd(), 'dist', '_worker.js', 'index.js');

console.log('Verifying build output...');
console.log('Looking for:', workerPath);

if (!fs.existsSync(workerPath)) {
  console.error('❌ ERROR: Build output not found at:', workerPath);
  console.error('Please ensure the build step completed successfully.');
  console.error('Run "npm run build" first, then deploy.');
  process.exit(1);
}

console.log('✅ Build output found!');
console.log('Deploying to Cloudflare...');

try {
  execSync('npx wrangler deploy', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

