/**
 * Generate iOS Splash Screens for PWA
 * This script creates splash screen images for various iOS devices
 * 
 * Run with: node frontend/scripts/generate-splash-screens.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Splash screen sizes for iOS devices
const splashScreenSizes = [
  { width: 1125, height: 2436, name: 'iPhone X, XS, 11 Pro, 12 mini, 13 mini' },
  { width: 828, height: 1792, name: 'iPhone XR, 11, 12, 12 Pro, 13, 13 Pro, 14' },
  { width: 1242, height: 2688, name: 'iPhone XS Max, 11 Pro Max, 12 Pro Max, 13 Pro Max, 14 Plus' },
  { width: 1179, height: 2556, name: 'iPhone 14 Pro' },
  { width: 1290, height: 2796, name: 'iPhone 14 Pro Max' },
  { width: 1536, height: 2048, name: 'iPad Mini, Air' },
  { width: 1668, height: 2224, name: 'iPad Pro 10.5"' },
  { width: 1668, height: 2388, name: 'iPad Pro 11"' },
  { width: 2048, height: 2732, name: 'iPad Pro 12.9"' },
];

// Create splash directory
const splashDir = path.join(__dirname, '..', 'public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

// Generate SVG splash screen template using maroon theme and actual favicon
function generateSplashSVG(width, height) {
  const iconSize = Math.min(width, height) * 0.25;
  const centerX = width / 2;
  const centerY = height / 2 - iconSize * 0.15;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Maroon gradient background matching app theme -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A0A0F;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2D1115;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A0A0F;stop-opacity:1" />
    </linearGradient>
    
    <!-- Maroon glow -->
    <radialGradient id="glowGradient">
      <stop offset="0%" style="stop-color:#8B2635;stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:#7e2235;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#8B2635;stop-opacity:0" />
    </radialGradient>
    
    <!-- Accent gradient for icon ring -->
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#93334a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B2635;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7e2235;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with maroon gradient -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  
  <!-- Glow effect behind icon -->
  <circle cx="${centerX}" cy="${centerY}" r="${iconSize * 0.8}" fill="url(#glowGradient)"/>
  <circle cx="${centerX}" cy="${centerY}" r="${iconSize * 0.6}" fill="url(#glowGradient)"/>
  
  <!-- Decorative ring around icon -->
  <circle cx="${centerX}" cy="${centerY}" r="${iconSize * 0.55}" fill="none" stroke="url(#accentGradient)" stroke-width="${iconSize * 0.01}" opacity="0.3"/>
  
  <!-- App Icon from favicon directory -->
  <image href="/android-chrome-512x512.png" 
         x="${centerX - iconSize * 0.5}" 
         y="${centerY - iconSize * 0.5}" 
         width="${iconSize}" 
         height="${iconSize}"/>
  
  <!-- App name with maroon theme -->
  <text x="${centerX}" y="${centerY + iconSize * 0.8}" 
        font-family="Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" 
        font-size="${iconSize * 0.16}" 
        font-weight="900" 
        fill="#ffffff" 
        text-anchor="middle">MusicSim</text>
  
  <!-- Subtitle with muted maroon color -->
  <text x="${centerX}" y="${centerY + iconSize * 1.05}" 
        font-family="Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" 
        font-size="${iconSize * 0.075}" 
        font-weight="400" 
        fill="#d8b4bc" 
        text-anchor="middle">Music Business Simulation</text>
</svg>`;
}

// Generate placeholder files (SVG format for now)
console.log('Generating iOS splash screens...\n');

splashScreenSizes.forEach(({ width, height, name }) => {
  const filename = `splash-${width}x${height}.svg`;
  const filepath = path.join(splashDir, filename);
  const svgContent = generateSplashSVG(width, height);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✓ Generated ${filename} (${name})`);
});

// Generate HTML file for converting SVG to PNG
const htmlConverter = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Splash Screen Converter</title>
  <style>
    body { font-family: system-ui; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .screen { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
    button { padding: 10px 20px; background: #dc2626; color: white; border: none; cursor: pointer; }
    button:hover { background: #b91c1c; }
  </style>
</head>
<body>
  <div class="container">
    <h1>iOS Splash Screen Converter</h1>
    <p>To convert SVG splash screens to PNG format:</p>
    <ol>
      <li>Use an online tool like <a href="https://cloudconvert.com/svg-to-png" target="_blank">CloudConvert</a></li>
      <li>Or use ImageMagick: <code>convert splash.svg splash.png</code></li>
      <li>Or use an online PWA asset generator like <a href="https://www.pwabuilder.com/imageGenerator" target="_blank">PWA Builder</a></li>
    </ol>
    
    <h2>Recommended: Use PWA Asset Generator</h2>
    <p>For best results, use the npm package <code>pwa-asset-generator</code>:</p>
    <pre><code>npx pwa-asset-generator icon-512.png ./public/splash --splash-only --background "#1f2937"</code></pre>
    
    <h2>Or use this online tool:</h2>
    <p><a href="https://progressier.com/pwa-splash-screen-generator" target="_blank">Progressive Web App Splash Screen Generator</a></p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(splashDir, 'converter.html'), htmlConverter);

console.log('\n✓ All splash screen templates generated!');
console.log(`\nLocation: ${splashDir}`);
console.log('\nNext steps:');
console.log('1. Convert SVG files to PNG using one of these methods:');
console.log('   - Online: https://www.pwabuilder.com/imageGenerator');
console.log('   - NPM: npx pwa-asset-generator frontend/public/android-chrome-512x512.png frontend/public/splash --splash-only --background "#1f2937"');
console.log('   - ImageMagick: convert splash.svg splash.png');
console.log('\nNote: SVG splash screens work on some iOS versions, but PNG is more reliable.');
