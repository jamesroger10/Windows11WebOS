import React, { useState } from 'react';
import { useFileSystemStore } from '../../../stores/useFileSystemStore';
import { useWindowStore } from '../../../stores/useWindowStore';
import { WinIcon } from '../../common/WinIcon';
import type { FSItem } from '../../../types/filesystem';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Search,
  Plus,
  X,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Copy,
  Scissors,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronRight,
  HardDrive
} from 'lucide-react';

interface FileExplorerProps {
  windowId: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ windowId }) => {
  const {
    items,
    tabs,
    activeTabId,
    createTab,
    closeTab,
    setActiveTab,
    navigateFolder,
    goBack,
    goForward,
    goUp,
    setSearchQuery,
    setViewMode,
    setSortBy,
    createItem,
    deleteItem,
    renameItem,
    getChildren,
    getPath,
  } = useFileSystemStore();

  const { openWindow } = useWindowStore();

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentFolder = items[currentTab.currentFolderId] || items['this-pc'];
  const breadcrumbs = getPath(currentTab.currentFolderId);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [clipboardItem, setClipboardItem] = useState<{ id: string; action: 'copy' | 'cut' } | null>(null);

  // Get and filter children items
  let children = getChildren(currentTab.currentFolderId);
  if (currentTab.searchQuery.trim()) {
    const q = currentTab.searchQuery.toLowerCase();
    children = children.filter((item) => item.name.toLowerCase().includes(q));
  }

  // Sort children
  children.sort((a, b) => {
    // Folders always first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    let comp = 0;
    if (currentTab.sortBy === 'name') {
      comp = a.name.localeCompare(b.name);
    } else if (currentTab.sortBy === 'modified') {
      comp = a.modified.localeCompare(b.modified);
    } else if (currentTab.sortBy === 'size') {
      comp = (a.size || 0) - (b.size || 0);
    }
    return currentTab.sortOrder === 'asc' ? comp : -comp;
  });

  const handleItemDoubleClick = (item: FSItem) => {
    if (item.type === 'folder') {
      navigateFolder(currentTab.id, item.id);
      setSelectedItemId(null);
    } else {
      // Open file in Notepad or appropriate app
      openWindow('notepad', {
        title: item.name,
        content: item.content || `[Binary or media file: ${item.name} (${item.sizeFormatted || 'Unknown size'})]`,
        fileId: item.id,
      });
    }
  };

  const handleStartRename = (item: FSItem) => {
    setRenamingItemId(item.id);
    setRenameInputValue(item.name);
  };

  const handleFinishRename = () => {
    if (renamingItemId && renameInputValue.trim()) {
      renameItem(renamingItemId, renameInputValue.trim());
    }
    setRenamingItemId(null);
  };

  const handleCreateNewFolder = () => {
    setShowNewMenu(false);
    const id = createItem(currentTab.currentFolderId, 'New Folder', 'folder');
    setRenamingItemId(id);
    setRenameInputValue('New Folder');
    setSelectedItemId(id);
  };

  const handleCreateNewFile = () => {
    setShowNewMenu(false);
    const id = createItem(currentTab.currentFolderId, 'New Document.txt', 'file', 'Type your content here...');
    setRenamingItemId(id);
    setRenameInputValue('New Document.txt');
    setSelectedItemId(id);
  };

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      deleteItem(selectedItemId);
      setSelectedItemId(null);
    }
  };

  const handleCopy = () => {
    if (selectedItemId) {
      setClipboardItem({ id: selectedItemId, action: 'copy' });
    }
  };

  const handleCut = () => {
    if (selectedItemId) {
      setClipboardItem({ id: selectedItemId, action: 'cut' });
    }
  };

  const handlePaste = () => {
    if (!clipboardItem) return;
    const item = items[clipboardItem.id];
    if (!item) return;

    if (clipboardItem.action === 'copy') {
      createItem(currentTab.currentFolderId, `Copy of ${item.name}`, item.type, item.content);
    } else if (clipboardItem.action === 'cut') {
      deleteItem(item.id);
      createItem(currentTab.currentFolderId, item.name, item.type, item.content);
      setClipboardItem(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e24] text-zinc-200 select-none overflow-hidden">
      {/* 1. Multi-Tab Bar */}
      <div className="flex items-center px-2 pt-1.5 gap-1 bg-black/20 border-b border-white/[0.06] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const folder = items[tab.currentFolderId] || { name: 'Folder', icon: 'folder' };
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 max-w-[210px] min-w-[120px] h-8 px-3 rounded-t-md text-xs cursor-default transition-all ${
                isActive
                  ? 'bg-[#25252d] text-white shadow-sm border-t border-x border-white/10'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              <WinIcon name={folder.icon || 'folder'} size={14} />
              <span className="truncate flex-1 font-normal text-[11.5px]">{folder.name}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-opacity"
                  title="Close tab"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={() => createTab(currentTab.currentFolderId)}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="New tab (Ctrl+T)"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* 2. Navigation & Breadcrumb Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#25252d] border-b border-white/[0.06] text-xs">
        {/* History Nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goBack(currentTab.id)}
            disabled={currentTab.historyIndex <= 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Back"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={() => goForward(currentTab.id)}
            disabled={currentTab.historyIndex >= currentTab.history.length - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Forward"
          >
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => goUp(currentTab.id)}
            disabled={!currentFolder.parentId}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Up to parent folder"
          >
            <ArrowUp size={15} />
          </button>
          <button
            onClick={() => navigateFolder(currentTab.id, currentTab.currentFolderId)}
            className="p-1 rounded hover:bg-white/10 transition-colors ml-0.5"
            title="Refresh"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Breadcrumb Path Box */}
        <div className="flex-1 flex items-center h-7 px-2.5 bg-[#1b1b22] border border-white/[0.08] rounded hover:border-white/20 focus-within:border-sky-500 transition-colors overflow-hidden">
          <WinIcon name={currentFolder.icon || 'folder'} size={14} className="shrink-0 mr-2" />
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-[12px]">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <ChevronRight size={12} className="text-zinc-500 shrink-0" />}
                <button
                  onClick={() => navigateFolder(currentTab.id, crumb.id)}
                  className="px-1 py-0.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white shrink-0 truncate max-w-[140px]"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Search Input Box */}
        <div className="w-56 flex items-center h-7 px-2.5 bg-[#1b1b22] border border-white/[0.08] rounded hover:border-white/20 focus-within:border-sky-500 transition-colors">
          <Search size={13} className="text-zinc-400 shrink-0 mr-1.5" />
          <input
            type="text"
            placeholder={`Search ${currentFolder.name}`}
            value={currentTab.searchQuery}
            onChange={(e) => setSearchQuery(currentTab.id, e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[12px] text-white placeholder-zinc-500"
          />
          {currentTab.searchQuery && (
            <button onClick={() => setSearchQuery(currentTab.id, '')} className="text-zinc-400 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Modern Windows 11 Command Bar */}
      <div className="relative flex items-center gap-1 px-3 py-1 bg-[#202026] border-b border-white/[0.06] text-xs">
        {/* New Item Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Plus size={14} className="text-sky-400" />
            <span>New</span>
          </button>

          {showNewMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#2b2b34] win-menu-shadow rounded-md border border-white/10 p-1 z-50 text-xs">
              <button
                onClick={handleCreateNewFolder}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-sky-600 text-left text-zinc-200 hover:text-white"
              >
                <FolderPlus size={14} className="text-amber-400" />
                <span>Folder</span>
              </button>
              <button
                onClick={handleCreateNewFile}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-sky-600 text-left text-zinc-200 hover:text-white"
              >
                <FilePlus size={14} className="text-sky-400" />
                <span>Text Document</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Command Icons */}
        <button
          onClick={handleCut}
          disabled={!selectedItemId}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white"
          title="Cut"
        >
          <Scissors size={14} />
        </button>
        <button
          onClick={handleCopy}
          disabled={!selectedItemId}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white"
          title="Copy"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={handlePaste}
          disabled={!clipboardItem}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white"
          title="Paste"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => {
            const item = items[selectedItemId || ''];
            if (item) handleStartRename(item);
          }}
          disabled={!selectedItemId}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white"
          title="Rename"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={!selectedItemId}
          className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Sort Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortBy(currentTab.id, 'name')}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
              currentTab.sortBy === 'name' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'
            }`}
          >
            <ArrowUpDown size={12} />
            <span>Sort</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center ml-auto gap-0.5">
          <button
            onClick={() => setViewMode(currentTab.id, 'grid')}
            className={`p-1.5 rounded ${
              currentTab.viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:bg-white/5'
            }`}
            title="Icons / Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode(currentTab.id, 'details')}
            className={`p-1.5 rounded ${
              currentTab.viewMode === 'details' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:bg-white/5'
            }`}
            title="Details / List View"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* 4. Explorer Main Area (Sidebar + Content View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <div className="w-48 shrink-0 bg-[#1a1a20]/80 border-r border-white/[0.06] p-2 flex flex-col gap-4 text-xs overflow-y-auto">
          {/* Quick Access */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">Quick access</div>
            <div className="flex flex-col gap-0.5 mt-1">
              {[
                { id: 'desktop', name: 'Desktop', icon: 'desktop' },
                { id: 'documents', name: 'Documents', icon: 'documents' },
                { id: 'downloads', name: 'Downloads', icon: 'downloads' },
                { id: 'pictures', name: 'Pictures', icon: 'pictures' },
                { id: 'music', name: 'Music', icon: 'music' },
              ].map((pin) => {
                const isCurrent = currentTab.currentFolderId === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => navigateFolder(currentTab.id, pin.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors ${
                      isCurrent
                        ? 'bg-sky-500/20 text-white font-medium'
                        : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <WinIcon name={pin.icon} size={15} />
                    <span className="truncate">{pin.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* This PC */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">This PC</div>
            <div className="flex flex-col gap-0.5 mt-1">
              <button
                onClick={() => navigateFolder(currentTab.id, 'this-pc')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors ${
                  currentTab.currentFolderId === 'this-pc'
                    ? 'bg-sky-500/20 text-white font-medium'
                    : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <WinIcon name="monitor" size={15} />
                <span className="truncate">This PC</span>
              </button>
              <button
                onClick={() => navigateFolder(currentTab.id, 'drive-c')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors ${
                  currentTab.currentFolderId === 'drive-c'
                    ? 'bg-sky-500/20 text-white font-medium'
                    : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <WinIcon name="hard-drive" size={15} />
                <span className="truncate">Local Disk (C:)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Files View */}
        <div
          onClick={() => {
            setSelectedItemId(null);
            setShowNewMenu(false);
          }}
          className="flex-1 bg-[#19191e] overflow-y-auto p-3"
        >
          {/* Special "This PC" Drives View */}
          {currentTab.currentFolderId === 'this-pc' ? (
            <div className="flex flex-col gap-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">Devices and drives (1)</div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItemId('drive-c');
                }}
                onDoubleClick={() => navigateFolder(currentTab.id, 'drive-c')}
                className={`flex items-center gap-3 p-3 w-72 rounded-lg border cursor-pointer transition-all ${
                  selectedItemId === 'drive-c'
                    ? 'bg-sky-500/15 border-sky-500/40'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                <HardDrive size={36} className="text-sky-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">Local Disk (C:)</div>
                  {/* Space Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-700 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full w-[64%]" />
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">184 GB free of 512 GB</div>
                </div>
              </div>
            </div>
          ) : children.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
              <WinIcon name="folder" size={40} className="opacity-40 mb-2" />
              <span>This folder is empty.</span>
            </div>
          ) : currentTab.viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
              {children.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isRenaming = renamingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItemId(item.id);
                    }}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center justify-start p-2 rounded-md cursor-pointer transition-all text-center group ${
                      isSelected
                        ? 'bg-sky-500/25 border border-sky-400/40 text-white'
                        : 'border border-transparent hover:bg-white/[0.05] text-zinc-200'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1 drop-shadow">
                      <WinIcon name={item.extension || item.icon || (item.type === 'folder' ? 'folder' : 'file')} size={36} />
                    </div>

                    {isRenaming ? (
                      <input
                        type="text"
                        autoFocus
                        value={renameInputValue}
                        onChange={(e) => setRenameInputValue(e.target.value)}
                        onBlur={handleFinishRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFinishRename();
                          if (e.key === 'Escape') setRenamingItemId(null);
                        }}
                        className="w-full text-center text-xs bg-black/60 border border-sky-400 rounded px-1 text-white outline-none"
                      />
                    ) : (
                      <span className="text-[11.5px] leading-tight line-clamp-2 break-all group-hover:text-white">
                        {item.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Details / List View */
            <div className="w-full text-xs">
              <div className="grid grid-cols-12 px-3 py-1.5 text-zinc-400 border-b border-white/[0.06] font-medium text-[11px]">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Date modified</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1 text-right">Size</div>
              </div>
              <div className="flex flex-col mt-1">
                {children.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                      }}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className={`grid grid-cols-12 items-center px-3 py-1.5 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-500/20 text-white'
                          : 'hover:bg-white/[0.04] text-zinc-300'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2 truncate pr-2">
                        <WinIcon name={item.extension || item.icon || (item.type === 'folder' ? 'folder' : 'file')} size={15} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <div className="col-span-3 text-zinc-400 text-[11px]">{item.modified}</div>
                      <div className="col-span-2 text-zinc-400 text-[11px] capitalize">{item.type === 'folder' ? 'File folder' : `${item.extension?.toUpperCase() || 'Text'} File`}</div>
                      <div className="col-span-1 text-right text-zinc-400 text-[11px]">{item.sizeFormatted || ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Status Bar */}
      <div className="h-6 shrink-0 bg-[#18181c] border-t border-white/[0.06] px-3 flex items-center justify-between text-[11px] text-zinc-400">
        <div>
          {children.length} {children.length === 1 ? 'item' : 'items'}
          {selectedItemId && ` | 1 item selected`}
        </div>
        <div className="flex items-center gap-2">
          <span>Windows 11 Explorer</span>
        </div>
      </div>
    </div>
  );
};
