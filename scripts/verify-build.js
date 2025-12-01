#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const workerPath = path.join(cwd, 'dist', '_worker.js', 'index.js');
const distPath = path.join(cwd, 'dist');
const workerDirPath = path.join(cwd, 'dist', '_worker.js');

console.log('=== Build Verification ===');
console.log('Current working directory:', cwd);
console.log('Looking for worker file at:', workerPath);
console.log('Dist directory exists:', fs.existsSync(distPath));
console.log('Worker directory exists:', fs.existsSync(workerDirPath));

if (fs.existsSync(workerDirPath)) {
  const files = fs.readdirSync(workerDirPath);
  console.log('Files in _worker.js directory:', files.slice(0, 10).join(', '), files.length > 10 ? '...' : '');
}

if (!fs.existsSync(workerPath)) {
  console.error('❌ ERROR: Build output not found at:', workerPath);
  console.error('The build may have failed or the output directory is incorrect.');
  console.error('Please check the build logs above to see if the build completed successfully.');
  process.exit(1);
}

console.log('✅ Build output verified successfully!');
console.log('✅ File exists at:', workerPath);
const stats = fs.statSync(workerPath);
console.log('✅ File size:', stats.size, 'bytes');

