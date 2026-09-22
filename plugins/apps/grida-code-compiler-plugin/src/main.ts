import { NodeLayout } from './compiler/types.js';
import { compileToReactTailwind } from './compiler/reactTailwind.js';
import { compileToFlutterDart } from './compiler/flutterDart.js';
import { compileToSvelte } from './compiler/svelteCompiler.js';

let activeFramework: 'react-tailwind' | 'flutter' | 'svelte' = 'react-tailwind';
let currentNode: NodeLayout | null = null;
let currentGeneratedCode = '';

const codeOutput = document.getElementById('code-output') as HTMLElement;
const nodeInfo = document.getElementById('node-info') as HTMLElement;
const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;

// Framework Nav
document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeFramework = (btn as HTMLElement).dataset.framework as any || 'react-tailwind';
    renderCode();
  });
});

function renderCode() {
  if (!currentNode) {
    codeOutput.textContent = '// Select a layer or artboard on the canvas to inspect code';
    return;
  }

  nodeInfo.textContent = `Target: ${currentNode.name} (${currentNode.type})`;

  if (activeFramework === 'react-tailwind') {
    currentGeneratedCode = compileToReactTailwind(currentNode);
  } else if (activeFramework === 'flutter') {
    currentGeneratedCode = compileToFlutterDart(currentNode);
  } else {
    currentGeneratedCode = compileToSvelte(currentNode);
  }

  codeOutput.textContent = currentGeneratedCode;
}

btnCopy.addEventListener('click', async () => {
  if (!currentGeneratedCode) return;
  try {
    await navigator.clipboard.writeText(currentGeneratedCode);
    const orig = btnCopy.textContent;
    btnCopy.textContent = 'Copied to Clipboard!';
    setTimeout(() => {
      btnCopy.textContent = orig;
    }, 1200);
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
});

const selectionStatus = document.getElementById('selection-status') as HTMLElement;
const statusBadge = document.getElementById('status-badge') as HTMLElement;
const statusText = document.getElementById('status-text') as HTMLElement;

// Listen to message from plugin.ts
window.addEventListener('message', (event) => {
  if (event.data?.type === 'selection-change') {
    currentNode = event.data.content?.selectedNode || null;
    const isSample = Boolean(event.data.content?.isSample);

    if (selectionStatus && statusBadge && statusText) {
      if (isSample) {
        selectionStatus.classList.remove('live');
        statusBadge.textContent = 'Preview';
        statusText.textContent = 'No shape selected — displaying sample. Select any frame or layer to compile.';
      } else {
        selectionStatus.classList.add('live');
        statusBadge.textContent = 'Canvas';
        statusText.textContent = `Compiling live selection: ${currentNode?.name || 'Selected Layer'}`;
      }
    }

    renderCode();
  }
});

// Request initial selection
parent.postMessage({ type: 'request-selection' }, '*');
