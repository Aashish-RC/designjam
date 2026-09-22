/**
 * Non-Destructive Raster Adjustment Filters infused from Graphite
 * Generates standard SVG <filter> specifications for Levels, Curves, Hue/Sat, and Tone.
 */

export interface FilterOptions {
  // Levels: shadows (0-1), midtones (0.1-3.0 gamma), highlights (0-1)
  levelsEnabled: boolean;
  shadows: number;
  midtones: number;
  highlights: number;

  // Hue & Saturation
  hueSatEnabled: boolean;
  hueRotate: number; // degrees -180 to 180
  saturation: number; // 0 to 3 (1 is normal)

  // Color Balance / Tint
  balanceEnabled: boolean;
  redShift: number; // -1 to 1
  greenShift: number; // -1 to 1
  blueShift: number; // -1 to 1

  // Invert & Threshold
  invert: boolean;
  thresholdEnabled: boolean;
  threshold: number; // 0 to 1
}

/**
 * Builds SVG filter definition markup based on adjustment parameters
 */
export function buildSvgFilterDef(id: string, opts: FilterOptions): string {
  let primitives = '';

  // 1. Invert
  if (opts.invert) {
    primitives += `
      <feComponentTransfer>
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
    `;
  }

  // 2. Levels (Shadows, Midtones gamma, Highlights)
  if (opts.levelsEnabled) {
    const range = Math.max(0.01, opts.highlights - opts.shadows);
    const slope = (1 / range).toFixed(3);
    const intercept = (-opts.shadows / range).toFixed(3);
    const exponent = (1 / Math.max(0.1, opts.midtones)).toFixed(3);

    primitives += `
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="${slope}" exponent="${exponent}" offset="${intercept}"/>
        <feFuncG type="gamma" amplitude="${slope}" exponent="${exponent}" offset="${intercept}"/>
        <feFuncB type="gamma" amplitude="${slope}" exponent="${exponent}" offset="${intercept}"/>
      </feComponentTransfer>
    `;
  }

  // 3. Hue & Saturation
  if (opts.hueSatEnabled) {
    if (opts.hueRotate !== 0) {
      primitives += `<feColorMatrix type="hueRotate" values="${opts.hueRotate}" />`;
    }
    if (opts.saturation !== 1) {
      primitives += `<feColorMatrix type="saturate" values="${opts.saturation.toFixed(2)}" />`;
    }
  }

  // 4. Color Balance / Channel Offsets
  if (opts.balanceEnabled) {
    const rSlope = (1 + opts.redShift * 0.5).toFixed(2);
    const gSlope = (1 + opts.greenShift * 0.5).toFixed(2);
    const bSlope = (1 + opts.blueShift * 0.5).toFixed(2);
    primitives += `
      <feComponentTransfer>
        <feFuncR type="linear" slope="${rSlope}" intercept="${(opts.redShift * 0.1).toFixed(2)}"/>
        <feFuncG type="linear" slope="${gSlope}" intercept="${(opts.greenShift * 0.1).toFixed(2)}"/>
        <feFuncB type="linear" slope="${bSlope}" intercept="${(opts.blueShift * 0.1).toFixed(2)}"/>
      </feComponentTransfer>
    `;
  }

  // 5. Threshold (Black/White high-contrast binary separation)
  if (opts.thresholdEnabled) {
    const thresh = opts.threshold.toFixed(2);
    primitives += `
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/>
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 1"/>
        <feFuncG type="discrete" tableValues="0 1"/>
        <feFuncB type="discrete" tableValues="0 1"/>
      </feComponentTransfer>
    `;
  }

  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%">${primitives}</filter>`;
}

/**
 * Creates a demo filtered image SVG for instant canvas insertion
 */
export function createFilteredDemonstrationSvg(filterId: string, filterDef: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    ${filterDef}
    <linearGradient id="grad-demo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="16" fill="url(#grad-demo)" filter="url(#${filterId})" />
  <circle cx="120" cy="150" r="60" fill="#ffffff" opacity="0.8" filter="url(#${filterId})" />
  <polygon points="260,90 320,210 200,210" fill="#fbbf24" filter="url(#${filterId})" />
</svg>
`.trim();
}
