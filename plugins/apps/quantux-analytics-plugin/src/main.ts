import { generateHeatmapSvg, generateSimulatedClicks, HeatmapOptions } from './analytics/heatmaps.js';
import { calculateFunnelMetrics } from './analytics/funnels.js';
import { evaluateABTest } from './analytics/abTesting.js';

let activeTab = 'tab-heatmaps';
let currentHeatmapSvg = '';

const previewContainer = document.getElementById('heatmap-preview-container') as HTMLElement;
const btnOverlay = document.getElementById('btn-overlay-heatmap') as HTMLButtonElement;
const funnelContainer = document.getElementById('funnel-steps-container') as HTMLElement;

// Tab switcher
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');
    activeTab = (btn as HTMLElement).dataset.tab || 'tab-heatmaps';
    const content = document.getElementById(activeTab);
    if (content) content.classList.add('active');
  });
});

// Render Heatmap
function initHeatmap() {
  const width = 360;
  const height = 180;
  const clicks = generateSimulatedClicks(width, height, 40);

  const opts: HeatmapOptions = {
    width,
    height,
    radius: 28,
    opacity: 0.85,
    colorTheme: 'thermal',
  };

  currentHeatmapSvg = generateHeatmapSvg(clicks, opts);
  if (previewContainer) {
    previewContainer.innerHTML = currentHeatmapSvg;
  }
}

// Render Funnel
function initFunnel() {
  const funnel = calculateFunnelMetrics([
    { name: '1. Landing Screen', screenName: 'Home', visitors: 1240, avgTimeSeconds: 8.2 },
    { name: '2. Pricing Selection', screenName: 'Pricing', visitors: 980, avgTimeSeconds: 15.4 },
    { name: '3. Registration Form', screenName: 'Sign Up', visitors: 820, avgTimeSeconds: 22.1 },
    { name: '4. Checkout Complete', screenName: 'Success', visitors: 762, avgTimeSeconds: 11.0 },
  ]);

  if (funnelContainer) {
    funnelContainer.innerHTML = funnel.steps
      .map(
        (s) => `
        <div class="funnel-step-bar">
          <span>${s.name}</span>
          <span style="font-weight: 700; color: #38bdf8;">${s.visitors} (${s.conversionRate}%)</span>
        </div>
      `
      )
      .join('');
  }
}

btnOverlay.addEventListener('click', () => {
  if (!currentHeatmapSvg) return;

  parent.postMessage(
    {
      type: 'overlay-heatmap',
      content: {
        svg: currentHeatmapSvg,
        boardName: 'Demo Preview Usability Heatmap',
      },
    },
    '*'
  );

  const orig = btnOverlay.textContent;
  btnOverlay.textContent = 'Demo Heatmap Overlaid on Canvas!';
  setTimeout(() => {
    btnOverlay.textContent = orig;
  }, 1400);
});

initHeatmap();
initFunnel();
