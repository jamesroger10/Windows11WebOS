import { create } from 'zustand';
import type { AppId, WindowInstance } from '../types/window';

interface WindowStoreState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  maxZIndex: number;
  openWindow: (appId: AppId, customData?: any) => string;
  closeWindow: (id: string) => void;
  closeWindowsByAppId: (appId: AppId) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleWindow: (appId: AppId) => void;
  updateWindowBounds: (id: string, x: number, y: number, width?: number, height?: number) => void;
  minimizeAll: () => void;
}

const DEFAULT_APP_SPECS: Record<AppId, {
  title: string;
  icon: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  allowMultiple: boolean;
}> = {
  explorer: {
    title: 'File Explorer',
    icon: 'folder',
    width: 860,
    height: 560,
    minWidth: 500,
    minHeight: 380,
    allowMultiple: true,
  },
  taskmgr: {
    title: 'Task Manager',
    icon: 'activity',
    width: 880,
    height: 580,
    minWidth: 600,
    minHeight: 400,
    allowMultiple: false,
  },
  notepad: {
    title: 'Notepad',
    icon: 'file-text',
    width: 640,
    height: 480,
    minWidth: 350,
    minHeight: 250,
    allowMultiple: true,
  },
  settings: {
    title: 'Settings',
    icon: 'settings',
    width: 820,
    height: 540,
    minWidth: 520,
    minHeight: 400,
    allowMultiple: false,
  },
  calc: {
    title: 'Calculator',
    icon: 'calculator',
    width: 340,
    height: 480,
    minWidth: 320,
    minHeight: 420,
    allowMultiple: false,
  },
  terminal: {
    title: 'Terminal',
    icon: 'terminal',
    width: 720,
    height: 460,
    minWidth: 450,
    minHeight: 300,
    allowMultiple: true,
  },
  edge: {
    title: 'Microsoft Edge',
    icon: 'edge',
    width: 960,
    height: 640,
    minWidth: 550,
    minHeight: 400,
    allowMultiple: true,
  },
  spotify: {
    title: 'Spotify',
    icon: 'spotify',
    width: 960,
    height: 640,
    minWidth: 500,
    minHeight: 400,
    allowMultiple: false,
  },
};

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: 100,

  openWindow: (appId: AppId, customData?: any) => {
    const state = get();
    const specs = DEFAULT_APP_SPECS[appId];

    // Single-instance app check
    if (!specs.allowMultiple) {
      const existing = state.windows.find((w) => w.appId === appId);
      if (existing) {
        if (existing.isMinimized) {
          get().focusWindow(existing.id);
        } else {
          get().focusWindow(existing.id);
        }
        return existing.id;
      }
    }

    const nextZ = state.maxZIndex + 1;
    const id = `${appId}-${Date.now()}`;
    const offset = (state.windows.length % 6) * 28;

    // Center the window with staggered offset
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const posX = Math.max(20, Math.floor((screenW - specs.width) / 2) + offset);
    const posY = Math.max(20, Math.floor((screenH - specs.height - 48) / 2) + offset);

    const newWindow: WindowInstance = {
      id,
      appId,
      title: customData?.title || specs.title,
      icon: specs.icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      x: posX,
      y: posY,
      width: specs.width,
      height: specs.height,
      minWidth: specs.minWidth,
      minHeight: specs.minHeight,
      customData,
    };

    set({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      maxZIndex: nextZ,
    });

    return id;
  },

  closeWindow: (id: string) => {
    set((state) => {
      const filtered = state.windows.filter((w) => w.id !== id);
      const nextActive = filtered.length > 0 ? filtered.reduce((prev, curr) => (prev.zIndex > curr.zIndex ? prev : curr)).id : null;
      return {
        windows: filtered,
        activeWindowId: state.activeWindowId === id ? nextActive : state.activeWindowId,
      };
    });
  },

  closeWindowsByAppId: (appId: AppId) => {
    set((state) => {
      const filtered = state.windows.filter((w) => w.appId !== appId);
      const nextActive = filtered.length > 0 ? filtered.reduce((prev, curr) => (prev.zIndex > curr.zIndex ? prev : curr)).id : null;
      return {
        windows: filtered,
        activeWindowId: filtered.some((w) => w.id === state.activeWindowId) ? state.activeWindowId : nextActive,
      };
    });
  },

  minimizeWindow: (id: string) => {
    set((state) => {
      const updated = state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
      const visible = updated.filter((w) => !w.isMinimized);
      const nextActive = visible.length > 0 ? visible.reduce((prev, curr) => (prev.zIndex > curr.zIndex ? prev : curr)).id : null;
      return {
        windows: updated,
        activeWindowId: state.activeWindowId === id ? nextActive : state.activeWindowId,
      };
    });
  },

  maximizeWindow: (id: string) => {
    set((state) => {
      const win = state.windows.find((w) => w.id === id);
      if (!win) return state;

      const nextZ = state.maxZIndex + 1;
      const updated = state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            x: w.restoreState?.x ?? 80,
            y: w.restoreState?.y ?? 60,
            width: w.restoreState?.width ?? w.minWidth,
            height: w.restoreState?.height ?? w.minHeight,
            zIndex: nextZ,
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            restoreState: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
            zIndex: nextZ,
          };
        }
      });

      return {
        windows: updated,
        activeWindowId: id,
        maxZIndex: nextZ,
      };
    });
  },

  focusWindow: (id: string) => {
    set((state) => {
      const win = state.windows.find((w) => w.id === id);
      if (!win) return state;

      const nextZ = state.maxZIndex + 1;
      return {
        windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w)),
        activeWindowId: id,
        maxZIndex: nextZ,
      };
    });
  },

  toggleWindow: (appId: AppId) => {
    const state = get();
    const appWindows = state.windows.filter((w) => w.appId === appId);

    if (appWindows.length === 0) {
      get().openWindow(appId);
      return;
    }

    const activeWin = appWindows.find((w) => w.id === state.activeWindowId);

    if (activeWin && !activeWin.isMinimized) {
      // If currently focused and active, minimize it
      get().minimizeWindow(activeWin.id);
    } else {
      // Focus the most recently active instance of this app
      const topWin = appWindows.reduce((prev, curr) => (prev.zIndex > curr.zIndex ? prev : curr));
      get().focusWindow(topWin.id);
    }
  },

  updateWindowBounds: (id: string, x: number, y: number, width?: number, height?: number) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              x,
              y,
              width: width !== undefined ? Math.max(w.minWidth, width) : w.width,
              height: height !== undefined ? Math.max(w.minHeight, height) : w.height,
            }
          : w
      ),
    }));
  },

  minimizeAll: () => {
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isMinimized: true })),
      activeWindowId: null,
    }));
  },
}));
