# Cloudflare Workers Deployment Script
# This script deploys your Astro site to Cloudflare Workers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cloudflare Workers Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Wrangler is installed
Write-Host "Step 1: Checking Wrangler CLI..." -ForegroundColor Yellow
try {
    $wranglerVersion = wrangler --version 2>&1
    Write-Host "✓ Wrangler found: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Wrangler not found. Installing..." -ForegroundColor Red
    Write-Host "Installing Wrangler globally..." -ForegroundColor Yellow
    npm install -g wrangler
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Wrangler. Please install manually: npm install -g wrangler" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Check login status
Write-Host "`nStep 2: Checking Cloudflare login status..." -ForegroundColor Yellow
try {
    $whoami = wrangler whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Already logged in" -ForegroundColor Green
        Write-Host $whoami -ForegroundColor Gray
    } else {
        Write-Host "✗ Not logged in. Please login..." -ForegroundColor Red
        Write-Host "Opening browser for OAuth login..." -ForegroundColor Yellow
        Write-Host "If browser doesn't open, you can also set CLOUDFLARE_API_TOKEN environment variable" -ForegroundColor Gray
        wrangler login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Login failed. You can also set CLOUDFLARE_API_TOKEN as an environment variable." -ForegroundColor Red
            Write-Host "Example: `$env:CLOUDFLARE_API_TOKEN = 'your-token-here'" -ForegroundColor Yellow
            exit 1
        }
    }
} catch {
    Write-Host "Login check failed. Attempting OAuth login..." -ForegroundColor Yellow
    wrangler login
}

# Step 3: Install dependencies
Write-Host "`nStep 3: Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 4: Build project
Write-Host "`nStep 4: Building Astro project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green

# Step 5: Verify build output
Write-Host "`nStep 5: Verifying build output..." -ForegroundColor Yellow
if (Test-Path "dist\_worker.js\index.js") {
    Write-Host "✓ Worker entry point found" -ForegroundColor Green
} else {
    Write-Host "✗ Worker entry point not found at dist\_worker.js\index.js" -ForegroundColor Red
    Write-Host "Build may have failed. Check build output above." -ForegroundColor Yellow
    exit 1
}

# Step 6: Deploy to Cloudflare Workers
Write-Host "`nStep 6: Deploying to Cloudflare Workers..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Gray
wrangler deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✓ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site should be live at:" -ForegroundColor Cyan
Write-Host "https://arktos-health.YOUR_SUBDOMAIN.workers.dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check your Cloudflare dashboard for the exact URL." -ForegroundColor Gray
Write-Host ""

