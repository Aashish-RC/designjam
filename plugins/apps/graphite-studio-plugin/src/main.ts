import {
  generateSpiralSvg,
  generateRadialArraySvg,
  generateHarmonicWaveSvg,
  SpiralOptions,
  RadialArrayOptions,
  WaveOptions,
} from './app/generators.js';
import {
  buildSvgFilterDef,
  createFilteredDemonstrationSvg,
  FilterOptions,
} from './app/filters.js';

let activeTab = 'tab-spirals';
let currentGeneratedSvg = '';
let currentShapeName = 'Graphite Procedural Spiral';
let currentFilterId = '';
let currentFilterDef = '';

// DOM References
const previewContainer = document.getElementById('preview-container') as HTMLElement;
const btnInsert = document.getElementById('btn-insert-canvas') as HTMLButtonElement;
const btnCopySvg = document.getElementById('btn-export-svg') as HTMLButtonElement;

// Tab Switching
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');
    activeTab = (btn as HTMLElement).dataset.tab || 'tab-spirals';
    const targetContent = document.getElementById(activeTab);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    if (activeTab === 'tab-filters') {
      btnInsert.innerHTML = `<span>Apply Filter to Selection</span>`;
    } else {
      btnInsert.innerHTML = `<span>Insert Into Penpot Canvas</span>`;
    }

    renderActivePreview();
  });
});

// Segmented Buttons (Spiral Type)
let spiralType: 'archimedean' | 'logarithmic' | 'fibonacci' = 'archimedean';
document.querySelectorAll('#spiral-type-group .segment-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#spiral-type-group .segment-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    spiralType = (btn as HTMLElement).dataset.type as any || 'archimedean';
    renderActivePreview();
  });
});

// Segmented Buttons (Radial Shape Type)
let radialShapeType: 'petal' | 'circle' | 'spoke' | 'capsule' = 'petal';
document.querySelectorAll('#radial-type-group .segment-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#radial-type-group .segment-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    radialShapeType = (btn as HTMLElement).dataset.shape as any || 'petal';
    renderActivePreview();
  });
});

// Bind Range Inputs with Live Labels & Rerender
function bindRange(id: string, labelId: string, suffix: string = '') {
  const input = document.getElementById(id) as HTMLInputElement;
  const label = document.getElementById(labelId) as HTMLElement;
  if (!input || !label) return;

  input.addEventListener('input', () => {
    label.textContent = input.value + suffix;
    renderActivePreview();
  });
}

bindRange('param-spiral-turns', 'val-spiral-turns');
bindRange('param-spiral-radius', 'val-spiral-radius');
bindRange('param-spiral-points', 'val-spiral-points');
bindRange('param-spiral-width', 'val-spiral-width', 'px');

bindRange('param-radial-count', 'val-radial-count');
bindRange('param-radial-inner', 'val-radial-inner');
bindRange('param-radial-outer', 'val-radial-outer');

bindRange('param-wave-count', 'val-wave-count');
bindRange('param-wave-freq', 'val-wave-freq');
bindRange('param-wave-amp', 'val-wave-amp');

bindRange('param-filter-high', 'val-filter-high');
bindRange('param-filter-gamma', 'val-filter-gamma');
bindRange('param-filter-hue', 'val-filter-hue', '°');
bindRange('param-filter-sat', 'val-filter-sat');

// Bind Color and Checkbox Inputs
['param-spiral-color', 'param-radial-fill', 'param-radial-stroke', 'param-wave-stroke', 'param-wave-fill'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', renderActivePreview);
});

['param-wave-hasfill', 'param-filter-invert', 'param-filter-threshold'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', renderActivePreview);
});

