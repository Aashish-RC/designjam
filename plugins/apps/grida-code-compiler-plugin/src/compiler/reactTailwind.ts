import type { NodeLayout } from './types.ts';

/**
 * Compiles a serialized Penpot NodeLayout AST into production-ready React TSX with Tailwind CSS classes.
 */
export function compileToReactTailwind(node: NodeLayout): string {
  const componentName = sanitizeComponentName(node.name || 'Component');
  const jsx = compileNodeToJsx(node, 2);

  return `import React from 'react';

export interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  className = '',
  children,
}) => {
  return (
${jsx}
  );
};

export default ${componentName};
`;
}

function compileNodeToJsx(node: NodeLayout, indentLevel: number): string {
  const indent = ' '.repeat(indentLevel * 2);
  const classes: string[] = [];
  const tag = inferSemanticTag(node);

  // Layout mode
  if (node.layoutMode === 'flex' || node.flexDirection) {
    classes.push('flex');
    if (node.flexDirection === 'column') {
      classes.push('flex-col');
    } else {
      classes.push('flex-row');
    }

    if (node.justifyContent === 'center') classes.push('justify-center');
    else if (node.justifyContent === 'space-between' || node.justifyContent === 'between') classes.push('justify-between');
    else if (node.justifyContent === 'flex-end' || node.justifyContent === 'end') classes.push('justify-end');
    else if (node.justifyContent === 'flex-start' || node.justifyContent === 'start') classes.push('justify-start');

    if (node.alignItems === 'center') classes.push('items-center');
    else if (node.alignItems === 'flex-start' || node.alignItems === 'start') classes.push('items-start');
    else if (node.alignItems === 'flex-end' || node.alignItems === 'end') classes.push('items-end');
    else if (node.alignItems === 'stretch') classes.push('items-stretch');

    if (node.gap) {
      classes.push(formatTailwindSpacing('gap', node.gap));
    }
  }

  // Padding
  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    const pt = node.paddingTop || 0;
    const pr = node.paddingRight || 0;
    const pb = node.paddingBottom || 0;
    const pl = node.paddingLeft || 0;

    if (pt === pb && pl === pr && pt === pl && pt > 0) {
      classes.push(formatTailwindSpacing('p', pt));
    } else {
      if (pt === pb && pt > 0) classes.push(formatTailwindSpacing('py', pt));
      else {
        if (pt) classes.push(formatTailwindSpacing('pt', pt));
        if (pb) classes.push(formatTailwindSpacing('pb', pb));
      }
      if (pl === pr && pl > 0) classes.push(formatTailwindSpacing('px', pl));
      else {
        if (pl) classes.push(formatTailwindSpacing('pl', pl));
        if (pr) classes.push(formatTailwindSpacing('pr', pr));
      }
    }
  }

  // Explicit dimensions when not relying on flex fill
  if (node.width && (!node.layoutMode || tag === 'button' || tag === 'input' || tag === 'img')) {
    classes.push(formatTailwindSpacing('w', Math.round(node.width)));
  }
  if (node.height && (!node.layoutMode || tag === 'button' || tag === 'input' || tag === 'img')) {
    classes.push(formatTailwindSpacing('h', Math.round(node.height)));
  }

  // Background
  if (node.backgroundColor) {
    classes.push(formatTailwindColor('bg', node.backgroundColor));
  }

  // Border & Radius
  if (node.borderRadius) {
    classes.push(formatTailwindRadius(node.borderRadius));
  }
  if (node.borderWidth && node.borderColor) {
    classes.push(node.borderWidth === 1 ? 'border' : `border-[${node.borderWidth}px]`);
    classes.push(formatTailwindColor('border', node.borderColor));
  }

  // Text attributes
  if (node.type === 'text') {
    if (node.textColor) classes.push(formatTailwindColor('text', node.textColor));
    if (node.fontSize) classes.push(formatTailwindFontSize(node.fontSize));
    if (node.fontWeight) classes.push(formatTailwindFontWeight(node.fontWeight));
  }

  // Opacity
  if (node.opacity !== undefined && node.opacity < 1 && node.opacity >= 0) {
    classes.push(`opacity-${Math.round(node.opacity * 100)}`);
  }

  // Shadows
  if (node.shadow) {
    classes.push(node.shadow);
  }

  const classAttr = classes.length > 0 ? ` className="${classes.join(' ')}"` : '';

  // Render text element
  if (node.type === 'text') {
    const text = node.textContent || 'Text';
    return `${indent}<${tag}${classAttr}>${escapeHtml(text)}</${tag}>`;
  }

  // Render self-closing tags
  if (tag === 'input') {
    const placeholder = node.textContent || node.name || 'Enter value...';
    return `${indent}<input type="text" placeholder="${escapeHtml(placeholder)}"${classAttr} />`;
  }

  if (tag === 'img') {
    return `${indent}<img src="https://via.placeholder.com/${Math.round(node.width || 100)}x${Math.round(node.height || 100)}" alt="${escapeHtml(node.name)}"${classAttr} />`;
  }

  // Render container with children
  if (node.children && node.children.length > 0) {
    const childrenJsx = node.children
      .map((c) => compileNodeToJsx(c, indentLevel + 1))
      .join('\n');
    return `${indent}<${tag}${classAttr}>\n${childrenJsx}\n${indent}</${tag}>`;
  }

  return `${indent}<${tag}${classAttr} />`;
}

