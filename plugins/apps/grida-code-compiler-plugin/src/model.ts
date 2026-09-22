import { NodeLayout } from './compiler/types.js';

export interface SelectionMessage {
  type: 'selection-change';
  content: {
    selectedNode: NodeLayout | null;
  };
}

export interface RequestSelectionMessage {
  type: 'request-selection';
}

export type PluginMessageEvent = SelectionMessage;
export type PluginUIEvent = RequestSelectionMessage;
