# Favicon Replacement Instructions

## Current Status
The favicon files in `public/favicon/` still contain the old Astrogon branding and need to be replaced with the Arktos Health bear face logo.

## Files to Replace
- `public/favicon/favicon.ico` (16x16, 32x32, 48x48 ICO format)
- `public/favicon/favicon-16x16.png` (16x16 PNG)
- `public/favicon/favicon-32x32.png` (32x32 PNG)
- `public/favicon/apple-touch-icon.png` (180x180 PNG)
- `public/favicon/android-chrome-192x192.png` (192x192 PNG)
- `public/favicon/android-chrome-512x512.png` (512x512 PNG)

## How to Replace
1. **Use a favicon generator** (like [realfavicongenerator.net](https://realfavicongenerator.net/))
2. **Upload your Arktos Health bear face logo** (`src/assets/Arktos-Star-logo.svg`)
3. **Generate all required sizes**
4. **Download and replace** the files in `public/favicon/`

## Alternative: Manual Replacement
If you have image editing software:
1. Open `src/assets/Arktos-Star-logo.svg` in your image editor
2. Export/resize to each required size
3. Replace the corresponding files in `public/favicon/`

## Note
The favicon files are referenced in `src/components/base/BaseLayout.astro` and will automatically update once replaced. 