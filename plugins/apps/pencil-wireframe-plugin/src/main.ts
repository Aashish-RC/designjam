import {
  generateSketchyButton,
  generateSketchyInput,
  generateSketchyDialog,
  generateFlowchartSymbol,
  generateSmartConnector,
} from './stencils.js';

let activeCategory = 'sketchy';
const container = document.getElementById('stencils-container') as HTMLElement;

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = (btn as HTMLElement).dataset.category || 'sketchy';
    renderStencils();
  });
});

function insertToCanvas(name: string, svg: string) {
  parent.postMessage(
    {
      type: 'insert-stencil',
      content: { name, svg },
    },
    '*'
  );
}

function renderStencils() {
  if (!container) return;

  if (activeCategory === 'sketchy') {
    const btnSvg = generateSketchyButton('Primary Button');
    const inputSvg = generateSketchyInput('Search query...');
    const dialogSvg = generateSketchyDialog('Modal Dialog');

    container.innerHTML = `
      <div class="stencil-item" id="item-btn">
        <div class="stencil-preview">${btnSvg}</div>
        <span class="stencil-title">Sketchy Button</span>
      </div>
      <div class="stencil-item" id="item-input">
        <div class="stencil-preview">${inputSvg}</div>
        <span class="stencil-title">Sketchy Input Field</span>
      </div>
      <div class="stencil-item" id="item-dialog" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 100px;">${dialogSvg}</div>
        <span class="stencil-title">Sketchy Modal Dialog</span>
      </div>
    `;

    document.getElementById('item-btn')?.addEventListener('click', () => insertToCanvas('Sketchy Button', btnSvg));
    document.getElementById('item-input')?.addEventListener('click', () => insertToCanvas('Sketchy Input', inputSvg));
    document.getElementById('item-dialog')?.addEventListener('click', () => insertToCanvas('Sketchy Dialog', dialogSvg));
  } else if (activeCategory === 'flowchart') {
    const processSvg = generateFlowchartSymbol('process', 'Process Action');
    const decisionSvg = generateFlowchartSymbol('decision', 'Condition Check');
    const terminalSvg = generateFlowchartSymbol('terminal', 'Start / End');
    const dbSvg = generateFlowchartSymbol('database', 'SQL Database');

    container.innerHTML = `
      <div class="stencil-item" id="item-proc">
        <div class="stencil-preview">${processSvg}</div>
        <span class="stencil-title">Process Box</span>
      </div>
      <div class="stencil-item" id="item-dec">
        <div class="stencil-preview">${decisionSvg}</div>
        <span class="stencil-title">Decision Diamond</span>
      </div>
      <div class="stencil-item" id="item-term">
        <div class="stencil-preview">${terminalSvg}</div>
        <span class="stencil-title">Terminal Node</span>
      </div>
      <div class="stencil-item" id="item-db">
        <div class="stencil-preview">${dbSvg}</div>
        <span class="stencil-title">Data Store</span>
      </div>
    `;

    document.getElementById('item-proc')?.addEventListener('click', () => insertToCanvas('Flowchart Process', processSvg));
    document.getElementById('item-dec')?.addEventListener('click', () => insertToCanvas('Flowchart Decision', decisionSvg));
    document.getElementById('item-term')?.addEventListener('click', () => insertToCanvas('Flowchart Terminal', terminalSvg));
    document.getElementById('item-db')?.addEventListener('click', () => insertToCanvas('Flowchart Database', dbSvg));
  } else {
    // Smart Connectors
    const orthoConnectorSvg = generateSmartConnector(10, 10, 180, 80, 'orthogonal');
    const curvedConnectorSvg = generateSmartConnector(10, 10, 180, 80, 'curved');

    container.innerHTML = `
      <div class="stencil-item" id="item-ortho">
        <div class="stencil-preview">${orthoConnectorSvg}</div>
        <span class="stencil-title">Orthogonal Connector</span>
      </div>
      <div class="stencil-item" id="item-curved">
        <div class="stencil-preview">${curvedConnectorSvg}</div>
        <span class="stencil-title">Curved Bezier Connector</span>
      </div>
    `;

    document.getElementById('item-ortho')?.addEventListener('click', () => insertToCanvas('Smart Connector (Orthogonal)', orthoConnectorSvg));
    document.getElementById('item-curved')?.addEventListener('click', () => insertToCanvas('Smart Connector (Curved)', curvedConnectorSvg));
  }
}

renderStencils();
