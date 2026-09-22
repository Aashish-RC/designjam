// Test runner for Graphite Studio generators & filters
import {
  generateSpiralSvg,
  generateRadialArraySvg,
  generateHarmonicWaveSvg,
  generateCatmullRomSvg
} from './src/app/generators.ts';

import {
  buildSvgFilterDef,
  createFilteredDemonstrationSvg
} from './src/app/filters.ts';

console.log("=== RUNNING GRAPHITE PROCEDURAL & FILTER SUITE TESTS ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Test Archimedean Spiral
const archimedeanSvg = generateSpiralSvg({
  type: 'archimedean',
  turns: 4,
  radius: 80,
  pointsCount: 150,
  strokeColor: '#0ea5e9',
  strokeWidth: 2
});
assert(archimedeanSvg.startsWith('<svg') && archimedeanSvg.endsWith('</svg>'), 'Archimedean spiral generates valid SVG root');
assert(archimedeanSvg.includes('path d="M') && archimedeanSvg.includes('stroke="#0ea5e9"'), 'Archimedean spiral has valid path and stroke');

// 2. Test Fibonacci Sunflower Spiral
const fibonacciSvg = generateSpiralSvg({
  type: 'fibonacci',
  turns: 5,
  radius: 100,
  pointsCount: 100,
  strokeColor: '#ec4899',
  strokeWidth: 2
});
assert(fibonacciSvg.includes('<circle cx=') && fibonacciSvg.includes('graphite-fibonacci-spiral'), 'Fibonacci phyllotaxis generates valid circle elements');

// 3. Test Radial Array
const radialSvg = generateRadialArraySvg({
  shapeType: 'petal',
  count: 12,
  innerRadius: 20,
  outerRadius: 80,
  elementSize: 10,
  fillColor: '#8b5cf6',
  strokeColor: '#06b6d4',
  strokeWidth: 1.5
});
assert(radialSvg.includes('transform="translate(') && radialSvg.includes('rotate('), 'Radial array generates rotational geometry');
assert(radialSvg.includes('graphite-radial-array'), 'Radial array container has correct ID');

// 4. Test Harmonic Wave
const waveSvg = generateHarmonicWaveSvg({
  wavesCount: 3,
  frequency: 2.5,
  amplitude: 30,
  phase: 0,
  width: 300,
  height: 150,
  strokeColor: '#10b981',
  fillColor: '#059669',
  hasFill: true
});
assert(waveSvg.includes('graphite-harmonic-waves') && waveSvg.includes('viewBox="0 0 300 150"'), 'Harmonic waves generate multi-strand oscillating paths');

// 5. Test Catmull-Rom Spline
const splineD = generateCatmullRomSvg([
  { x: 10, y: 10 },
  { x: 50, y: 80 },
  { x: 100, y: 30 },
  { x: 150, y: 90 }
], 0.5);
assert(splineD.startsWith('M 10 10') && splineD.includes(' C '), 'Catmull-Rom interpolation outputs smooth cubic Bezier path');

// 6. Test Raster Filters
const filterDef = buildSvgFilterDef('test-filter', {
  levelsEnabled: true,
  shadows: 0.1,
  midtones: 1.2,
  highlights: 0.95,
  hueSatEnabled: true,
  hueRotate: 45,
  saturation: 1.5,
  balanceEnabled: true,
  redShift: 0.2,
  greenShift: -0.1,
  blueShift: 0.1,
  invert: true,
  thresholdEnabled: true,
  threshold: 0.6
});
assert(filterDef.includes('<filter id="test-filter"') && filterDef.includes('</filter>'), 'Filter def generates valid SVG filter root');
assert(filterDef.includes('<feComponentTransfer>') && filterDef.includes('<feColorMatrix type="hueRotate"'), 'Filter includes tone transfer and hue rotate matrix');

const demoSvg = createFilteredDemonstrationSvg('test-filter', filterDef);
assert(demoSvg.includes('filter="url(#test-filter)"'), 'Filtered demonstration SVG correctly applies filter URL reference');

console.log(`\nTEST SUMMARY: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
