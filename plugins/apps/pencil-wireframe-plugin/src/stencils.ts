/**
 * Open-Pencil Wireframe Stencils & Smart Connectors
 * Clean-room implementation of low-fidelity sketchy UI components, mobile frames, and flowchart connectors.
 */

// --- General UI Stencils ---

export function generateSketchyButton(label: string = 'Click Me', w: number = 140, h: number = 44): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 4 5 Q ${w * 0.45} 3, ${w - 5} 4 Q ${w - 3} ${h * 0.5}, ${w - 4} ${h - 5} Q ${w * 0.5} ${h - 3}, 5 ${h - 4} Q 3 ${h * 0.5}, 4 5 Z" fill="#2d3748" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  <text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" font-size="14" fill="#f8fafc" font-weight="bold">${label}</text>
</svg>
  `.trim();
}

export function generateSketchyInput(placeholder: string = 'Enter text...', w: number = 220, h: number = 42): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 3 4 Q ${w * 0.5} 2, ${w - 3} 3 Q ${w - 2} ${h * 0.5}, ${w - 4} ${h - 3} Q ${w * 0.5} ${h - 2}, 4 ${h - 4} Q 2 ${h * 0.5}, 3 4 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
  <text x="14" y="${h / 2 + 5}" font-family="'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" font-size="13" fill="#64748b">${placeholder}</text>
</svg>
  `.trim();
}

export function generateSketchyCheckbox(label: string = 'Remember choice', checked: boolean = true): string {
  const w = 180;
  const h = 32;
  const checkMark = checked
    ? `<path d="M 6 12 L 11 18 L 18 6" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`
    : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="3" y="5" width="22" height="22" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${checkMark}
  <text x="34" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${label}</text>
</svg>
  `.trim();
}

export function generateSketchyRadio(label: string = 'Option choice', selected: boolean = true): string {
  const w = 180;
  const h = 32;
  const dot = selected ? `<circle cx="14" cy="16" r="5" fill="#38bdf8" />` : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <circle cx="14" cy="16" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${dot}
  <text x="34" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${label}</text>
</svg>
  `.trim();
}

export function generateSketchyToggle(label: string = 'Enable feature', active: boolean = true): string {
  const w = 180;
  const h = 32;
  const knobX = active ? 36 : 14;
  const bg = active ? '#2563eb' : '#334155';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="4" y="6" width="44" height="20" rx="10" fill="${bg}" stroke="#94a3b8" stroke-width="1.8" />
  <circle cx="${knobX}" cy="16" r="7" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
  <text x="58" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${label}</text>
</svg>
  `.trim();
}

export function generateSketchyDropdown(placeholder: string = 'Select option...', w: number = 220, h: number = 42): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="3" y="4" width="${w - 6}" height="${h - 8}" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  <text x="14" y="${h / 2 + 5}" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#94a3b8">${placeholder}</text>
  <polyline points="${w - 24},${h / 2 - 2} ${w - 18},${h / 2 + 4} ${w - 12},${h / 2 - 2}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
</svg>
  `.trim();
}

export function generateSketchyAvatar(label: string = 'Avatar', w: number = 64, h: number = 64): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <circle cx="${w / 2}" cy="${h / 2}" r="${w / 2 - 4}" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.18}" fill="#64748b" />
  <path d="M ${w * 0.22} ${h * 0.85} C ${w * 0.25} ${h * 0.6}, ${w * 0.75} ${h * 0.6}, ${w * 0.78} ${h * 0.85} Z" fill="#64748b" />