// Render Active Tab Preview
function renderActivePreview() {
  if (activeTab === 'tab-spirals') {
    const turns = parseFloat((document.getElementById('param-spiral-turns') as HTMLInputElement).value);
    const radius = parseFloat((document.getElementById('param-spiral-radius') as HTMLInputElement).value);
    const pointsCount = parseInt((document.getElementById('param-spiral-points') as HTMLInputElement).value, 10);
    const strokeColor = (document.getElementById('param-spiral-color') as HTMLInputElement).value;
    const strokeWidth = parseFloat((document.getElementById('param-spiral-width') as HTMLInputElement).value);

    const opts: SpiralOptions = {
      type: spiralType,
      turns,
      radius,
      pointsCount,
      strokeColor,
      strokeWidth,
    };

    currentShapeName = `Graphite ${spiralType.charAt(0).toUpperCase() + spiralType.slice(1)} Spiral`;
    currentGeneratedSvg = generateSpiralSvg(opts);
  } else if (activeTab === 'tab-radials') {
    const count = parseInt((document.getElementById('param-radial-count') as HTMLInputElement).value, 10);
    const innerRadius = parseFloat((document.getElementById('param-radial-inner') as HTMLInputElement).value);
    const outerRadius = parseFloat((document.getElementById('param-radial-outer') as HTMLInputElement).value);
    const fillColor = (document.getElementById('param-radial-fill') as HTMLInputElement).value;
    const strokeColor = (document.getElementById('param-radial-stroke') as HTMLInputElement).value;

    const opts: RadialArrayOptions = {
      shapeType: radialShapeType,
      count,
      innerRadius,
      outerRadius,
      elementSize: 12,
      fillColor,
      strokeColor,
      strokeWidth: 1.5,
    };

    currentShapeName = `Graphite Radial Array (${count}x)`;
    currentGeneratedSvg = generateRadialArraySvg(opts);
  } else if (activeTab === 'tab-waves') {
    const wavesCount = parseInt((document.getElementById('param-wave-count') as HTMLInputElement).value, 10);
    const frequency = parseFloat((document.getElementById('param-wave-freq') as HTMLInputElement).value);
    const amplitude = parseFloat((document.getElementById('param-wave-amp') as HTMLInputElement).value);
    const strokeColor = (document.getElementById('param-wave-stroke') as HTMLInputElement).value;
    const fillColor = (document.getElementById('param-wave-fill') as HTMLInputElement).value;
    const hasFill = (document.getElementById('param-wave-hasfill') as HTMLInputElement).checked;

    const opts: WaveOptions = {
      wavesCount,
      frequency,
      amplitude,
      phase: 0,
      width: 280,
      height: 140,
      strokeColor,
      fillColor,
      hasFill,
    };

    currentShapeName = 'Graphite Harmonic Waves';
    currentGeneratedSvg = generateHarmonicWaveSvg(opts);
  } else if (activeTab === 'tab-filters') {
    const highlights = parseFloat((document.getElementById('param-filter-high') as HTMLInputElement).value);
    const midtones = parseFloat((document.getElementById('param-filter-gamma') as HTMLInputElement).value);
    const hueRotate = parseFloat((document.getElementById('param-filter-hue') as HTMLInputElement).value);
    const saturation = parseFloat((document.getElementById('param-filter-sat') as HTMLInputElement).value);
    const invert = (document.getElementById('param-filter-invert') as HTMLInputElement).checked;
    const thresholdEnabled = (document.getElementById('param-filter-threshold') as HTMLInputElement).checked;

    const filterOpts: FilterOptions = {
      levelsEnabled: true,
      shadows: 0.0,
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
      threshold: 0.5,
    };

    const filterId = 'graphite-tone-filter';
    const filterDef = buildSvgFilterDef(filterId, filterOpts);
    currentFilterId = filterId;
    currentFilterDef = filterDef;
    currentShapeName = 'Graphite Raster Filter';
    currentGeneratedSvg = createFilteredDemonstrationSvg(filterId, filterDef);
  }

  // Inject into live preview box
  if (previewContainer) {
    previewContainer.innerHTML = currentGeneratedSvg;
  }
}

const feedbackBanner = document.getElementById('feedback-banner') as HTMLElement;

function showNotification(msg: string) {
  if (!feedbackBanner) return;
  feedbackBanner.textContent = msg;
  feedbackBanner.style.display = 'block';
  if (msg.startsWith('✓')) {
    feedbackBanner.classList.add('success');
  } else {
    feedbackBanner.classList.remove('success');
  }
  setTimeout(() => {
    feedbackBanner.style.display = 'none';
  }, 3500);
}

// Insert into Penpot Canvas Action / Apply Filter Action
btnInsert.addEventListener('click', () => {
  if (activeTab === 'tab-filters') {
    // Dispatch apply-filter to target active selection
    parent.postMessage(
      {
        type: 'apply-filter',
        content: {
          filterId: currentFilterId,
          filterSvg: currentFilterDef,
        },
      },
      '*'
    );

    const originalHtml = btnInsert.innerHTML;
    btnInsert.innerHTML = `<span>Applying to Selection...</span>`;
    setTimeout(() => {
      btnInsert.innerHTML = originalHtml;
    }, 1200);
    return;
  }

  if (!currentGeneratedSvg) return;

  // Send message to Penpot host thread (plugin.ts)
  parent.postMessage(
    {
      type: 'insert-shape',
      content: {
        name: currentShapeName,
        svg: currentGeneratedSvg,
      },
    },
    '*'
  );

  // Visual feedback on button
  const originalHtml = btnInsert.innerHTML;
  btnInsert.innerHTML = `<span>Inserted!</span>`;
  setTimeout(() => {
    btnInsert.innerHTML = originalHtml;
  }, 1200);
});

// Copy SVG to Clipboard Action
btnCopySvg.addEventListener('click', async () => {
  if (!currentGeneratedSvg) return;
  try {
    await navigator.clipboard.writeText(currentGeneratedSvg);
    const originalText = btnCopySvg.textContent;
    btnCopySvg.textContent = 'Copied!';
    setTimeout(() => {
      btnCopySvg.textContent = originalText;
    }, 1200);
  } catch (err) {
    console.error('Failed to copy SVG to clipboard:', err);
  }
});

// Handle Theme & Notifications from Penpot
window.addEventListener('message', (event) => {
  if (event.data?.type === 'theme') {
    console.log('[Graphite Plugin] Penpot theme updated:', event.data.content);
  } else if (event.data?.type === 'notification') {
    showNotification(event.data.content);
  }
});

// Initial Render
renderActivePreview();
