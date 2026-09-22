import type { PluginUIEvent } from './model.js';

penpot.ui.open('Quant-UX Usability Lab', `?theme=${penpot.theme}`, {
  width: 500,
  height: 640,
});

penpot.ui.onMessage<PluginUIEvent>((message) => {
  if (message.type === 'overlay-heatmap') {
    const { svg, boardName } = message.content;
    if (!svg) return;

    try {
      const shape = penpot.createShapeFromSvg(svg);
      if (shape) {
        shape.name = `Heatmap: ${boardName || 'Active Screen'}`;
        
        // Position directly over selection or viewport center
        const sel = penpot.selection;
        if (sel && sel.length > 0) {
          shape.x = sel[0].x;
          shape.y = sel[0].y;
        } else {
          shape.x = penpot.viewport.center.x - (shape.width / 2);
          shape.y = penpot.viewport.center.y - (shape.height / 2);
        }
        
        penpot.selection = [shape];
      }
    } catch (err) {
      console.error('[Quant-UX Plugin] Failed to overlay heatmap:', err);
    }
  }
});