</svg>
  `.trim();
}

export function generateSketchyTable(rows: number = 3, cols: number = 3, w: number = 280, h: number = 140): string {
  const rowH = h / (rows + 1);
  const colW = w / cols;
  let lines = '';

  // Header separator
  lines += `<line x1="4" y1="${rowH}" x2="${w - 4}" y2="${rowH}" stroke="#64748b" stroke-width="2" />`;

  // Row lines
  for (let r = 2; r <= rows; r++) {
    lines += `<line x1="4" y1="${r * rowH}" x2="${w - 4}" y2="${r * rowH}" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" />`;
  }

  // Column lines
  for (let c = 1; c < cols; c++) {
    lines += `<line x1="${c * colW}" y1="4" x2="${c * colW}" y2="${h - 4}" stroke="#475569" stroke-width="1.5" />`;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${lines}
  <text x="12" y="${rowH / 2 + 5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 1</text>
  <text x="${colW + 12}" y="${rowH / 2 + 5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 2</text>
  <text x="${colW * 2 + 12}" y="${rowH / 2 + 5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 3</text>
</svg>
  `.trim();
}

export function generateSketchyDialog(title: string = 'Confirm Action', w: number = 280, h: number = 160): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 4 6 Q ${w * 0.5} 3, ${w - 5} 5 Q ${w - 3} ${h * 0.5}, ${w - 4} ${h - 5} Q ${w * 0.5} ${h - 3}, 5 ${h - 4} Q 2 ${h * 0.5}, 4 6 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5" />
  <path d="M 6 36 Q ${w * 0.5} 34, ${w - 6} 36" stroke="#475569" stroke-width="2" stroke-linecap="round" />
  <text x="16" y="24" font-family="'Comic Sans MS', cursive, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">${title}</text>
  <text x="16" y="70" font-family="'Comic Sans MS', cursive, sans-serif" font-size="12" fill="#94a3b8">Are you sure you want to proceed?</text>
  <path d="M 140 115 L 200 114 L 199 142 L 139 143 Z" fill="#334155" stroke="#94a3b8" stroke-width="1.8" />
  <text x="170" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#f8fafc">Cancel</text>
  <path d="M 210 115 L 265 114 L 264 142 L 209 143 Z" fill="#38bdf8" stroke="#cbd5e1" stroke-width="1.8" />
  <text x="237" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#0f172a" font-weight="bold">OK</text>
</svg>
  `.trim();
}

// --- Mobile UI Stencils ---

export function generateMobilePhoneFrame(w: number = 240, h: number = 440): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <!-- Outer Shell -->
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="28" fill="#0f172a" stroke="#64748b" stroke-width="3" />
  <!-- Screen Area -->
  <rect x="12" y="16" width="${w - 24}" height="${h - 32}" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
  <!-- Dynamic Island / Speaker notch -->
  <rect x="${w / 2 - 30}" y="24" width="60" height="12" rx="6" fill="#090d16" />
  <!-- Home Indicator bar -->
  <rect x="${w / 2 - 36}" y="${h - 26}" width="72" height="4" rx="2" fill="#475569" />
</svg>
  `.trim();
}

export function generateMobileAppBar(title: string = 'Screen Title', w: number = 240, h: number = 52): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1.8" />
  <!-- Back Arrow icon -->
  <polyline points="22,${h / 2 - 6} 14,${h / 2} 22,${h / 2 + 6}" fill="none" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Title -->
  <text x="36" y="${h / 2 + 5}" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">${title}</text>
  <!-- More menu dots -->
  <circle cx="${w - 18}" cy="${h / 2}" r="2" fill="#94a3b8" />
  <circle cx="${w - 24}" cy="${h / 2}" r="2" fill="#94a3b8" />
  <circle cx="${w - 30}" cy="${h / 2}" r="2" fill="#94a3b8" />
</svg>
  `.trim();
}

