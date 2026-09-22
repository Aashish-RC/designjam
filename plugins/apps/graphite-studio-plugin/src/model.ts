export type PluginMessageType =
  | 'insert-shape'
  | 'apply-filter'
  | 'theme'
  | 'notification';

export interface InsertShapeMessage {
  type: 'insert-shape';
  content: {
    name: string;
    svg: string;
  };
}

export interface ApplyFilterMessage {
  type: 'apply-filter';
  content: {
    filterId: string;
    filterSvg: string;
  };
}

export interface ThemeMessage {
  type: 'theme';
  content: string;
}

export interface NotificationMessage {
  type: 'notification';
  content: string;
}

export type PluginUIEvent = InsertShapeMessage | ApplyFilterMessage;
export type PluginMessageEvent = ThemeMessage | NotificationMessage;
