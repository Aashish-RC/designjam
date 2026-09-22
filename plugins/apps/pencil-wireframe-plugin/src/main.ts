import {
  generateSketchyButton,
  generateSketchyInput,
  generateSketchyCheckbox,
  generateSketchyRadio,
  generateSketchyToggle,
  generateSketchyDropdown,
  generateSketchyAvatar,
  generateSketchyTable,
  generateSketchyDialog,
  generateMobilePhoneFrame,
  generateMobileAppBar,
  generateMobileBottomNav,
  generateFlowchartSymbol,
  generateSmartConnector,
} from './stencils.js';

let activeCategory = 'general';
let selectedShapeCount = 0;
const container = document.getElementById('stencils-container') as HTMLElement;

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = (btn as HTMLElement).dataset.category || 'general';
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

function insertConnector(connectorType: 'orthogonal' | 'curved') {
  parent.postMessage(
    {
      type: 'insert-connector',
      content: { connectorType },
    },
    '*'
  );
}

function renderStencils() {
  if (!container) return;

  if (activeCategory === 'general') {
    const btnSvg = generateSketchyButton('Action Button');
    const inputSvg = generateSketchyInput('Enter search term...');
    const checkSvg = generateSketchyCheckbox('Accept terms', true);
    const radioSvg = generateSketchyRadio('Default option', true);
    const toggleSvg = generateSketchyToggle('Notifications', true);
    const dropSvg = generateSketchyDropdown('Select country...');
    const avatarSvg = generateSketchyAvatar('Avatar', 64, 64);
    const tableSvg = generateSketchyTable(3, 3, 220, 100);
    const dialogSvg = generateSketchyDialog('Confirm Submission');

    container.innerHTML = `
      <div class="stencil-item" id="item-btn">
        <div class="stencil-preview">${btnSvg}</div>
        <span class="stencil-title">Button</span>
      </div>
      <div class="stencil-item" id="item-input">
        <div class="stencil-preview">${inputSvg}</div>
        <span class="stencil-title">Text Input</span>
      </div>
      <div class="stencil-item" id="item-check">
        <div class="stencil-preview">${checkSvg}</div>
        <span class="stencil-title">Checkbox</span>
      </div>
      <div class="stencil-item" id="item-radio">
        <div class="stencil-preview">${radioSvg}</div>
        <span class="stencil-title">Radio</span>
      </div>
      <div class="stencil-item" id="item-toggle">
        <div class="stencil-preview">${toggleSvg}</div>
        <span class="stencil-title">Toggle Switch</span>
      </div>
      <div class="stencil-item" id="item-drop">
        <div class="stencil-preview">${dropSvg}</div>
        <span class="stencil-title">Dropdown</span>
      </div>
      <div class="stencil-item" id="item-avatar">
        <div class="stencil-preview">${avatarSvg}</div>
        <span class="stencil-title">Avatar</span>
      </div>
      <div class="stencil-item" id="item-table">
        <div class="stencil-preview">${tableSvg}</div>
        <span class="stencil-title">Data Table</span>
      </div>
      <div class="stencil-item" id="item-dialog" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 110px;">${dialogSvg}</div>
        <span class="stencil-title">Modal Dialog</span>
      </div>
    `;

    document.getElementById('item-btn')?.addEventListener('click', () => insertToCanvas('Wireframe Button', btnSvg));
    document.getElementById('item-input')?.addEventListener('click', () => insertToCanvas('Wireframe Input', inputSvg));
    document.getElementById('item-check')?.addEventListener('click', () => insertToCanvas('Wireframe Checkbox', checkSvg));
    document.getElementById('item-radio')?.addEventListener('click', () => insertToCanvas('Wireframe Radio', radioSvg));
    document.getElementById('item-toggle')?.addEventListener('click', () => insertToCanvas('Wireframe Toggle', toggleSvg));
    document.getElementById('item-drop')?.addEventListener('click', () => insertToCanvas('Wireframe Dropdown', dropSvg));
    document.getElementById('item-avatar')?.addEventListener('click', () => insertToCanvas('Wireframe Avatar', avatarSvg));
    document.getElementById('item-table')?.addEventListener('click', () => insertToCanvas('Wireframe Table', tableSvg));
    document.getElementById('item-dialog')?.addEventListener('click', () => insertToCanvas('Wireframe Dialog', dialogSvg));
  } else if (activeCategory === 'mobile') {
    const phoneSvg = generateMobilePhoneFrame(140, 220);
    const appBarSvg = generateMobileAppBar('Dashboard', 200, 48);
    const bottomNavSvg = generateMobileBottomNav(200, 48);

    container.innerHTML = `
      <div class="stencil-item" id="item-phone" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 180px;">${phoneSvg}</div>
        <span class="stencil-title">Mobile Phone Frame</span>
      </div>
      <div class="stencil-item" id="item-appbar" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 60px;">${appBarSvg}</div>
        <span class="stencil-title">Mobile App Bar</span>
      </div>
      <div class="stencil-item" id="item-bottomnav" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 60px;">${bottomNavSvg}</div>
        <span class="stencil-title">Bottom Navigation Bar</span>
      </div>
    `;

    document.getElementById('item-phone')?.addEventListener('click', () => insertToCanvas('Mobile Phone Frame', generateMobilePhoneFrame(320, 640)));
    document.getElementById('item-appbar')?.addEventListener('click', () => insertToCanvas('Mobile App Bar', generateMobileAppBar('Dashboard', 320, 56)));
    document.getElementById('item-bottomnav')?.addEventListener('click', () => insertToCanvas('Mobile Bottom Nav', generateMobileBottomNav(320, 60)));
  } else if (activeCategory === 'flowchart') {
    const processSvg = generateFlowchartSymbol('process', 'Action');
    const decisionSvg = generateFlowchartSymbol('decision', 'Evaluate');
    const terminalSvg = generateFlowchartSymbol('terminal', 'Start/End');
    const dbSvg = generateFlowchartSymbol('database', 'Database');
    const cloudSvg = generateFlowchartSymbol('cloud', 'Cloud API');
    const ioSvg = generateFlowchartSymbol('io', 'Input/Output');
    const actorSvg = generateFlowchartSymbol('actor', 'User Actor');

    container.innerHTML = `
      <div class="stencil-item" id="item-proc">
        <div class="stencil-preview">${processSvg}</div>
        <span class="stencil-title">Process</span>
      </div>
      <div class="stencil-item" id="item-dec">
        <div class="stencil-preview">${decisionSvg}</div>
        <span class="stencil-title">Decision</span>
      </div>
      <div class="stencil-item" id="item-term">
        <div class="stencil-preview">${terminalSvg}</div>
        <span class="stencil-title">Terminal</span>
      </div>
      <div class="stencil-item" id="item-db">
        <div class="stencil-preview">${dbSvg}</div>
        <span class="stencil-title">Database</span>
      </div>
      <div class="stencil-item" id="item-cloud">
        <div class="stencil-preview">${cloudSvg}</div>
        <span class="stencil-title">Cloud System</span>
      </div>
      <div class="stencil-item" id="item-io">
        <div class="stencil-preview">${ioSvg}</div>
        <span class="stencil-title">I/O Data</span>
      </div>
      <div class="stencil-item" id="item-actor">
        <div class="stencil-preview" style="height: 70px;">${actorSvg}</div>
        <span class="stencil-title">Actor / Person</span>
      </div>
    `;

    document.getElementById('item-proc')?.addEventListener('click', () => insertToCanvas('Flowchart Process', processSvg));
    document.getElementById('item-dec')?.addEventListener('click', () => insertToCanvas('Flowchart Decision', decisionSvg));
    document.getElementById('item-term')?.addEventListener('click', () => insertToCanvas('Flowchart Terminal', terminalSvg));
    document.getElementById('item-db')?.addEventListener('click', () => insertToCanvas('Flowchart Database', dbSvg));
    document.getElementById('item-cloud')?.addEventListener('click', () => insertToCanvas('Flowchart Cloud', cloudSvg));
    document.getElementById('item-io')?.addEventListener('click', () => insertToCanvas('Flowchart I/O', ioSvg));
    document.getElementById('item-actor')?.addEventListener('click', () => insertToCanvas('Flowchart Actor', actorSvg));
  } else {
    // Connectors tab
    const orthoConnectorSvg = generateSmartConnector(10, 10, 180, 80, 'orthogonal');
    const curvedConnectorSvg = generateSmartConnector(10, 10, 180, 80, 'curved');

    const multiShapeMsg = selectedShapeCount >= 2
      ? `<span style="color: #10b981; font-weight: 700;">${selectedShapeCount} shapes selected</span>: Click below to dynamically link them!`
      : `<span style="color: #94a3b8;">Select 2 shapes on canvas to connect them dynamically, or insert standalone:</span>`;

    container.innerHTML = `
      <div style="grid-column: span 2; padding: 6px 4px; font-size: 11px;">
        ${multiShapeMsg}
      </div>
      <div class="stencil-item" id="item-ortho">
        <div class="stencil-preview">${orthoConnectorSvg}</div>
        <span class="stencil-title">Orthogonal ${selectedShapeCount >= 2 ? '(Connect Selected)' : ''}</span>
      </div>
      <div class="stencil-item" id="item-curved">
        <div class="stencil-preview">${curvedConnectorSvg}</div>
        <span class="stencil-title">Curved Bezier ${selectedShapeCount >= 2 ? '(Connect Selected)' : ''}</span>
      </div>
    `;

    document.getElementById('item-ortho')?.addEventListener('click', () => insertConnector('orthogonal'));
    document.getElementById('item-curved')?.addEventListener('click', () => insertConnector('curved'));
  }
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'selection-info') {
    selectedShapeCount = event.data.content?.count || 0;
    if (activeCategory === 'connectors') {
      renderStencils();
    }
  }
});

parent.postMessage({ type: 'request-selection' }, '*');
renderStencils();
