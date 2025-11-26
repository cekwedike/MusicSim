# PWA Setup and Asset Generation Script
# This script helps set up PWA assets for cross-browser compatibility

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  MusicSim PWA Setup Utility" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend/public")) {
    Write-Host "Error: Please run this script from the MusicSim root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Checking PWA assets..." -ForegroundColor Yellow
Write-Host ""

# Check required files
$requiredFiles = @(
    "frontend/public/manifest.json",
    "frontend/public/sw.js",
    "frontend/public/offline.html",
    "frontend/public/browserconfig.xml",
    "frontend/public/favicon.ico",
    "frontend/public/apple-touch-icon.png",
    "frontend/public/android-chrome-192x192.png",
    "frontend/public/android-chrome-512x512.png"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (MISSING)" -ForegroundColor Red
        $missingFiles += $file
    }
}

Write-Host ""

# Check splash screens
Write-Host "Checking iOS splash screens..." -ForegroundColor Yellow
$splashDir = "frontend/public/splash"
if (Test-Path $splashDir) {
    $svgCount = (Get-ChildItem -Path $splashDir -Filter "*.svg" -ErrorAction SilentlyContinue).Count
    $pngCount = (Get-ChildItem -Path $splashDir -Filter "*.png" -ErrorAction SilentlyContinue).Count
    
    Write-Host "  SVG files: $svgCount" -ForegroundColor Cyan
    Write-Host "  PNG files: $pngCount" -ForegroundColor Cyan
    
    if ($pngCount -lt 9) {
        Write-Host "  ⚠ Note: PNG splash screens are recommended for iOS" -ForegroundColor Yellow
        Write-Host "    Current files work, but you can convert SVG to PNG for better compatibility" -ForegroundColor Gray
    } else {
        Write-Host "  ✓ All splash screens present" -ForegroundColor Green
    }
} else {
    Write-Host "  ✗ Splash directory not found" -ForegroundColor Red
    $missingFiles += "frontend/public/splash"
}

Write-Host ""

# Generate splash screens if missing
if ($missingFiles -contains "frontend/public/splash") {
    Write-Host "Generating iOS splash screens..." -ForegroundColor Yellow
    node frontend/scripts/generate-splash-screens.js
    Write-Host ""
}

# Summary
Write-Host "======================================" -ForegroundColor Cyan
if ($missingFiles.Count -eq 0) {
    Write-Host "✓ All PWA assets are present!" -ForegroundColor Green
} else {
    Write-Host "⚠ Missing files detected:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Build the project: npm run build" -ForegroundColor White
Write-Host "2. Test locally: npm run preview" -ForegroundColor White
Write-Host "3. Deploy to HTTPS-enabled server" -ForegroundColor White
Write-Host "4. Test PWA installation on various devices" -ForegroundColor White
Write-Host ""

# Optional: Convert SVG splash screens to PNG
Write-Host "Optional: Convert SVG splash screens to PNG" -ForegroundColor Yellow
Write-Host "For better iOS compatibility, you can convert splash screens:" -ForegroundColor Gray
Write-Host "  npx pwa-asset-generator frontend/public/android-chrome-512x512.png frontend/public/splash --splash-only --background `"#1f2937`"" -ForegroundColor Cyan
Write-Host ""

# Validation suggestions
Write-Host "Validation Tools:" -ForegroundColor Cyan
Write-Host "- Manifest: https://manifest-validator.appspot.com/" -ForegroundColor White
Write-Host "- Lighthouse: DevTools > Lighthouse > PWA Audit" -ForegroundColor White
Write-Host "- PWA Builder: https://www.pwabuilder.com/" -ForegroundColor White
Write-Host ""

Write-Host "Browser Testing:" -ForegroundColor Cyan
Write-Host "✓ iOS Safari - Share > Add to Home Screen" -ForegroundColor White
Write-Host "✓ Chrome/Edge - Install icon in address bar" -ForegroundColor White
Write-Host "✓ Opera - Menu > Install MusicSim" -ForegroundColor White
Write-Host "✓ Firefox - Add to Home Screen (Android)" -ForegroundColor White
Write-Host ""

Write-Host "For detailed documentation, see:" -ForegroundColor Cyan
Write-Host "  docs/PWA_COMPATIBILITY.md" -ForegroundColor White
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup check complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
