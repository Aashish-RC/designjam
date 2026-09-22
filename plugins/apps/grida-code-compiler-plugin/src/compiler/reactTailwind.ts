import type { NodeLayout } from './types.ts';

export function compileToReactTailwind(node: NodeLayout): string {
  const componentName = sanitizeComponentName(node.name || 'Component');
  const jsx = compileNodeToJsx(node, 2);

  return `import React from 'react';

export interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ className = '' }) => {
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

  // Flex layout
  if (node.layoutMode === 'flex' || node.flexDirection) {
    classes.push('flex');
    if (node.flexDirection === 'column') {
      classes.push('flex-col');
    } else {
      classes.push('flex-row');
    }

    if (node.justifyContent === 'center') classes.push('justify-center');
    else if (node.justifyContent === 'space-between') classes.push('justify-between');
    else if (node.justifyContent === 'flex-end') classes.push('justify-end');

    if (node.alignItems === 'center') classes.push('items-center');
    else if (node.alignItems === 'flex-start') classes.push('items-start');
    else if (node.alignItems === 'flex-end') classes.push('items-end');

    if (node.gap) {
      classes.push(`gap-[${node.gap}px]`);
    }
  }

  // Padding
  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight && node.paddingTop === node.paddingLeft) {
      classes.push(`p-[${node.paddingTop}px]`);
    } else {
      if (node.paddingTop) classes.push(`pt-[${node.paddingTop}px]`);
      if (node.paddingRight) classes.push(`pr-[${node.paddingRight}px]`);
      if (node.paddingBottom) classes.push(`pb-[${node.paddingBottom}px]`);
      if (node.paddingLeft) classes.push(`pl-[${node.paddingLeft}px]`);
    }
  }

  // Dimensions
  if (node.width && !node.layoutMode) {
    classes.push(`w-[${Math.round(node.width)}px]`);
  }
  if (node.height && !node.layoutMode) {
    classes.push(`h-[${Math.round(node.height)}px]`);
  }

  // Background
  if (node.backgroundColor) {
    classes.push(formatTailwindColor('bg', node.backgroundColor));
  }

  // Border & Radius
  if (node.borderRadius) {
    classes.push(`rounded-[${node.borderRadius}px]`);
  }
  if (node.borderWidth && node.borderColor) {
    classes.push(`border-[${node.borderWidth}px]`);
    classes.push(formatTailwindColor('border', node.borderColor));
  }

  // Text specific
  if (node.type === 'text') {
    if (node.textColor) classes.push(formatTailwindColor('text', node.textColor));
    if (node.fontSize) classes.push(`text-[${Math.round(node.fontSize)}px]`);
    if (node.fontWeight) {
      if (node.fontWeight === '700' || node.fontWeight === 700 || node.fontWeight === 'bold') classes.push('font-bold');
      else if (node.fontWeight === '600' || node.fontWeight === 600 || node.fontWeight === 'semibold') classes.push('font-semibold');
      else if (node.fontWeight === '500' || node.fontWeight === 500 || node.fontWeight === 'medium') classes.push('font-medium');
    }
  }

  // Opacity
  if (node.opacity !== undefined && node.opacity < 1) {
    classes.push(`opacity-${Math.round(node.opacity * 100)}`);
  }

  const classAttr = classes.length > 0 ? ` className="${classes.join(' ')}"` : '';

  if (node.type === 'text') {
    const text = node.textContent || 'Text';
    return `${indent}<p${classAttr}>${escapeHtml(text)}</p>`;
  }

  if (node.children && node.children.length > 0) {
    const childrenJsx = node.children
      .map((c) => compileNodeToJsx(c, indentLevel + 1))
      .join('\n');
    return `${indent}<div${classAttr}>\n${childrenJsx}\n${indent}</div>`;
  }

  return `${indent}<div${classAttr} />`;
}

function sanitizeComponentName(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  const pascal = clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return pascal || 'CustomComponent';
}

function formatTailwindColor(prefix: string, hex: string): string {
  if (hex.startsWith('#')) {
    return `${prefix}-[${hex}]`;
  }
  return `${prefix}-[${hex}]`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
