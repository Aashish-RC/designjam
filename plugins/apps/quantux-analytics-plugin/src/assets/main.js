// src/analytics/heatmaps.ts
function generateHeatmapSvg(points, opts) {
  const { width, height, radius, opacity } = opts;
  let circles = "";
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
function generateSimulatedClicks(width, height, count = 35) {
  const points = [];
  const ctaX = width * 0.5;
  const ctaY = height * 0.65;
  const navX = width * 0.85;
  const navY = height * 0.08;
  for (let i = 0; i < count; i++) {
    const cluster = Math.random();
    let x = 0;
    let y = 0;
    if (cluster < 0.6) {
      x = ctaX + (Math.random() - 0.5) * (width * 0.25);
      y = ctaY + (Math.random() - 0.5) * (height * 0.12);
    } else if (cluster < 0.85) {
      x = navX + (Math.random() - 0.5) * (width * 0.2);
      y = navY + (Math.random() - 0.5) * (height * 0.08);
    } else {
      x = Math.random() * width;
      y = Math.random() * height;
    }
    points.push({
      x: Math.max(10, Math.min(width - 10, x)),
      y: Math.max(10, Math.min(height - 10, y)),
      weight: 0.4 + Math.random() * 0.6,
      type: cluster >= 0.85 ? "dead_click" : "click"
    });
  }
  return points;
}

// src/analytics/funnels.ts
function calculateFunnelMetrics(stepsData) {
  const steps = [];
  const totalStarted = stepsData.length > 0 ? stepsData[0].visitors : 0;
  let maxDropOff = -1;
  let bottleneck = "None";
  for (let i = 0; i < stepsData.length; i++) {
    const curr = stepsData[i];
    const nextVisitors = i + 1 < stepsData.length ? stepsData[i + 1].visitors : curr.visitors;
    const dropOffs = curr.visitors - nextVisitors;
    const rate = totalStarted > 0 ? curr.visitors / totalStarted * 100 : 0;
    if (dropOffs > maxDropOff) {
      maxDropOff = dropOffs;
      bottleneck = curr.name;
    }
    steps.push({
      stepIndex: i + 1,
      name: curr.name,
      screenName: curr.screenName,
      visitors: curr.visitors,
      dropOffs,
      conversionRate: Math.round(rate * 10) / 10,
      avgTimeSeconds: curr.avgTimeSeconds
    });
  }
  const totalCompleted = steps.length > 0 ? steps[steps.length - 1].visitors : 0;
  const overallRate = totalStarted > 0 ? totalCompleted / totalStarted * 100 : 0;
  return {
    totalStarted,
    totalCompleted,
    overallConversionRate: Math.round(overallRate * 10) / 10,
    bottleneckStep: bottleneck,
    steps
  };
}

// src/main.ts
var activeTab = "tab-heatmaps";
var currentHeatmapSvg = "";
var previewContainer = document.getElementById("heatmap-preview-container");
var btnOverlay = document.getElementById("btn-overlay-heatmap");
var funnelContainer = document.getElementById("funnel-steps-container");
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab || "tab-heatmaps";
    const content = document.getElementById(activeTab);
    if (content) content.classList.add("active");
  });
});
function initHeatmap() {
  const width = 360;
  const height = 180;
  const clicks = generateSimulatedClicks(width, height, 40);
  const opts = {
    width,
    height,
    radius: 28,
    opacity: 0.85,
    colorTheme: "thermal"
  };
  currentHeatmapSvg = generateHeatmapSvg(clicks, opts);
  if (previewContainer) {
    previewContainer.innerHTML = currentHeatmapSvg;
  }
}
function initFunnel() {
  const funnel = calculateFunnelMetrics([
    { name: "1. Landing Screen", screenName: "Home", visitors: 1240, avgTimeSeconds: 8.2 },
    { name: "2. Pricing Selection", screenName: "Pricing", visitors: 980, avgTimeSeconds: 15.4 },
    { name: "3. Registration Form", screenName: "Sign Up", visitors: 820, avgTimeSeconds: 22.1 },
    { name: "4. Checkout Complete", screenName: "Success", visitors: 762, avgTimeSeconds: 11 }
  ]);
  if (funnelContainer) {
    funnelContainer.innerHTML = funnel.steps.map(
      (s) => `
        <div class="funnel-step-bar">
          <span>${s.name}</span>
          <span style="font-weight: 700; color: #38bdf8;">${s.visitors} (${s.conversionRate}%)</span>
        </div>
      `
    ).join("");
  }
}
btnOverlay.addEventListener("click", () => {
  if (!currentHeatmapSvg) return;
  parent.postMessage(
    {
      type: "overlay-heatmap",
      content: {
        svg: currentHeatmapSvg,
        boardName: "Quant-UX Usability Heatmap"
      }
    },
    "*"
  );
  const orig = btnOverlay.textContent;
  btnOverlay.textContent = "Heatmap Overlaid on Canvas!";
  setTimeout(() => {
    btnOverlay.textContent = orig;
  }, 1400);
});
initHeatmap();
initFunnel();