export function generateMobileBottomNav(w: number = 240, h: number = 56): string {
  const itemW = w / 4;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.8" />
  <!-- Item 1 (Active) -->
  <circle cx="${itemW * 0.5}" cy="${h / 2 - 4}" r="8" fill="#38bdf8" />
  <text x="${itemW * 0.5}" y="${h - 10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#38bdf8" font-weight="bold">Home</text>
  <!-- Item 2 -->
  <circle cx="${itemW * 1.5}" cy="${h / 2 - 4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${itemW * 1.5}" y="${h - 10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Search</text>
  <!-- Item 3 -->
  <circle cx="${itemW * 2.5}" cy="${h / 2 - 4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${itemW * 2.5}" y="${h - 10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Activity</text>
  <!-- Item 4 -->
  <circle cx="${itemW * 3.5}" cy="${h / 2 - 4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${itemW * 3.5}" y="${h - 10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Profile</text>
</svg>
  `.trim();
}

// --- Flowchart & Diagram Stencils ---

export function generateFlowchartSymbol(
  type: 'process' | 'decision' | 'terminal' | 'database' | 'cloud' | 'actor' | 'io',
  label: string = 'Step'
): string {
  const w = 160;
  const h = 80;

  if (type === 'decision') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <polygon points="${w / 2},4 ${w - 4},${h / 2} ${w / 2},${h - 4} 4,${h / 2}" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" />
  <text x="${w / 2}" y="${h / 2 + 4}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}?</text>
</svg>
    `.trim();
  } else if (type === 'terminal') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="4" y="8" width="${w - 8}" height="${h - 16}" rx="32" fill="#1e293b" stroke="#10b981" stroke-width="2.5" />
  <text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else if (type === 'database') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 10 20 C 10 10, ${w - 10} 10, ${w - 10} 20 L ${w - 10} 60 C ${w - 10} 70, 10 70, 10 60 Z" fill="#1e293b" stroke="#818cf8" stroke-width="2.5" />
  <ellipse cx="${w / 2}" cy="20" rx="${(w - 20) / 2}" ry="10" fill="#334155" stroke="#818cf8" stroke-width="2.5" />
  <text x="${w / 2}" y="${h / 2 + 10}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else if (type === 'cloud') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 30 55 A 18 18 0 0 1 35 25 A 25 25 0 0 1 80 18 A 28 28 0 0 1 130 28 A 18 18 0 0 1 135 55 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" />
  <text x="${w / 2}" y="${h / 2 + 8}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else if (type === 'io') {
    // Parallelogram for I/O
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <polygon points="24,8 ${w - 8},8 ${w - 24},${h - 8} 8,${h - 8}" fill="#1e293b" stroke="#a855f7" stroke-width="2.5" />
  <text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else if (type === 'actor') {
    // Stick figure actor for use-case diagrams
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120">
  <circle cx="40" cy="20" r="14" fill="#1e293b" stroke="#f8fafc" stroke-width="2.5" />
  <line x1="40" y1="34" x2="40" y2="76" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="16" y1="48" x2="64" y2="48" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="40" y1="76" x2="20" y2="110" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="40" y1="76" x2="60" y2="110" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <text x="40" y="118" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#94a3b8">${label}</text>
</svg>
    `.trim();
  } else {
    // Process rectangle
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="4" y="8" width="${w - 8}" height="${h - 16}" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
  <text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  }
}

// --- Smart Connectors ---

export function generateSmartConnector(
  x1: number = 20,
  y1: number = 20,
  x2: number = 220,
  y2: number = 140,
  type: 'orthogonal' | 'curved' = 'orthogonal'
): string {
  const minX = Math.min(x1, x2) - 30;
  const minY = Math.min(y1, y2) - 30;
  const maxX = Math.max(x1, x2) + 30;
  const maxY = Math.max(y1, y2) + 30;
  const w = Math.max(maxX - minX, 40);
  const h = Math.max(maxY - minY, 40);

  let d = '';
  if (type === 'orthogonal') {
    const midX = (x1 + x2) / 2;
    d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  } else {
    const dx = (x2 - x1) / 2;
    d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <marker id="pencil-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
    </marker>
  </defs>
  <path d="${d}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#pencil-arrow)" />
  <circle cx="${x1}" cy="${y1}" r="4" fill="#38bdf8" />
</svg>
  `.trim();
}
