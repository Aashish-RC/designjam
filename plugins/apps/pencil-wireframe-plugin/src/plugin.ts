penpot.ui.open('Pencil Wireframe & Flowchart Studio', `?theme=${penpot.theme}`, {
  width: 460,
  height: 600,
});

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
  }
});
