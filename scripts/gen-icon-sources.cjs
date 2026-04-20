/**
 * Genere les 3 sources d'icones pour capacitor-assets a partir du logo.
 *
 * Pour qu'Android genere une adaptive icon correcte :
 *  - icon-foreground.png : 1024x1024 avec le cameleon centre dans
 *    la "safe zone" (672x672 centre). Le reste est rogne par le launcher.
 *  - icon-background.png : 1024x1024 couleur unie (mint).
 *  - icon.png : 1024x1024 version classique (pour devices sans adaptive).
 *
 * Cela produit un look natif : cameleon bien cadre, fond mint,
 * masque circulaire/squircle/square gerre par le launcher.
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'public', 'icons', 'logo.png');
const OUT_DIR = path.join(ROOT, 'assets');

const MINT = '#30D79C';
const CANVAS_SIZE = 1024;
// Safe zone Android adaptive = 66% du canvas. On met le cameleon a 60%
// pour avoir une petite marge supplementaire.
const LOGO_SIZE = Math.round(CANVAS_SIZE * 0.60); // 614px

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(SOURCE)) {
    console.error('Source not found:', SOURCE);
    process.exit(1);
  }

  // 1. Charger et redimensionner le logo (le logo PNG a des bandes blanches
  // sur les cotes; on le contain dans un carre transparent, puis on le met
  // sur fond mint).
  const logoBuf = await sharp(SOURCE)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. icon-background.png : 1024x1024 mint plein
  await sharp({
    create: {
      width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4,
      background: MINT,
    },
  }).png().toFile(path.join(OUT_DIR, 'icon-background.png'));
  console.log('✓ icon-background.png');

  // 3. icon-foreground.png : 1024x1024 transparent avec cameleon centre
  const offset = Math.round((CANVAS_SIZE - LOGO_SIZE) / 2);
  await sharp({
    create: {
      width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logoBuf, left: offset, top: offset }])
    .png()
    .toFile(path.join(OUT_DIR, 'icon-foreground.png'));
  console.log('✓ icon-foreground.png');

  // 4. icon.png : version "flat" pour les anciens Android (< 8) ou icones
  // non-adaptatives. On combine foreground+background en un seul.
  const bgBuf = await sharp({
    create: {
      width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4,
      background: MINT,
    },
  }).png().toBuffer();
  await sharp(bgBuf)
    .composite([{ input: logoBuf, left: offset, top: offset }])
    .png()
    .toFile(path.join(OUT_DIR, 'icon.png'));
  console.log('✓ icon.png');

  // 5. icon-only.png (ancien format) = meme que icon.png
  await sharp(bgBuf)
    .composite([{ input: logoBuf, left: offset, top: offset }])
    .png()
    .toFile(path.join(OUT_DIR, 'icon-only.png'));
  console.log('✓ icon-only.png');

  console.log('\nDone. Now run: npx capacitor-assets generate --android');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