function inferSemanticTag(node: NodeLayout): string {
  const nameLower = (node.name || '').toLowerCase();
  
  if (node.type === 'text') {
    if (nameLower.includes('h1') || nameLower.includes('hero')) return 'h1';
    if (nameLower.includes('subtitle') || nameLower.includes('subheading') || nameLower.includes('h3')) return 'h3';
    if (nameLower.includes('h2') || nameLower.includes('title') || nameLower.includes('heading')) return 'h2';
    return 'p';
  }

  if (nameLower.includes('button') || nameLower.includes('btn') || nameLower.includes('cta')) {
    return 'button';
  }
  if (nameLower.includes('input') || nameLower.includes('textfield') || nameLower.includes('textbox')) {
    return 'input';
  }
  if (nameLower.includes('avatar') || nameLower.includes('image') || nameLower.includes('icon')) {
    return 'div';
  }
  if (nameLower.includes('nav') || nameLower.includes('navbar') || nameLower.includes('header')) {
    return 'nav';
  }
  if (nameLower.includes('form')) {
    return 'form';
  }

  return 'div';
}

function formatTailwindSpacing(prefix: string, val: number): string {
  const standard: Record<number, string> = {
    0: '0', 2: '0.5', 4: '1', 6: '1.5', 8: '2', 10: '2.5', 12: '3', 14: '3.5',
    16: '4', 20: '5', 24: '6', 28: '7', 32: '8', 36: '9', 40: '10', 44: '11',
    48: '12', 56: '14', 64: '16', 72: '18', 80: '20', 96: '24'
  };
  if (standard[val]) {
    return `${prefix}-${standard[val]}`;
  }
  return `${prefix}-[${val}px]`;
}

function formatTailwindFontSize(size: number): string {
  const rounded = Math.round(size);
  if (rounded <= 12) return 'text-xs';
  if (rounded <= 14) return 'text-sm';
  if (rounded <= 16) return 'text-base';
  if (rounded <= 18) return 'text-lg';
  if (rounded <= 20) return 'text-xl';
  if (rounded <= 24) return 'text-2xl';
  if (rounded <= 30) return 'text-3xl';
  if (rounded <= 36) return 'text-4xl';
  return `text-[${rounded}px]`;
}

function formatTailwindFontWeight(weight: string | number): string {
  const str = String(weight).toLowerCase();
  if (str === '400' || str === 'normal' || str === 'regular') return 'font-normal';
  if (str === '500' || str === 'medium') return 'font-medium';
  if (str === '600' || str === 'semibold') return 'font-semibold';
  if (str === '700' || str === 'bold') return 'font-bold';
  if (str === '800' || str === 'extrabold') return 'font-extrabold';
  if (str === '900' || str === 'black') return 'font-black';
  return 'font-normal';
}

function formatTailwindRadius(radius: number): string {
  if (radius <= 2) return 'rounded-sm';
  if (radius <= 4) return 'rounded';
  if (radius <= 6) return 'rounded-md';
  if (radius <= 8) return 'rounded-lg';
  if (radius <= 12) return 'rounded-xl';
  if (radius <= 16) return 'rounded-2xl';
  if (radius >= 999) return 'rounded-full';
  return `rounded-[${radius}px]`;
}

function formatTailwindColor(prefix: string, hex: string): string {
  const h = hex.toLowerCase().trim();
  const palette: Record<string, string> = {
    '#ffffff': `${prefix}-white`,
    '#000000': `${prefix}-black`,
    '#f8fafc': `${prefix}-slate-50`,
    '#f1f5f9': `${prefix}-slate-100`,
    '#e2e8f0': `${prefix}-slate-200`,
    '#94a3b8': `${prefix}-slate-400`,
    '#64748b': `${prefix}-slate-500`,
    '#475569': `${prefix}-slate-600`,
    '#334155': `${prefix}-slate-700`,
    '#1e293b': `${prefix}-slate-800`,
    '#0f172a': `${prefix}-slate-900`,
    '#020617': `${prefix}-slate-950`,
    '#3b82f6': `${prefix}-blue-500`,
    '#2563eb': `${prefix}-blue-600`,
    '#1d4ed8': `${prefix}-blue-700`,
    '#10b981': `${prefix}-emerald-500`,
    '#ef4444': `${prefix}-red-500`,
    '#f59e0b': `${prefix}-amber-500`,
  };

  if (palette[h]) {
    return palette[h];
  }
  return `${prefix}-[${hex}]`;
}

function sanitizeComponentName(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  const pascal = clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return pascal || 'CustomComponent';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
