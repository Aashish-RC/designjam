import type { NodeLayout } from './types.ts';
import { compileToReactTailwind } from './reactTailwind.js';

export function compileToSvelte(node: NodeLayout): string {
  // Svelte 5 component format with Tailwind CSS
  const componentName = node.name || 'Component';
  return `<script lang="ts">
  // Generated Svelte Component: ${componentName}
  let { class: className = '' } = $props();
</script>

<div class="component-root {className}">
  ${compileSvelteInner(node, 1)}
</div>

<style>
  /* Optional scoped overrides */
</style>
`;
}

function compileSvelteInner(node: NodeLayout, indentLevel: number): string {
  const indent = '  '.repeat(indentLevel);
  if (node.type === 'text') {
    return `${indent}<p style="color: ${node.textColor || '#fff'}; font-size: ${node.fontSize || 14}px;">${node.textContent || ''}</p>`;
  }

  if (node.children && node.children.length > 0) {
    const childrenStr = node.children.map((c) => compileSvelteInner(c, indentLevel + 1)).join('\n');
    return `${indent}<div style="display: flex; flex-direction: ${node.flexDirection || 'column'}; gap: ${node.gap || 0}px;">\n${childrenStr}\n${indent}</div>`;
  }

  return `${indent}<div />`;
}
