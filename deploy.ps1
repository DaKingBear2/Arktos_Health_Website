# Cloudflare Pages Deployment Script
# Run this after creating an API token

Write-Host "Step 1: Login to Cloudflare with API token" -ForegroundColor Cyan
Write-Host "You'll need to create an API token at: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
$token = Read-Host "Enter your Cloudflare API token"

Write-Host "`nStep 2: Logging in..." -ForegroundColor Cyan
wrangler login --api-token $token

Write-Host "`nStep 3: Building project..." -ForegroundColor Cyan
npm run build

Write-Host "`nStep 4: Listing existing projects..." -ForegroundColor Cyan
wrangler pages project list

Write-Host "`nStep 5: Deploying to Cloudflare Pages..." -ForegroundColor Cyan
$projectName = Read-Host "Enter your existing Cloudflare Pages project name (or 'arktos-health' for new)"
wrangler pages deploy dist --project-name=$projectName

Write-Host "`nDeployment complete! Check your Cloudflare dashboard." -ForegroundColor Green

