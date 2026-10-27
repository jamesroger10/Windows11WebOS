export type AppId = 'explorer' | 'taskmgr' | 'notepad' | 'settings' | 'calc' | 'terminal' | 'edge' | 'spotify';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  restoreState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  customData?: any;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  defaultTitle: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  allowMultiple?: boolean;
}
