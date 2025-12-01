#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workerPath = path.join(process.cwd(), 'dist', '_worker.js', 'index.js');

console.log('Verifying build output...');
console.log('Looking for:', workerPath);

if (!fs.existsSync(workerPath)) {
  console.error('❌ ERROR: Build output not found at:', workerPath);
  console.error('The build may have failed or the output directory is incorrect.');
  process.exit(1);
}

console.log('✅ Build output verified successfully!');
console.log('File exists at:', workerPath);

