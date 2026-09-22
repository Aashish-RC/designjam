export interface ClickPoint {
  x: number;
  y: number;
  weight: number; // 0.1 to 1.0
  type?: 'click' | 'dead_click' | 'hover';
}

export interface HeatmapOptions {
  width: number;
  height: number;
  radius: number;
  opacity: number;
  colorTheme: 'thermal' | 'amber' | 'cyan';
}

/**
 * Generates an SVG click heatmap overlay infused from Quant-UX
 */
export function generateHeatmapSvg(points: ClickPoint[], opts: HeatmapOptions): string {
  const { width, height, radius, opacity } = opts;

  let circles = '';
  points.forEach((p, idx) => {
    const ptRadius = radius * (0.8 + p.weight * 0.6);
    const gradId = `pt-grad-${idx}`;
    circles += `
      <defs>
        <radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="${(p.weight * 0.85).toFixed(2)}" />
          <stop offset="35%" stop-color="#f59e0b" stop-opacity="${(p.weight * 0.6).toFixed(2)}" />
          <stop offset="65%" stop-color="#10b981" stop-opacity="${(p.weight * 0.35).toFixed(2)}" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${ptRadius.toFixed(1)}" fill="url(#${gradId})" />
    `;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="opacity: ${opacity}; pointer-events: none;">
  <g id="quantux-heatmap-overlay">
    ${circles}
  </g>
</svg>
  `.trim();
}

/**
 * Generates realistic simulation click events for testing and demo visualization
 */
export function generateSimulatedClicks(width: number, height: number, count: number = 35): ClickPoint[] {
  const points: ClickPoint[] = [];

  // Hotspot 1: Primary CTA / Header Area
  const ctaX = width * 0.5;
  const ctaY = height * 0.65;

  // Hotspot 2: Nav bar
  const navX = width * 0.85;
  const navY = height * 0.08;

  for (let i = 0; i < count; i++) {
    const cluster = Math.random();
    let x = 0;
    let y = 0;

    if (cluster < 0.6) {
      // Clustered around primary CTA
      x = ctaX + (Math.random() - 0.5) * (width * 0.25);
      y = ctaY + (Math.random() - 0.5) * (height * 0.12);
    } else if (cluster < 0.85) {
      // Clustered around top navigation
      x = navX + (Math.random() - 0.5) * (width * 0.2);
      y = navY + (Math.random() - 0.5) * (height * 0.08);
    } else {
      // Random exploration / dead clicks
      x = Math.random() * width;
      y = Math.random() * height;
    }

    points.push({
      x: Math.max(10, Math.min(width - 10, x)),
      y: Math.max(10, Math.min(height - 10, y)),
      weight: 0.4 + Math.random() * 0.6,
      type: cluster >= 0.85 ? 'dead_click' : 'click',
    });
  }

  return points;
}
