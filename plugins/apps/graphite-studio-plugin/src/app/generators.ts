/**
 * Procedural Vector Generators infused from Graphite
 * Provides pure mathematical algorithms generating clean, compliant SVG markup.
 */

export interface SpiralOptions {
  type: 'archimedean' | 'logarithmic' | 'fibonacci';
  turns: number;
  radius: number;
  pointsCount: number;
  strokeColor: string;
  strokeWidth: number;
}

export interface RadialArrayOptions {
  shapeType: 'petal' | 'circle' | 'spoke' | 'capsule';
  count: number;
  innerRadius: number;
  outerRadius: number;
  elementSize: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface WaveOptions {
  wavesCount: number;
  frequency: number;
  amplitude: number;
  phase: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  hasFill: boolean;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Generate parametric spiral SVG markup
 */
export function generateSpiralSvg(opts: SpiralOptions): string {
  const size = opts.radius * 2 + 40;
  const cx = size / 2;
  const cy = size / 2;

  let pathData = '';

  if (opts.type === 'archimedean') {
    const totalAngle = opts.turns * 2 * Math.PI;
    const b = opts.radius / totalAngle;
    const steps = opts.pointsCount;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * totalAngle;
      const r = b * theta;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      pathData += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  } else if (opts.type === 'logarithmic') {
    const totalAngle = opts.turns * 2 * Math.PI;
    const b = 0.18;
    const a = opts.radius / Math.exp(b * totalAngle);
    const steps = opts.pointsCount;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * totalAngle;
      const r = a * Math.exp(b * theta);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      pathData += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  } else {
    // Fibonacci / Phyllotaxis Sunflower Spiral
    const goldenAngle = 137.507764 * (Math.PI / 180);
    const c = opts.radius / Math.sqrt(opts.pointsCount);
    let circles = '';

    for (let n = 1; n <= opts.pointsCount; n++) {
      const r = c * Math.sqrt(n);
      const theta = n * goldenAngle;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      const dotRadius = Math.max(1.5, (r / opts.radius) * 4);
      circles += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${dotRadius.toFixed(2)}" fill="${opts.strokeColor}" opacity="${(0.4 + (n / opts.pointsCount) * 0.6).toFixed(2)}" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><g id="graphite-fibonacci-spiral">${circles}</g></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><path d="${pathData}" fill="none" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
}

/**
 * Generate procedural radial / circular repetition array
 */
export function generateRadialArraySvg(opts: RadialArrayOptions): string {
  const size = opts.outerRadius * 2 + 40;
  const cx = size / 2;
  const cy = size / 2;
  let elements = '';

  const stepAngle = (2 * Math.PI) / opts.count;

  for (let i = 0; i < opts.count; i++) {
    const angle = i * stepAngle;
    const deg = (angle * 180) / Math.PI;

    if (opts.shapeType === 'petal') {
      const r = (opts.innerRadius + opts.outerRadius) / 2;
      const length = opts.outerRadius - opts.innerRadius;
      elements += `<path d="M 0 0 C ${opts.elementSize} ${-length/2}, ${opts.elementSize} ${-length}, 0 ${-length} C ${-opts.elementSize} ${-length}, ${-opts.elementSize} ${-length/2}, 0 0 Z" transform="translate(${cx}, ${cy}) rotate(${deg})" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" opacity="0.85" />`;
    } else if (opts.shapeType === 'circle') {
      const x = cx + opts.outerRadius * Math.cos(angle);
      const y = cy + opts.outerRadius * Math.sin(angle);
      elements += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${opts.elementSize}" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" />`;
    } else if (opts.shapeType === 'capsule') {
      const w = opts.elementSize;
      const h = opts.outerRadius - opts.innerRadius;
      elements += `<rect x="${-w/2}" y="${-opts.outerRadius}" width="${w}" height="${h}" rx="${w/2}" transform="translate(${cx}, ${cy}) rotate(${deg})" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" />`;
    } else {
      // Spoke line
      const x1 = cx + opts.innerRadius * Math.cos(angle);
      const y1 = cy + opts.innerRadius * Math.sin(angle);
      const x2 = cx + opts.outerRadius * Math.cos(angle);
      const y2 = cy + opts.outerRadius * Math.sin(angle);
      elements += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" stroke-linecap="round" />`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><g id="graphite-radial-array">${elements}</g></svg>`;
}

/**
 * Generate harmonic oscillation wave SVG
 */
export function generateHarmonicWaveSvg(opts: WaveOptions): string {
  const steps = 120;
  const stepX = opts.width / steps;
  let paths = '';

  for (let w = 0; w < opts.wavesCount; w++) {
    const phaseOffset = opts.phase + (w * Math.PI) / (opts.wavesCount + 1);
    const amp = opts.amplitude * (1 - w * 0.15);
    const midY = opts.height / 2;

    let d = '';
    for (let i = 0; i <= steps; i++) {
      const x = i * stepX;
      // Harmonic wave superposition: f(x) = A * sin(kx + phi) + 0.35 * A * cos(2kx)
      const y = midY + amp * Math.sin((i / steps) * opts.frequency * 2 * Math.PI + phaseOffset)
                     + (amp * 0.3) * Math.cos((i / steps) * opts.frequency * 4 * Math.PI);
      d += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    if (opts.hasFill) {
      const fillD = `${d} L ${opts.width} ${opts.height} L 0 ${opts.height} Z`;
      paths += `<path d="${fillD}" fill="${opts.fillColor}" opacity="${(0.25 + w * 0.15).toFixed(2)}" />`;
    }

    paths += `<path d="${d}" fill="none" stroke="${opts.strokeColor}" stroke-width="2.5" opacity="${(0.5 + w * 0.25).toFixed(2)}" stroke-linecap="round" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${opts.width} ${opts.height}" width="${opts.width}" height="${opts.height}"><g id="graphite-harmonic-waves">${paths}</g></svg>`;
}

/**
 * Catmull-Rom to Cubic Bezier curve converter
 */
export function generateCatmullRomSvg(points: Point[], tension: number = 0.5): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}
