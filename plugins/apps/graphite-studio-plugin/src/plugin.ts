import type { PluginMessageEvent, PluginUIEvent } from './model.js';

// Open Graphite Procedural & Filter Studio UI
penpot.ui.open('Graphite Procedural & Filter Studio', `?theme=${penpot.theme}`, {
  width: 460,
  height: 640,
});

penpot.ui.onMessage<PluginUIEvent>((message) => {
  if (message.type === 'insert-shape') {
    const { name, svg } = message.content;
    if (!svg) return;

    try {
      const shape = penpot.createShapeFromSvg(svg);
      if (shape) {
        shape.name = name || 'Graphite Procedural Shape';
        shape.x = penpot.viewport.center.x - (shape.width / 2);
        shape.y = penpot.viewport.center.y - (shape.height / 2);
        penpot.selection = [shape];
      }
    } catch (err) {
      console.error('[Graphite Plugin] Failed to create shape from SVG:', err);
    }
  } else if (message.type === 'apply-filter') {
    // Check if user has selected a shape
    const selection = penpot.selection;
    if (!selection || selection.length === 0) {
      // Create a demonstration filtered shape if nothing selected
      const { filterSvg } = message.content;
      if (filterSvg) {
        try {
          const shape = penpot.createShapeFromSvg(filterSvg);
          if (shape) {
            shape.name = 'Graphite Filter Demonstration';
            shape.x = penpot.viewport.center.x - (shape.width / 2);
            shape.y = penpot.viewport.center.y - (shape.height / 2);
            penpot.selection = [shape];
          }
        } catch (e) {
          console.error('[Graphite Plugin] Failed to insert filter demonstration:', e);
        }
      }
    }
  }
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme } as PluginMessageEvent);
});
