import type { NodeLayout } from './types.ts';

export function compileToFlutterDart(node: NodeLayout): string {
  const widgetName = sanitizeWidgetName(node.name || 'CustomWidget');
  const widgetBody = compileNodeToWidget(node, 2);

  return `import 'package:flutter/material.dart';

class ${widgetName} extends StatelessWidget {
  const ${widgetName}({super.key});

  @override
  Widget build(BuildContext context) {
    return ${widgetBody};
  }
}
`;
}

function compileNodeToWidget(node: NodeLayout, indentLevel: number): string {
  const indent = ' '.repeat(indentLevel * 2);

  if (node.type === 'text') {
    const text = (node.textContent || 'Text').replace(/'/g, "\\'");
    let styleProps: string[] = [];
    if (node.textColor) styleProps.push(`color: ${hexToColor(node.textColor)}`);
    if (node.fontSize) styleProps.push(`fontSize: ${Math.round(node.fontSize)}.0`);
    if (node.fontWeight) {
      if (node.fontWeight === '700' || node.fontWeight === 700 || node.fontWeight === 'bold') {
        styleProps.push('fontWeight: FontWeight.bold');
      } else if (node.fontWeight === '600' || node.fontWeight === 600 || node.fontWeight === 'semibold') {
        styleProps.push('fontWeight: FontWeight.w600');
      } else if (node.fontWeight === '500' || node.fontWeight === 500) {
        styleProps.push('fontWeight: FontWeight.w500');
      }
    }

    const styleStr = styleProps.length > 0 ? `, style: TextStyle(${styleProps.join(', ')})` : '';
    return `Text('${text}'${styleStr})`;
  }

  // Children layout
  let childWidget = '';
  if (node.children && node.children.length > 0) {
    const isColumn = node.flexDirection === 'column';
    const flexType = isColumn ? 'Column' : 'Row';
    const childrenStr = node.children
      .map((c) => `${indent}    ${compileNodeToWidget(c, indentLevel + 2)},`)
      .join('\n');

    let flexProps: string[] = [];
    if (node.justifyContent === 'center') flexProps.push('mainAxisAlignment: MainAxisAlignment.center');
    else if (node.justifyContent === 'space-between') flexProps.push('mainAxisAlignment: MainAxisAlignment.spaceBetween');

    if (node.alignItems === 'center') flexProps.push('crossAxisAlignment: CrossAxisAlignment.center');

    const flexPropsStr = flexProps.length > 0 ? `${flexProps.join(', ')}, ` : '';
    childWidget = `\n${indent}  child: ${flexType}(\n${indent}    ${flexPropsStr}children: [\n${childrenStr}\n${indent}    ],\n${indent}  ),`;
  }

  // Container decoration
  let decorProps: string[] = [];
  if (node.backgroundColor) {
    decorProps.push(`color: ${hexToColor(node.backgroundColor)}`);
  }
  if (node.borderRadius) {
    decorProps.push(`borderRadius: BorderRadius.circular(${node.borderRadius}.0)`);
  }
  if (node.borderWidth && node.borderColor) {
    decorProps.push(`border: Border.all(color: ${hexToColor(node.borderColor)}, width: ${node.borderWidth}.0)`);
  }

  let containerProps: string[] = [];
  if (node.width && !node.layoutMode) containerProps.push(`width: ${Math.round(node.width)}.0`);
  if (node.height && !node.layoutMode) containerProps.push(`height: ${Math.round(node.height)}.0`);

  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    const p = node.paddingTop || 0;
    containerProps.push(`padding: const EdgeInsets.all(${p}.0)`);
  }

  if (decorProps.length > 0) {
    containerProps.push(`decoration: BoxDecoration(${decorProps.join(', ')})`);
  }

  const propsStr = containerProps.length > 0 ? `\n${indent}  ${containerProps.join(`,\n${indent}  `)},` : '';

  return `Container(${propsStr}${childWidget}\n${indent})`;
}

function hexToColor(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    return `const Color(0xFF${clean.toUpperCase()})`;
  }
  return `const Color(0xFF${clean.toUpperCase()})`;
}

function sanitizeWidgetName(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  const pascal = clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return pascal || 'CustomWidget';
}
