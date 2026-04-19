/**
 * Générateur QR-like SVG déterministe à partir d'une graine (seed).
 * Pour la v1, on génère un motif pseudo-QR visuel.
 * v2 : remplacer par une vraie lib QR (qrcode.react ou similar).
 */

export interface QrOptions {
  readonly size?: number;
  readonly fg?: string;
  readonly bg?: string;
  readonly grid?: number;
}

/** Hash rapide d'une string → int 32 bits. */
function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Génère un SVG QR-like déterministe. */
export function generateQrSvg(seed: string, opts: QrOptions = {}): string {
  const size = opts.size ?? 160;
  const grid = opts.grid ?? 21;
  const fg = opts.fg ?? '#0F1620';
  const bg = opts.bg ?? '#FFFFFF';
  const cell = size / grid;
  const h = hash32(seed);

  let rects = '';
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      // Finder patterns (3 corners)
      const inTopLeft = x < 7 && y < 7;
      const inTopRight = x >= grid - 7 && y < 7;
      const inBottomLeft = x < 7 && y >= grid - 7;
      const inFinder = inTopLeft || inTopRight || inBottomLeft;

      if (inFinder) {
        const lx = inTopLeft ? x : inTopRight ? x - (grid - 7) : x;
        const ly = inTopLeft || inTopRight ? y : y - (grid - 7);
        const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const onCenter = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        if (onEdge || onCenter) {
          rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
        }
        continue;
      }

      // Timing patterns
      if ((x === 6 || y === 6) && (x + y) % 2 === 0) {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
        continue;
      }

      // Data bits (pseudo)
      const bit = (h >> ((x * grid + y) % 31)) & 1;
      const noise = (hash32(seed + x + ',' + y) & 1);
      if ((bit ^ noise) === 1) {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  ${rects}
</svg>`;
}
