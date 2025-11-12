import PImage from 'pureimage';
import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '..', 'public');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function drawNoteIcon(size) {
  const img = PImage.make(size, size);
  const ctx = img.getContext('2d');

  // background red circle
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // draw simple musical note (stem + head)
  ctx.fillStyle = '#ffffff';

  // note head (circle)
  const headR = size * 0.11;
  const headX = size * 0.45;
  const headY = size * 0.58;
  ctx.beginPath();
  ctx.arc(headX, headY, headR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // stem
  const stemWidth = Math.max(2, Math.round(size * 0.04));
  const stemHeight = size * 0.36;
  const stemX = headX + headR * 0.9;
  const stemY = headY - headR;
  ctx.fillRect(Math.round(stemX), Math.round(stemY - stemHeight), Math.round(stemWidth), Math.round(stemHeight));

  // flag (simple triangle)
  ctx.beginPath();
  ctx.moveTo(stemX + stemWidth, stemY - stemHeight + stemWidth);
  ctx.lineTo(stemX + stemWidth + size * 0.14, stemY - stemHeight + size * 0.05);
  ctx.lineTo(stemX + stemWidth, stemY - stemHeight + size * 0.15);
  ctx.closePath();
  ctx.fill();

  return img;
}

async function writePng(img, outPath) {
  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(outPath);
    PImage.encodePNGToStream(img, outStream)
      .then(() => resolve())
      .catch(reject);
  });
}

(async () => {
  try {
    const sizes = [192, 512, 32];
    const pngPaths = [];
    for (const s of sizes) {
      const img = drawNoteIcon(s);
      const outPath = path.join(OUT_DIR, `icon-${s}.png`);
      await writePng(img, outPath);
      console.log('Wrote', outPath);
      pngPaths.push(outPath);
    }

    // generate favicon.ico from 32x32 PNG
    const icoPath = path.join(OUT_DIR, 'favicon.ico');
    try {
      const buf = await pngToIco([pngPaths[2]]);
      fs.writeFileSync(icoPath, buf);
      console.log('Wrote', icoPath);
    } catch (err) {
      console.warn('png-to-ico conversion failed:', err);
      // fallback: copy 32 png as favicon.png
      const fallback = path.join(OUT_DIR, 'favicon.png');
      fs.copyFileSync(pngPaths[2], fallback);
      console.log('Wrote fallback', fallback);
    }

    console.log('Icon generation complete.');
  } catch (err) {
    console.error('Icon generation failed:', err);
    process.exit(1);
  }
})();
