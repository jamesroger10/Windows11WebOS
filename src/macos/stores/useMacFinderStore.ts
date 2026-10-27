import { create } from 'zustand';
import type { FinderItem } from '../types/macos';

export type FinderViewMode = 'icons' | 'list' | 'columns';

export interface FinderTab {
  id: string;
  title: string;
  currentFolderId: string;
  history: string[];
  historyIndex: number;
}

interface MacFinderState {
  items: Record<string, FinderItem>;
  tabs: FinderTab[];
  activeTabId: string;
  viewMode: FinderViewMode;
  searchQuery: string;
  selectedItemId: string | null;

  setViewMode: (mode: FinderViewMode) => void;
  setSearchQuery: (query: string) => void;
  selectItem: (id: string | null) => void;
  navigateToFolder: (folderId: string) => void;
  goBack: () => void;
  goForward: () => void;
  addTab: (folderId?: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
}

const INITIAL_FINDER_ITEMS: Record<string, FinderItem> = {
  // Root / Places
  desktop: { id: 'desktop', name: 'Desktop', type: 'folder', icon: 'desktop', dateModified: 'Today, 9:41 AM' },
  documents: { id: 'documents', name: 'Documents', type: 'folder', icon: 'folder', dateModified: 'Yesterday, 4:15 PM' },
  downloads: { id: 'downloads', name: 'Downloads', type: 'folder', icon: 'download', dateModified: 'Today, 8:20 AM' },
  applications: { id: 'applications', name: 'Applications', type: 'folder', icon: 'apps', dateModified: 'Oct 24, 2026' },
  icloud: { id: 'icloud', name: 'iCloud Drive', type: 'folder', icon: 'cloud', dateModified: 'Just now' },

  // Desktop contents
  'doc-readme': {
    id: 'doc-readme',
    name: 'Welcome to macOS 27.txt',
    type: 'file',
    icon: 'text',
    parentId: 'desktop',
    size: '1.4 KB',
    dateModified: 'Today, 9:41 AM',
    content: `# Welcome to macOS 27 (Liquid Glass Edition)
This environment is built with extreme attention to Apple design standards:
- Liquid Glass translucent materials and vibrant blur
- Smooth interactive floating Dock with dynamic Gaussian magnification physics
- Multi-tabbed Finder with Favorites, iCloud, tags, and column/list/grid views
- Complete System Settings pane with live dark/light appearance switching
- Apple Menu and full-featured Control Center with quick toggles
- Built-in Safari, Notes, and Terminal apps!`,
  },
  'doc-specs': {
    id: 'doc-specs',
    name: 'Apple Silicon M4 Architecture.pdf',
    type: 'file',
    icon: 'pdf',
    parentId: 'desktop',
    size: '4.8 MB',
    dateModified: 'Yesterday, 2:10 PM',
    content: `Apple Silicon M4 Ultra
- 24-core CPU with 16 performance cores and 8 efficiency cores
- 60-core GPU with hardware ray tracing
- 128GB Unified Memory with 800GB/s bandwidth
- 38-core Neural Engine delivering 38 TOPS`,
  },
  'pic-sequoia': {
    id: 'pic-sequoia',
    name: 'Sequoia Sunset.heic',
    type: 'image',
    icon: 'image',
    parentId: 'desktop',
    size: '12.4 MB',
    dateModified: 'Oct 26, 2026',
  },

  // Documents contents
  'proj-finance': {
    id: 'proj-finance',
    name: 'Financial Projection Q4.xlsx',
    type: 'file',
    icon: 'sheet',
    parentId: 'documents',
    size: '820 KB',
    dateModified: 'Oct 25, 2026',
    content: `Q4 2026 Projections:
- Revenue: $18.4M (+24% YoY)
- Gross Margin: 68.2%
- Operating Cash Flow: $6.1M`,
  },
  'proj-design': {
    id: 'proj-design',
    name: 'Design System Guidelines.md',
    type: 'file',
    icon: 'text',
    parentId: 'documents',
    size: '22 KB',
    dateModified: 'Oct 22, 2026',
    content: `# macOS Design System Guidelines
- Corner Radius: 10px-18px for windows, 24px for dock
- Blur: 28px backdrop-filter with saturate(180%)
- Traffic Lights: Red (#FF5F56), Yellow (#FFBD2E), Green (#27C93F)`,
  },
  'subfolder-code': {
    id: 'subfolder-code',
    name: 'Source Code',
    type: 'folder',
    icon: 'folder',
    parentId: 'documents',
    dateModified: 'Oct 20, 2026',
  },
  'code-main': {
    id: 'code-main',
    name: 'kernel_hypervisor.rs',
    type: 'file',
    icon: 'code',
    parentId: 'subfolder-code',
    size: '14.2 KB',
    dateModified: 'Oct 20, 2026',
    content: `// macOS 27 Hypervisor Bridge
use std::sync::Arc;

pub struct VirtualMachine {
    vcpus: u32,
    ram_mb: usize,
}

impl VirtualMachine {
    pub fn boot(&self) -> Result<(), &'static str> {
        println!("Hypervisor virtual machine launched successfully.");
        Ok(())
    }
}`,
  },

  // Downloads contents
  'dl-archive': {
    id: 'dl-archive',
    name: 'Xcode_17_Beta.xip',
    type: 'file',
    icon: 'zip',
    parentId: 'downloads',
    size: '14.2 GB',
    dateModified: 'Today, 8:15 AM',
  },
  'dl-installer': {
    id: 'dl-installer',
    name: 'DockerDesktop.dmg',
    type: 'file',
    icon: 'dmg',
    parentId: 'downloads',
    size: '580 MB',
    dateModified: 'Today, 7:50 AM',
  },

  // Applications
  'app-safari': { id: 'app-safari', name: 'Safari.app', type: 'app', icon: 'safari', parentId: 'applications', dateModified: 'System', targetApp: 'safari' },
  'app-notes': { id: 'app-notes', name: 'Notes.app', type: 'app', icon: 'notes', parentId: 'applications', dateModified: 'System', targetApp: 'notes' },
  'app-terminal': { id: 'app-terminal', name: 'Terminal.app', type: 'app', icon: 'terminal', parentId: 'applications', dateModified: 'System', targetApp: 'terminal' },
  'app-settings': { id: 'app-settings', name: 'System Settings.app', type: 'app', icon: 'settings', parentId: 'applications', dateModified: 'System', targetApp: 'settings' },
};

const INITIAL_TAB: FinderTab = {
  id: 'tab-1',
  title: 'Desktop',
  currentFolderId: 'desktop',
  history: ['desktop'],
  historyIndex: 0,
};

export const useMacFinderStore = create<MacFinderState>((set, get) => ({
  items: INITIAL_FINDER_ITEMS,
  tabs: [INITIAL_TAB],
  activeTabId: 'tab-1',
  viewMode: 'icons',
  searchQuery: '',
  selectedItemId: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectItem: (selectedItemId) => set({ selectedItemId }),

  navigateToFolder: (folderId) => {
    const { tabs, activeTabId, items } = get();
    const folder = items[folderId];
    if (!folder) return;

    set({
      tabs: tabs.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(folderId);
        return {
          ...tab,
          title: folder.name,
          currentFolderId: folderId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
      selectedItemId: null,
    });
  },

  goBack: () => {
    const { tabs, activeTabId, items } = get();
    set({
      tabs: tabs.map((tab) => {
        if (tab.id !== activeTabId || tab.historyIndex <= 0) return tab;
        const newIndex = tab.historyIndex - 1;
        const targetId = tab.history[newIndex];
        const folder = items[targetId];
        return {
          ...tab,
          historyIndex: newIndex,
          currentFolderId: targetId,
          title: folder ? folder.name : tab.title,
        };
      }),
      selectedItemId: null,
    });
  },

  goForward: () => {
    const { tabs, activeTabId, items } = get();
    set({
      tabs: tabs.map((tab) => {
        if (tab.id !== activeTabId || tab.historyIndex >= tab.history.length - 1) return tab;
        const newIndex = tab.historyIndex + 1;
        const targetId = tab.history[newIndex];
        const folder = items[targetId];
        return {
          ...tab,
          historyIndex: newIndex,
          currentFolderId: targetId,
          title: folder ? folder.name : tab.title,
        };
      }),
      selectedItemId: null,
    });
  },

  addTab: (folderId = 'desktop') => {
    const { tabs, items } = get();
    const folder = items[folderId];
    const newTab: FinderTab = {
      id: `tab-${Date.now()}`,
      title: folder ? folder.name : 'Desktop',
      currentFolderId: folderId,
      history: [folderId],
      historyIndex: 0,
    };
    set({ tabs: [...tabs, newTab], activeTabId: newTab.id });
  },

  closeTab: (tabId) => {
    const { tabs, activeTabId } = get();
    if (tabs.length <= 1) return; // Keep at least one tab

    const remaining = tabs.filter((t) => t.id !== tabId);
    let nextActive = activeTabId;
    if (activeTabId === tabId) {
      nextActive = remaining[remaining.length - 1].id;
    }
    set({ tabs: remaining, activeTabId: nextActive });
  },

  setActiveTab: (activeTabId) => set({ activeTabId }),
}));
