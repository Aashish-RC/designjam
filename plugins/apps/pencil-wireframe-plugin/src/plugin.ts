import { generateSmartConnector } from './stencils.js';

penpot.ui.open('Pencil Wireframe & Flowchart Studio', `?theme=${penpot.theme}`, {
  width: 480,
  height: 640,
});

function sendSelectionInfo() {
  const sel = penpot.selection || [];
  penpot.ui.sendMessage({
    type: 'selection-info',
    content: {
      count: sel.length,
      names: sel.map((s: any) => s.name || 'Shape'),
    },
  });
}

penpot.ui.onMessage((message: any) => {
  if (message.type === 'insert-stencil') {
    const { name, svg } = message.content;
    if (!svg) return;

    try {
      const shape = penpot.createShapeFromSvg(svg);
      if (shape) {
        shape.name = name || 'Pencil Stencil';
        shape.x = penpot.viewport.center.x - (shape.width / 2);
        shape.y = penpot.viewport.center.y - (shape.height / 2);
        penpot.selection = [shape];
      }
    } catch (e) {
      console.error('[Pencil Plugin] Failed to create stencil shape:', e);
    }
  } else if (message.type === 'insert-connector') {
    const { connectorType = 'orthogonal' } = message.content || {};
    const sel = penpot.selection || [];

    try {
      let svg = '';
      let posX = penpot.viewport.center.x - 100;
      let posY = penpot.viewport.center.y - 60;
      let name = 'Smart Connector';

      if (sel.length >= 2) {
        // Multi-shape connection between two selected shapes
        const a = sel[0];
        const b = sel[1];

        // Connection from center of A to center of B
        const aCenterX = a.x + (a.width / 2);
        const aCenterY = a.y + (a.height / 2);
        const bCenterX = b.x + (b.width / 2);
        const bCenterY = b.y + (b.height / 2);

        // Generate connector SVG spanning between relative delta
        const minX = Math.min(aCenterX, bCenterX);
        const minY = Math.min(aCenterY, bCenterY);

        const relA_X = aCenterX - minX + 20;
        const relA_Y = aCenterY - minY + 20;
        const relB_X = bCenterX - minX + 20;
        const relB_Y = bCenterY - minY + 20;

        svg = generateSmartConnector(relA_X, relA_Y, relB_X, relB_Y, connectorType);
        posX = minX - 20;
        posY = minY - 20;
        name = `Connector: ${a.name || 'A'} → ${b.name || 'B'}`;
      } else {
        // Default standalone connector
        svg = generateSmartConnector(20, 20, 220, 140, connectorType);
      }

      const shape = penpot.createShapeFromSvg(svg);
      if (shape) {
        shape.name = name;
        shape.x = posX;
        shape.y = posY;
        penpot.selection = [shape];
      }
    } catch (e) {
      console.error('[Pencil Plugin] Failed to create smart connector:', e);
    }
  } else if (message.type === 'request-selection') {
    sendSelectionInfo();
  }
});

penpot.on('selectionchange', () => {
  sendSelectionInfo();
});

// Initial selection info
setTimeout(sendSelectionInfo, 300);
