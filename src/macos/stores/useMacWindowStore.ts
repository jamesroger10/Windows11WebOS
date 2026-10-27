import { create } from 'zustand';
import type { MacWindow, MacAppId } from '../types/macos';

interface WindowState {
  windows: MacWindow[];
  activeWindowId: string | null;
  highestZIndex: number;

  openWindow: (appId: MacAppId, customData?: any) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  closeAllWindows: () => void;
}

const DEFAULT_WINDOW_CONFIGS: Record<MacAppId, { title: string; width: number; height: number }> = {
  finder: { title: 'Finder', width: 780, height: 500 },
  safari: { title: 'Safari', width: 880, height: 580 },
  settings: { title: 'System Settings', width: 720, height: 520 },
  notes: { title: 'Notes', width: 760, height: 480 },
  terminal: { title: 'Terminal', width: 620, height: 400 },
};

export const useMacWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 100,

  openWindow: (appId, customData) => {
    const { windows, highestZIndex } = get();

    // If already open, restore and focus it
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      const nextZ = highestZIndex + 1;
      set({
        windows: windows.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: false, zIndex: nextZ } : w
        ),
        activeWindowId: existing.id,
        highestZIndex: nextZ,
      });
      return;
    }

    const config = DEFAULT_WINDOW_CONFIGS[appId];
    const offset = (windows.length % 6) * 26;

    // Center the window with staggered offset
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    const initialX = Math.max(40, Math.floor((screenW - config.width) / 2) + offset);
    const initialY = Math.max(48, Math.floor((screenH - config.height) / 2) - 20 + offset);

    const nextZ = highestZIndex + 1;
    const newWindow: MacWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: config.title,
      isMinimized: false,
      isMaximized: false,
      position: { x: initialX, y: initialY },
      size: { width: config.width, height: config.height },
      zIndex: nextZ,
      customData,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      highestZIndex: nextZ,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const remaining = windows.filter((w) => w.id !== id);
    let nextActive = activeWindowId;

    if (activeWindowId === id) {
      const visible = remaining.filter((w) => !w.isMinimized);
      if (visible.length > 0) {
        const topWindow = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
        nextActive = topWindow.id;
      } else {
        nextActive = null;
      }
    }

    set({ windows: remaining, activeWindowId: nextActive });
  },

  focusWindow: (id) => {
    const { windows, highestZIndex, activeWindowId } = get();
    if (activeWindowId === id) return;

    const nextZ = highestZIndex + 1;
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w)),
      activeWindowId: id,
      highestZIndex: nextZ,
    });
  },

  minimizeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    const updated = windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
    let nextActive = activeWindowId;

    if (activeWindowId === id) {
      const visible = updated.filter((w) => !w.isMinimized);
      if (visible.length > 0) {
        const topWindow = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
        nextActive = topWindow.id;
      } else {
        nextActive = null;
      }
    }

    set({ windows: updated, activeWindowId: nextActive });
  },

  restoreWindow: (id) => {
    const { windows, highestZIndex } = get();
    const nextZ = highestZIndex + 1;
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w)),
      activeWindowId: id,
      highestZIndex: nextZ,
    });
  },

  toggleMaximizeWindow: (id) => {
    const { windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (win.isMaximized) {
      // Restore previous bounds
      const prev = win.prevBounds || { x: 100, y: 100, width: 800, height: 500 };
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isMaximized: false,
                position: { x: prev.x, y: prev.y },
                size: { width: prev.width, height: prev.height },
              }
            : w
        ),
      });
    } else {
      // Maximize to full desktop minus top menu bar (28px) and dock margin
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isMaximized: true,
                prevBounds: { ...w.position, ...w.size },
                position: { x: 0, y: 28 },
                size: { width: screenW, height: screenH - 28 - 70 },
              }
            : w
        ),
      });
    }
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    }));
  },

  closeAllWindows: () => {
    set({ windows: [], activeWindowId: null });
  },
}));
