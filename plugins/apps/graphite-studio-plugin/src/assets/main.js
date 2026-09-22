// src/app/generators.ts
function generateSpiralSvg(opts) {
  const size = opts.radius * 2 + 40;
  const cx = size / 2;
  const cy = size / 2;
  let pathData = "";
  if (opts.type === "archimedean") {
    const totalAngle = opts.turns * 2 * Math.PI;
    const b = opts.radius / totalAngle;
    const steps = opts.pointsCount;
    for (let i = 0; i <= steps; i++) {
      const theta = i / steps * totalAngle;
      const r = b * theta;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      pathData += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  } else if (opts.type === "logarithmic") {
    const totalAngle = opts.turns * 2 * Math.PI;
    const b = 0.18;
    const a = opts.radius / Math.exp(b * totalAngle);
    const steps = opts.pointsCount;
    for (let i = 0; i <= steps; i++) {
      const theta = i / steps * totalAngle;
      const r = a * Math.exp(b * theta);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      pathData += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  } else {
    const goldenAngle = 137.507764 * (Math.PI / 180);
    const c = opts.radius / Math.sqrt(opts.pointsCount);
    let circles = "";
    for (let n = 1; n <= opts.pointsCount; n++) {
      const r = c * Math.sqrt(n);
      const theta = n * goldenAngle;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      const dotRadius = Math.max(1.5, r / opts.radius * 4);
      circles += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${dotRadius.toFixed(2)}" fill="${opts.strokeColor}" opacity="${(0.4 + n / opts.pointsCount * 0.6).toFixed(2)}" />`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><g id="graphite-fibonacci-spiral">${circles}</g></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><path d="${pathData}" fill="none" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
}
function generateRadialArraySvg(opts) {
  const size = opts.outerRadius * 2 + 40;
  const cx = size / 2;
  const cy = size / 2;
  let elements = "";
  const stepAngle = 2 * Math.PI / opts.count;
  for (let i = 0; i < opts.count; i++) {
    const angle = i * stepAngle;
    const deg = angle * 180 / Math.PI;
    if (opts.shapeType === "petal") {
      const r = (opts.innerRadius + opts.outerRadius) / 2;
      const length = opts.outerRadius - opts.innerRadius;
      elements += `<path d="M 0 0 C ${opts.elementSize} ${-length / 2}, ${opts.elementSize} ${-length}, 0 ${-length} C ${-opts.elementSize} ${-length}, ${-opts.elementSize} ${-length / 2}, 0 0 Z" transform="translate(${cx}, ${cy}) rotate(${deg})" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" opacity="0.85" />`;
    } else if (opts.shapeType === "circle") {
      const x = cx + opts.outerRadius * Math.cos(angle);
      const y = cy + opts.outerRadius * Math.sin(angle);
      elements += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${opts.elementSize}" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" />`;
    } else if (opts.shapeType === "capsule") {
      const w = opts.elementSize;
      const h = opts.outerRadius - opts.innerRadius;
      elements += `<rect x="${-w / 2}" y="${-opts.outerRadius}" width="${w}" height="${h}" rx="${w / 2}" transform="translate(${cx}, ${cy}) rotate(${deg})" fill="${opts.fillColor}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" />`;
    } else {
      const x1 = cx + opts.innerRadius * Math.cos(angle);
      const y1 = cy + opts.innerRadius * Math.sin(angle);
      const x2 = cx + opts.outerRadius * Math.cos(angle);
      const y2 = cy + opts.outerRadius * Math.sin(angle);
      elements += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${opts.strokeColor}" stroke-width="${opts.strokeWidth}" stroke-linecap="round" />`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><g id="graphite-radial-array">${elements}</g></svg>`;
}
function generateHarmonicWaveSvg(opts) {
  const steps = 120;
  const stepX = opts.width / steps;
  let paths = "";
  for (let w = 0; w < opts.wavesCount; w++) {
    const phaseOffset = opts.phase + w * Math.PI / (opts.wavesCount + 1);
    const amp = opts.amplitude * (1 - w * 0.15);
    const midY = opts.height / 2;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = i * stepX;
      const y = midY + amp * Math.sin(i / steps * opts.frequency * 2 * Math.PI + phaseOffset) + amp * 0.3 * Math.cos(i / steps * opts.frequency * 4 * Math.PI);
      d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    if (opts.hasFill) {
      const fillD = `${d} L ${opts.width} ${opts.height} L 0 ${opts.height} Z`;
      paths += `<path d="${fillD}" fill="${opts.fillColor}" opacity="${(0.25 + w * 0.15).toFixed(2)}" />`;
    }
    paths += `<path d="${d}" fill="none" stroke="${opts.strokeColor}" stroke-width="2.5" opacity="${(0.5 + w * 0.25).toFixed(2)}" stroke-linecap="round" />`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${opts.width} ${opts.height}" width="${opts.width}" height="${opts.height}"><g id="graphite-harmonic-waves">${paths}</g></svg>`;
}

// src/app/filters.ts
function buildSvgFilterDef(id, opts) {
  let primitives = "";
  if (opts.invert) {
    primitives += `
      <feComponentTransfer>
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
    `;
  }
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
  if (opts.hueSatEnabled) {
    if (opts.hueRotate !== 0) {
      primitives += `<feColorMatrix type="hueRotate" values="${opts.hueRotate}" />`;
    }
    if (opts.saturation !== 1) {
      primitives += `<feColorMatrix type="saturate" values="${opts.saturation.toFixed(2)}" />`;
    }
  }
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
function createFilteredDemonstrationSvg(filterId, filterDef) {
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

// src/main.ts
var activeTab = "tab-spirals";
var currentGeneratedSvg = "";
var currentShapeName = "Graphite Procedural Spiral";
var previewContainer = document.getElementById("preview-container");
var btnInsert = document.getElementById("btn-insert-canvas");
var btnCopySvg = document.getElementById("btn-export-svg");
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab || "tab-spirals";
    const targetContent = document.getElementById(activeTab);
    if (targetContent) {
      targetContent.classList.add("active");
    }
    renderActivePreview();
  });
});
var spiralType = "archimedean";
document.querySelectorAll("#spiral-type-group .segment-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#spiral-type-group .segment-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    spiralType = btn.dataset.type || "archimedean";
    renderActivePreview();
  });
});
var radialShapeType = "petal";
document.querySelectorAll("#radial-type-group .segment-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#radial-type-group .segment-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    radialShapeType = btn.dataset.shape || "petal";
    renderActivePreview();
  });
});
function bindRange(id, labelId, suffix = "") {
  const input = document.getElementById(id);
  const label = document.getElementById(labelId);
  if (!input || !label) return;
  input.addEventListener("input", () => {
    label.textContent = input.value + suffix;
    renderActivePreview();
  });
}
bindRange("param-spiral-turns", "val-spiral-turns");
bindRange("param-spiral-radius", "val-spiral-radius");
bindRange("param-spiral-points", "val-spiral-points");
bindRange("param-spiral-width", "val-spiral-width", "px");
bindRange("param-radial-count", "val-radial-count");
bindRange("param-radial-inner", "val-radial-inner");
bindRange("param-radial-outer", "val-radial-outer");
bindRange("param-wave-count", "val-wave-count");
bindRange("param-wave-freq", "val-wave-freq");
bindRange("param-wave-amp", "val-wave-amp");
bindRange("param-filter-high", "val-filter-high");
bindRange("param-filter-gamma", "val-filter-gamma");
bindRange("param-filter-hue", "val-filter-hue", "\xB0");
bindRange("param-filter-sat", "val-filter-sat");
["param-spiral-color", "param-radial-fill", "param-radial-stroke", "param-wave-stroke", "param-wave-fill"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", renderActivePreview);
});
["param-wave-hasfill", "param-filter-invert", "param-filter-threshold"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", renderActivePreview);
});
function renderActivePreview() {
  if (activeTab === "tab-spirals") {
    const turns = parseFloat(document.getElementById("param-spiral-turns").value);
    const radius = parseFloat(document.getElementById("param-spiral-radius").value);
    const pointsCount = parseInt(document.getElementById("param-spiral-points").value, 10);
    const strokeColor = document.getElementById("param-spiral-color").value;
    const strokeWidth = parseFloat(document.getElementById("param-spiral-width").value);
    const opts = {
      type: spiralType,
      turns,
      radius,
      pointsCount,
      strokeColor,
      strokeWidth
    };
    currentShapeName = `Graphite ${spiralType.charAt(0).toUpperCase() + spiralType.slice(1)} Spiral`;
    currentGeneratedSvg = generateSpiralSvg(opts);
  } else if (activeTab === "tab-radials") {
    const count = parseInt(document.getElementById("param-radial-count").value, 10);
    const innerRadius = parseFloat(document.getElementById("param-radial-inner").value);
    const outerRadius = parseFloat(document.getElementById("param-radial-outer").value);
    const fillColor = document.getElementById("param-radial-fill").value;
    const strokeColor = document.getElementById("param-radial-stroke").value;
    const opts = {
      shapeType: radialShapeType,
      count,
      innerRadius,
      outerRadius,
      elementSize: 12,
      fillColor,
      strokeColor,
      strokeWidth: 1.5
    };
    currentShapeName = `Graphite Radial Array (${count}x)`;
    currentGeneratedSvg = generateRadialArraySvg(opts);
  } else if (activeTab === "tab-waves") {
    const wavesCount = parseInt(document.getElementById("param-wave-count").value, 10);
    const frequency = parseFloat(document.getElementById("param-wave-freq").value);
    const amplitude = parseFloat(document.getElementById("param-wave-amp").value);
    const strokeColor = document.getElementById("param-wave-stroke").value;
    const fillColor = document.getElementById("param-wave-fill").value;
    const hasFill = document.getElementById("param-wave-hasfill").checked;
    const opts = {
      wavesCount,
      frequency,
      amplitude,
      phase: 0,
      width: 280,
      height: 140,
      strokeColor,
      fillColor,
      hasFill
    };
    currentShapeName = "Graphite Harmonic Waves";
    currentGeneratedSvg = generateHarmonicWaveSvg(opts);
  } else if (activeTab === "tab-filters") {
    const highlights = parseFloat(document.getElementById("param-filter-high").value);
    const midtones = parseFloat(document.getElementById("param-filter-gamma").value);
    const hueRotate = parseFloat(document.getElementById("param-filter-hue").value);
    const saturation = parseFloat(document.getElementById("param-filter-sat").value);
    const invert = document.getElementById("param-filter-invert").checked;
    const thresholdEnabled = document.getElementById("param-filter-threshold").checked;
    const filterOpts = {
      levelsEnabled: true,
      shadows: 0,
      midtones,
      highlights,
      hueSatEnabled: true,
      hueRotate,
      saturation,
      balanceEnabled: false,
      redShift: 0,
      greenShift: 0,
      blueShift: 0,
      invert,
      thresholdEnabled,
      threshold: 0.5
    };
    const filterId = "graphite-tone-filter";
    const filterDef = buildSvgFilterDef(filterId, filterOpts);
    currentShapeName = "Graphite Raster Filter";
    currentGeneratedSvg = createFilteredDemonstrationSvg(filterId, filterDef);
  }
  if (previewContainer) {
    previewContainer.innerHTML = currentGeneratedSvg;
  }
}
btnInsert.addEventListener("click", () => {
  if (!currentGeneratedSvg) return;
  parent.postMessage(
    {
      type: "insert-shape",
      content: {
        name: currentShapeName,
        svg: currentGeneratedSvg
      }
    },
    "*"
  );
  const originalHtml = btnInsert.innerHTML;
  btnInsert.innerHTML = `<span>Inserted!</span>`;
  setTimeout(() => {
    btnInsert.innerHTML = originalHtml;
  }, 1200);
});
btnCopySvg.addEventListener("click", async () => {
  if (!currentGeneratedSvg) return;
  try {
    await navigator.clipboard.writeText(currentGeneratedSvg);
    const originalText = btnCopySvg.textContent;
    btnCopySvg.textContent = "Copied!";
    setTimeout(() => {
      btnCopySvg.textContent = originalText;
    }, 1200);
  } catch (err) {
    console.error("Failed to copy SVG to clipboard:", err);
  }
});
window.addEventListener("message", (event) => {
  if (event.data?.type === "theme") {
    console.log("[Graphite Plugin] Penpot theme updated:", event.data.content);
  }
});
renderActivePreview();
