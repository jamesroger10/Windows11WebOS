import { create } from 'zustand';
import type { ExplorerTab, FSItem } from '../types/filesystem';

interface FileSystemState {
  items: Record<string, FSItem>;
  tabs: ExplorerTab[];
  activeTabId: string;
  
  // Navigation & Tabs
  createTab: (folderId?: string) => string;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  navigateFolder: (tabId: string, folderId: string) => void;
  goBack: (tabId: string) => void;
  goForward: (tabId: string) => void;
  goUp: (tabId: string) => void;
  setSearchQuery: (tabId: string, query: string) => void;
  setViewMode: (tabId: string, mode: 'grid' | 'details' | 'list') => void;
  setSortBy: (tabId: string, sortBy: 'name' | 'modified' | 'type' | 'size') => void;

  // File Operations
  createItem: (parentId: string, name: string, type: 'folder' | 'file', content?: string) => string;
  deleteItem: (id: string) => void;
  renameItem: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string) => void;
  
  // Helpers
  getItem: (id: string) => FSItem | undefined;
  getChildren: (parentId: string) => FSItem[];
  getPath: (folderId: string) => FSItem[];
}

// Initial mock file system tree
const INITIAL_ITEMS: Record<string, FSItem> = {
  // System roots
  'this-pc': {
    id: 'this-pc',
    name: 'This PC',
    type: 'folder',
    parentId: null,
    modified: '2026-10-26 12:00',
    icon: 'monitor',
    isSystem: true,
  },
  'drive-c': {
    id: 'drive-c',
    name: 'Local Disk (C:)',
    type: 'folder',
    parentId: 'this-pc',
    sizeFormatted: '184 GB free of 512 GB',
    modified: '2026-10-26 12:00',
    icon: 'hard-drive',
    isSystem: true,
  },

  // User standard folders
  'desktop': {
    id: 'desktop',
    name: 'Desktop',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-26 14:10',
    icon: 'monitor',
    isSystem: true,
  },
  'documents': {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-26 16:30',
    icon: 'folder',
    isSystem: true,
  },
  'downloads': {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-26 18:20',
    icon: 'download',
    isSystem: true,
  },
  'pictures': {
    id: 'pictures',
    name: 'Pictures',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-26 11:45',
    icon: 'image',
    isSystem: true,
  },
  'music': {
    id: 'music',
    name: 'Music',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-26 09:15',
    icon: 'music',
    isSystem: true,
  },

  // Desktop items
  'welcome-file': {
    id: 'welcome-file',
    name: 'Welcome to Windows 11.txt',
    type: 'file',
    extension: 'txt',
    parentId: 'desktop',
    size: 1420,
    sizeFormatted: '1.4 KB',
    modified: '2026-10-26 10:00',
    content: `Welcome to this high-fidelity Windows 11 Web OS experience!

Features included:
• Authentic Windows 11 Mica & Acrylic translucent blur effects
• Fully responsive Window Manager (Drag, Resize, Minimize, Maximize, Snap)
• Multi-tabbed File Explorer with Quick Access, This PC, Command Bar, and real file interactions
• Interactive Task Manager with live CPU/RAM metrics and a working "End Task" action
• Centered Taskbar with Start Menu, Calendar, and Quick Settings (WiFi, Volume, Brightness)

Enjoy exploring this interactive desktop!`,
  },
  'project-specs': {
    id: 'project-specs',
    name: 'Project_Architecture.md',
    type: 'file',
    extension: 'md',
    parentId: 'desktop',
    size: 3200,
    sizeFormatted: '3.1 KB',
    modified: '2026-10-26 15:40',
    content: `# Windows 11 WebOS Architecture

## Core Components:
1. Window Manager (useWindowStore):
   - Multi-window stacking context with monotonically increasing zIndex
   - Pointer events drag engine with boundary clamping
2. File Explorer (useFileSystemStore):
   - In-memory hierarchical directory tree
   - Multiple tabs with independent history stacks
3. Task Manager (useProcessStore):
   - Real-time telemetry simulation engine
   - Process termination syncing with active windows`,
  },
  'nature-wallpaper': {
    id: 'nature-wallpaper',
    name: 'Bloom_Wallpaper_4K.jpg',
    type: 'file',
    extension: 'jpg',
    parentId: 'desktop',
    size: 2840000,
    sizeFormatted: '2.8 MB',
    modified: '2026-10-25 18:22',
  },

  // Documents items
  'annual-budget': {
    id: 'annual-budget',
    name: 'Financial_Report_2026.xlsx',
    type: 'file',
    extension: 'xlsx',
    parentId: 'documents',
    size: 84000,
    sizeFormatted: '82 KB',
    modified: '2026-10-24 14:12',
  },
  'resume-doc': {
    id: 'resume-doc',
    name: 'Software_Engineer_Resume.docx',
    type: 'file',
    extension: 'docx',
    parentId: 'documents',
    size: 45000,
    sizeFormatted: '44 KB',
    modified: '2026-10-26 09:30',
  },
  'meeting-notes': {
    id: 'meeting-notes',
    name: 'Sprint_Planning_Notes.txt',
    type: 'file',
    extension: 'txt',
    parentId: 'documents',
    size: 890,
    sizeFormatted: '890 Bytes',
    modified: '2026-10-26 11:15',
    content: `Sprint 42 Goals:
- Deliver Windows 11 WebOS core components
- Polish Mica blur and elevation shadows
- Optimize Task Manager CPU and Memory 60 FPS charts
- Test multi-tab file explorer directory switching`,
  },

  // Downloads items
  'vscode-setup': {
    id: 'vscode-setup',
    name: 'VSCodeUserSetup-x64-1.92.0.exe',
    type: 'file',
    extension: 'exe',
    parentId: 'downloads',
    size: 98400000,
    sizeFormatted: '93.8 MB',
    modified: '2026-10-26 17:05',
  },
  'theme-pack': {
    id: 'theme-pack',
    name: 'Win11_Fluent_Icons.zip',
    type: 'file',
    extension: 'zip',
    parentId: 'downloads',
    size: 14200000,
    sizeFormatted: '13.5 MB',
    modified: '2026-10-26 13:20',
  },

  // Pictures items
  'vacation-photo': {
    id: 'vacation-photo',
    name: 'Mountains_Panorama.png',
    type: 'file',
    extension: 'png',
    parentId: 'pictures',
    size: 4200000,
    sizeFormatted: '4.0 MB',
    modified: '2026-10-20 16:50',
  },
  'profile-avatar': {
    id: 'profile-avatar',
    name: 'User_Avatar.png',
    type: 'file',
    extension: 'png',
    parentId: 'pictures',
    size: 512000,
    sizeFormatted: '500 KB',
    modified: '2026-10-18 10:30',
  },

  // Music items
  'lofi-track': {
    id: 'lofi-track',
    name: 'Chill_Evening_Lofi.mp3',
    type: 'file',
    extension: 'mp3',
    parentId: 'music',
    size: 8500000,
    sizeFormatted: '8.1 MB',
    modified: '2026-10-22 21:00',
  },
  'synthwave-song': {
    id: 'synthwave-song',
    name: 'Neon_Midnight.wav',
    type: 'file',
    extension: 'wav',
    parentId: 'music',
    size: 32000000,
    sizeFormatted: '30.5 MB',
    modified: '2026-10-19 14:15',
  },

  // Windows system folder
  'win-dir': {
    id: 'win-dir',
    name: 'Windows',
    type: 'folder',
    parentId: 'drive-c',
    modified: '2026-10-15 08:00',
    isSystem: true,
  },
  'system32': {
    id: 'system32',
    name: 'System32',
    type: 'folder',
    parentId: 'win-dir',
    modified: '2026-10-15 08:00',
    isSystem: true,
  },
  'cmd-exe': {
    id: 'cmd-exe',
    name: 'cmd.exe',
    type: 'file',
    extension: 'exe',
    parentId: 'system32',
    size: 345000,
    sizeFormatted: '337 KB',
    modified: '2026-10-15 08:00',
  },
  'explorer-exe': {
    id: 'explorer-exe',
    name: 'explorer.exe',
    type: 'file',
    extension: 'exe',
    parentId: 'win-dir',
    size: 4500000,
    sizeFormatted: '4.3 MB',
    modified: '2026-10-15 08:00',
  },
};

