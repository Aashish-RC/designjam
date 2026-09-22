import type { PluginMessageEvent, PluginUIEvent } from './model.js';

// Open Graphite Procedural & Filter Studio UI
penpot.ui.open('Graphite Procedural & Filter Studio', `?theme=${penpot.theme}`, {
  width: 480,
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
    const selection = penpot.selection || [];
    
    // Check if user has selected a shape on canvas
    if (selection.length === 0) {
      penpot.ui.sendMessage({
        type: 'notification',
        content: '⚠️ No element selected. Please select a layer or frame on the canvas to apply this filter.',
      } as PluginMessageEvent);
      return;
    }

    const { filterId, filterSvg } = message.content;
    let appliedCount = 0;

    for (const shape of selection) {
      try {
        const w = Math.max(Math.round(shape.width || 200), 20);
        const h = Math.max(Math.round(shape.height || 200), 20);
        const r = shape.borderRadius || 0;

        // Construct targeted filter SVG wrapping the shape's bounds
        const targetSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  ${filterSvg}
  <rect width="${w}" height="${h}" rx="${r}" fill="#38bdf8" filter="url(#${filterId})" opacity="0.85" />
</svg>`.trim();

        const filterLayer = penpot.createShapeFromSvg(targetSvg);
        if (filterLayer) {
          filterLayer.name = `Filter: ${shape.name || 'Selection'} [${filterId}]`;
          filterLayer.x = shape.x;
          filterLayer.y = shape.y;
          appliedCount++;
        }
      } catch (err) {
        console.error('[Graphite Plugin] Failed to apply filter to selected shape:', err);
      }
    }

    if (appliedCount > 0) {
      penpot.ui.sendMessage({
        type: 'notification',
        content: `✓ Applied filter to ${appliedCount} selected layer(s).`,
      } as PluginMessageEvent);
    }
  }
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme } as PluginMessageEvent);
});
