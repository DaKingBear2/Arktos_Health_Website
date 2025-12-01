# Local Testing Script for Cloudflare Pages Build
# This tests the production build locally

Write-Host "Testing production build locally..." -ForegroundColor Cyan
Write-Host "Note: Sharp image processing won't work in local dev (it's build-time only)" -ForegroundColor Yellow
Write-Host ""

# Build the project first
Write-Host "Step 1: Building project..." -ForegroundColor Cyan
npm run build

Write-Host "`nStep 2: Starting local dev server..." -ForegroundColor Cyan
Write-Host "The server will start on http://localhost:8788" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow

# Start wrangler pages dev
wrangler pages dev dist --compatibility-date=2024-09-23 --compatibility-flags=nodejs_compat --port=8788