const INITIAL_TAB_ID = 'tab-1';

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  items: INITIAL_ITEMS,
  tabs: [
    {
      id: INITIAL_TAB_ID,
      currentFolderId: 'this-pc',
      history: ['this-pc'],
      historyIndex: 0,
      searchQuery: '',
      viewMode: 'grid',
      sortBy: 'name',
      sortOrder: 'asc',
    },
  ],
  activeTabId: INITIAL_TAB_ID,

  createTab: (folderId = 'this-pc') => {
    const tabId = `tab-${Date.now()}`;
    const newTab: ExplorerTab = {
      id: tabId,
      currentFolderId: folderId,
      history: [folderId],
      historyIndex: 0,
      searchQuery: '',
      viewMode: 'grid',
      sortBy: 'name',
      sortOrder: 'asc',
    };

    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: tabId,
    }));

    return tabId;
  },

  closeTab: (tabId: string) => {
    set((state) => {
      if (state.tabs.length <= 1) {
        // Keep at least one tab
        return state;
      }
      const newTabs = state.tabs.filter((t) => t.id !== tabId);
      const nextActiveId = state.activeTabId === tabId ? newTabs[newTabs.length - 1].id : state.activeTabId;
      return {
        tabs: newTabs,
        activeTabId: nextActiveId,
      };
    });
  },

  setActiveTab: (tabId: string) => {
    set({ activeTabId: tabId });
  },

  navigateFolder: (tabId: string, folderId: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(folderId);
        return {
          ...tab,
          currentFolderId: folderId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          searchQuery: '',
        };
      }),
    }));
  },

  goBack: (tabId: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== tabId || tab.historyIndex <= 0) return tab;
        const newIndex = tab.historyIndex - 1;
        return {
          ...tab,
          currentFolderId: tab.history[newIndex],
          historyIndex: newIndex,
        };
      }),
    }));
  },

  goForward: (tabId: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== tabId || tab.historyIndex >= tab.history.length - 1) return tab;
        const newIndex = tab.historyIndex + 1;
        return {
          ...tab,
          currentFolderId: tab.history[newIndex],
          historyIndex: newIndex,
        };
      }),
    }));
  },

  goUp: (tabId: string) => {
    const tab = get().tabs.find((t) => t.id === tabId);
    if (!tab) return;
    const current = get().items[tab.currentFolderId];
    if (current && current.parentId) {
      get().navigateFolder(tabId, current.parentId);
    }
  },

  setSearchQuery: (tabId: string, query: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, searchQuery: query } : tab)),
    }));
  },

  setViewMode: (tabId: string, mode: 'grid' | 'details' | 'list') => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, viewMode: mode } : tab)),
    }));
  },

  setSortBy: (tabId: string, sortBy: 'name' | 'modified' | 'type' | 'size') => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        const isSame = tab.sortBy === sortBy;
        return {
          ...tab,
          sortBy,
          sortOrder: isSame ? (tab.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc',
        };
      }),
    }));
  },

  createItem: (parentId: string, name: string, type: 'folder' | 'file', content = '') => {
    const id = `item-${Date.now()}`;
    const ext = type === 'file' ? name.split('.').pop() || 'txt' : undefined;
    const newItem: FSItem = {
      id,
      name,
      type,
      extension: ext,
      parentId,
      size: type === 'file' ? content.length : 0,
      sizeFormatted: type === 'file' ? `${content.length} Bytes` : undefined,
      modified: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
    };

    set((state) => ({
      items: {
        ...state.items,
        [id]: newItem,
      },
    }));

    return id;
  },

  deleteItem: (id: string) => {
    set((state) => {
      const items = { ...state.items };
      delete items[id];
      // Also delete children recursively
      Object.values(items).forEach((item) => {
        if (item.parentId === id) {
          delete items[item.id];
        }
      });
      return { items };
    });
  },

  renameItem: (id: string, newName: string) => {
    set((state) => {
      const item = state.items[id];
      if (!item) return state;
      const ext = item.type === 'file' ? newName.split('.').pop() : undefined;
      return {
        items: {
          ...state.items,
          [id]: {
            ...item,
            name: newName,
            extension: ext,
            modified: new Date().toISOString().replace('T', ' ').substring(0, 16),
          },
        },
      };
    });
  },

  updateFileContent: (id: string, content: string) => {
    set((state) => {
      const item = state.items[id];
      if (!item) return state;
      return {
        items: {
          ...state.items,
          [id]: {
            ...item,
            content,
            size: content.length,
            sizeFormatted: `${content.length} Bytes`,
            modified: new Date().toISOString().replace('T', ' ').substring(0, 16),
          },
        },
      };
    });
  },

  getItem: (id: string) => get().items[id],

  getChildren: (parentId: string) => {
    return Object.values(get().items).filter((item) => item.parentId === parentId);
  },

  getPath: (folderId: string) => {
    const path: FSItem[] = [];
    let current: FSItem | undefined = get().items[folderId];
    while (current) {
      path.unshift(current);
      if (!current.parentId) break;
      current = get().items[current.parentId];
    }
    return path;
  },
}));
