export interface OverlayHeatmapMessage {
  type: 'overlay-heatmap';
  content: {
    svg: string;
    boardName?: string;
  };
}

export type PluginUIEvent = OverlayHeatmapMessage;
export type PluginMessageEvent = { type: 'theme'; content: string };
