/**
 * Open-Pencil Wireframe Stencils & Smart Connectors
 * Generates low-fidelity sketchy UI components and flowchart connectors.
 */

export function generateSketchyButton(label: string = 'Click Me', w: number = 140, h: number = 44): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <!-- Hand-drawn rough border -->
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

export function generateSketchyDialog(title: string = 'Confirm Action', w: number = 280, h: number = 160): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <!-- Window Frame -->
  <path d="M 4 6 Q ${w * 0.5} 3, ${w - 5} 5 Q ${w - 3} ${h * 0.5}, ${w - 4} ${h - 5} Q ${w * 0.5} ${h - 3}, 5 ${h - 4} Q 2 ${h * 0.5}, 4 6 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5" />
  <!-- Title bar line -->
  <path d="M 6 36 Q ${w * 0.5} 34, ${w - 6} 36" stroke="#475569" stroke-width="2" stroke-linecap="round" />
  <text x="16" y="24" font-family="'Comic Sans MS', cursive, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">${title}</text>
  <!-- Body text -->
  <text x="16" y="70" font-family="'Comic Sans MS', cursive, sans-serif" font-size="12" fill="#94a3b8">Are you sure you want to proceed?</text>
  <!-- Sketchy buttons -->
  <path d="M 140 115 L 200 114 L 199 142 L 139 143 Z" fill="#334155" stroke="#94a3b8" stroke-width="1.8" />
  <text x="170" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#f8fafc">Cancel</text>
  <path d="M 210 115 L 265 114 L 264 142 L 209 143 Z" fill="#38bdf8" stroke="#cbd5e1" stroke-width="1.8" />
  <text x="237" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#0f172a" font-weight="bold">OK</text>
</svg>
  `.trim();
}

export function generateFlowchartSymbol(type: 'process' | 'decision' | 'terminal' | 'database', label: string = 'Step'): string {
  const w = 160;
  const h = 80;

  if (type === 'decision') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <polygon points="${w/2},4 ${w-4},${h/2} ${w/2},${h-4} 4,${h/2}" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" />
  <text x="${w/2}" y="${h/2 + 4}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}?</text>
</svg>
    `.trim();
  } else if (type === 'terminal') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="4" y="8" width="${w-8}" height="${h-16}" rx="32" fill="#1e293b" stroke="#10b981" stroke-width="2.5" />
  <text x="${w/2}" y="${h/2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else if (type === 'database') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="M 10 20 C 10 10, ${w-10} 10, ${w-10} 20 L ${w-10} 60 C ${w-10} 70, 10 70, 10 60 Z" fill="#1e293b" stroke="#818cf8" stroke-width="2.5" />
  <ellipse cx="${w/2}" cy="20" rx="${(w-20)/2}" ry="10" fill="#334155" stroke="#818cf8" stroke-width="2.5" />
  <text x="${w/2}" y="${h/2 + 10}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  } else {
    // Process rectangle
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect x="4" y="8" width="${w-8}" height="${h-16}" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
  <text x="${w/2}" y="${h/2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${label}</text>
</svg>
    `.trim();
  }
}

export function generateSmartConnector(x1: number = 20, y1: number = 20, x2: number = 220, y2: number = 140, type: 'orthogonal' | 'curved' = 'orthogonal'): string {
  const minX = Math.min(x1, x2) - 30;
  const minY = Math.min(y1, y2) - 30;
  const maxX = Math.max(x1, x2) + 30;
  const maxY = Math.max(y1, y2) + 30;
  const w = maxX - minX;
  const h = maxY - minY;

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
