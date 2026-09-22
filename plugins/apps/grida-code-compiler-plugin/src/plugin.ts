import type { PluginMessageEvent, PluginUIEvent } from './model.js';
import type { NodeLayout } from './compiler/types.js';

penpot.ui.open('Grida Design-to-Code Studio', `?theme=${penpot.theme}`, {
  width: 520,
  height: 640,
});

function serializeShape(shape: any): NodeLayout {
  if (!shape) {
    return { name: 'Empty', type: 'frame' };
  }

  const layout: NodeLayout = {
    name: shape.name || 'Component',
    type: shape.type || 'frame',
    width: shape.width,
    height: shape.height,
    x: shape.x,
    y: shape.y,
    borderRadius: shape.borderRadius,
    opacity: shape.opacity,
  };

  // Inspect fills
  if (shape.fills && shape.fills.length > 0) {
    const solidFill = shape.fills.find((f: any) => f.fillColor);
    if (solidFill) {
      layout.backgroundColor = solidFill.fillColor;
    }
  }

  // Inspect strokes
  if (shape.strokes && shape.strokes.length > 0) {
    const stroke = shape.strokes[0];
    layout.borderColor = stroke.strokeColor;
    layout.borderWidth = stroke.strokeWidth;
  }

  // Inspect flex layout
  if (shape.layout === 'flex' || shape.flexDirection) {
    layout.layoutMode = 'flex';
    layout.flexDirection = shape.flexDirection === 'row' ? 'row' : 'column';
    layout.gap = shape.gap;
    layout.paddingTop = shape.paddingTop;
    layout.paddingRight = shape.paddingRight;
    layout.paddingBottom = shape.paddingBottom;
    layout.paddingLeft = shape.paddingLeft;
    layout.justifyContent = shape.justifyContent;
    layout.alignItems = shape.alignItems;
  }

  // Text shape
  if (shape.type === 'text') {
    layout.textContent = shape.characters || shape.text || shape.name;
    layout.fontSize = shape.fontSize;
    layout.textColor = shape.textColor || '#ffffff';
  }

  // Children
  if (shape.children && shape.children.length > 0) {
    layout.children = shape.children.map((c: any) => serializeShape(c));
  }

  return layout;
}

function sendCurrentSelection() {
  const selection = penpot.selection;
  let selectedNode: NodeLayout | null = null;

  if (selection && selection.length > 0) {
    selectedNode = serializeShape(selection[0]);
  } else {
    // Provide a sample UI layout if nothing is selected
    selectedNode = {
      name: 'UserProfileCard',
      type: 'frame',
      layoutMode: 'flex',
      flexDirection: 'column',
      gap: 16,
      paddingTop: 24,
      paddingRight: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      borderRadius: 16,
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      children: [
        {
          name: 'UserName',
          type: 'text',
          textContent: 'Alex Morgan',
          fontSize: 20,
          fontWeight: 700,
          textColor: '#f8fafc',
        },
        {
          name: 'UserRole',
          type: 'text',
          textContent: 'Senior Product Designer',
          fontSize: 14,
          textColor: '#94a3b8',
        },
        {
          name: 'BadgeContainer',
          type: 'frame',
          layoutMode: 'flex',
          flexDirection: 'row',
          gap: 8,
          children: [
            {
              name: 'TagActive',
              type: 'text',
              textContent: 'Active Member',
              fontSize: 12,
              textColor: '#38bdf8',
            },
          ],
        },
      ],
    };
  }

  const hasSelection = Boolean(selection && selection.length > 0);
  penpot.ui.sendMessage({
    type: 'selection-change',
    content: { selectedNode, isSample: !hasSelection },
  } as PluginMessageEvent);
}

penpot.ui.onMessage<PluginUIEvent>((message) => {
  if (message.type === 'request-selection') {
    sendCurrentSelection();
  }
});

penpot.on('selectionchange', () => {
  sendCurrentSelection();
});

// Initial dispatch
setTimeout(sendCurrentSelection, 300);
