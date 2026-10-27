export type MacAppId = 'finder' | 'safari' | 'settings' | 'notes' | 'terminal';

export interface MacWindow {
  id: string;
  appId: MacAppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  customData?: any;
}

export interface FinderItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'app';
  icon: string;
  size?: string;
  dateModified: string;
  parentId?: string; // null for root items
  content?: string;
  targetApp?: MacAppId;
}
