import React, { useState } from 'react';
import { useMacFinderStore, type FinderViewMode } from '../../../stores/useMacFinderStore';
import { useMacWindowStore } from '../../../stores/useMacWindowStore';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Columns,
  Search,
  Plus,
  X,
  Folder,
  FileText,
  Image,
  Code,
  Archive,
  HardDrive,
  Cloud,
  Tag,
  AppWindow,
} from 'lucide-react';
import { MacIcon } from '../../common/MacIcon';
import type { FinderItem, MacAppId } from '../../../types/macos';

export const FinderApp: React.FC = () => {
  const {
    items,
    tabs,
    activeTabId,
    viewMode,
    searchQuery,
    selectedItemId,
    setViewMode,
    setSearchQuery,
    selectItem,
    navigateToFolder,
    goBack,
    goForward,
    addTab,
    closeTab,
    setActiveTab,
  } = useMacFinderStore();

  const { openWindow } = useMacWindowStore();

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentFolderId = activeTab.currentFolderId;

  // Filter items in current directory
  const currentChildren = Object.values(items).filter((it) => {
    if (searchQuery.trim()) {
      return it.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return it.parentId === currentFolderId;
  });

  const handleItemDoubleClick = (item: FinderItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else if (item.type === 'app' && item.targetApp) {
      openWindow(item.targetApp);
    } else if (item.type === 'file' || item.type === 'image') {
      openWindow('notes', { title: item.name, content: item.content || `[Preview of ${item.name}]` });
    }
  };

  const getItemIcon = (item: FinderItem) => {
    if (item.type === 'folder') {
      return <MacIcon name="folder" size={38} className="drop-shadow" />;
    }
    if (item.type === 'app' && item.targetApp) {
      return <MacIcon name={item.targetApp} size={38} className="drop-shadow" />;
    }
    if (item.icon === 'pdf') {
      return (
        <div className="w-10 h-10 rounded bg-red-600/90 text-white flex items-center justify-center font-bold text-[10px] shadow">
          PDF
        </div>
      );
    }
    if (item.icon === 'sheet') {
      return (
        <div className="w-10 h-10 rounded bg-emerald-600/90 text-white flex items-center justify-center font-bold text-[10px] shadow">
          XLS
        </div>
      );
    }
    if (item.icon === 'code') {
      return (
        <div className="w-10 h-10 rounded bg-amber-600/90 text-white flex items-center justify-center font-bold text-[10px] shadow">
          CODE
        </div>
      );
    }
    if (item.icon === 'image') {
      return (
        <div className="w-10 h-10 rounded bg-purple-600/90 text-white flex items-center justify-center font-bold text-[10px] shadow">
          IMG
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded bg-zinc-600 text-white flex items-center justify-center shadow">
        <FileText size={20} />
      </div>
    );
  };

  return (
    <div
      className="flex-1 flex flex-col h-full bg-[#1e1e24] text-white select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* 1. Multi-Tab Bar (if tabs > 1 or default) */}
      <div className="flex items-center bg-[#25252e] border-b border-white/[0.08] px-2 pt-1 gap-1 overflow-x-auto text-xs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer border-t border-x ${
              tab.id === activeTabId
                ? 'bg-[#1e1e24] border-white/10 text-white font-medium'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Folder size={13} className="text-blue-400" />
            <span className="truncate max-w-[120px]">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="hover:bg-white/10 p-0.5 rounded text-zinc-400 hover:text-white"
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addTab(currentFolderId)}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="New Tab"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* 2. Top Toolbar */}
      <div className="h-11 px-3 bg-[#25252e]/80 border-b border-white/[0.08] flex items-center justify-between text-xs gap-3">
        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={activeTab.historyIndex <= 0}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300"
            title="Back"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300"
            title="Forward"
          >
            <ChevronRight size={16} />
          </button>
          <span className="ml-2 font-semibold text-zinc-100 text-sm">{activeTab.title}</span>
        </div>

        {/* View Switches */}
        <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={() => setViewMode('icons')}
            className={`p-1 rounded ${
              viewMode === 'icons' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Icon View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded ${
              viewMode === 'list' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="List View"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setViewMode('columns')}
            className={`p-1 rounded ${
              viewMode === 'columns' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Column View"
          >
            <Columns size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded-lg w-44 focus-within:w-56 focus-within:border-blue-500 transition-all">
          <Search size={13} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-full"
          />
        </div>
      </div>

      {/* 3. Main Body: Sidebar + File Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-48 bg-[#1a1a20]/90 border-r border-white/[0.08] p-2 flex flex-col gap-4 text-xs overflow-y-auto shrink-0">
          {/* Favorites */}
          <div>
            <div className="px-2 py-1 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              Favorites
            </div>
            <div className="space-y-0.5">
              {[
                { id: 'desktop', label: 'Desktop', icon: 'desktop' },
                { id: 'documents', label: 'Documents', icon: 'folder' },
                { id: 'downloads', label: 'Downloads', icon: 'download' },
                { id: 'applications', label: 'Applications', icon: 'apps' },
              ].map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => navigateToFolder(fav.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    currentFolderId === fav.id
                      ? 'bg-[#007aff] text-white font-medium'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <Folder size={14} className={currentFolderId === fav.id ? 'text-white' : 'text-blue-400'} />
                  <span>{fav.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* iCloud */}
          <div>
            <div className="px-2 py-1 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              iCloud
            </div>
            <button
              onClick={() => navigateToFolder('icloud')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                currentFolderId === 'icloud'
                  ? 'bg-[#007aff] text-white font-medium'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <Cloud size={14} className={currentFolderId === 'icloud' ? 'text-white' : 'text-sky-400'} />
              <span>iCloud Drive</span>
            </button>
          </div>

          {/* Locations */}
          <div>
            <div className="px-2 py-1 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              Locations
            </div>
            <button
              onClick={() => navigateToFolder('desktop')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-zinc-300 hover:bg-white/5"
            >
              <HardDrive size={14} className="text-zinc-400" />
              <span>Macintosh HD</span>
            </button>
          </div>

          {/* Tags */}
          <div>
            <div className="px-2 py-1 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              Tags
            </div>
            <div className="space-y-0.5">
              {[
                { name: 'Red', color: '#ff453a' },
                { name: 'Orange', color: '#ff9f0a' },
                { name: 'Blue', color: '#0a84ff' },
                { name: 'Work', color: '#30d158' },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg text-zinc-300 hover:bg-white/5 cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#18181e]">
          {/* Main files grid / list */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            onClick={() => selectItem(null)}
          >
            {currentChildren.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                This folder is empty
              </div>
            ) : viewMode === 'icons' ? (
              /* Icon Grid Mode */
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                {currentChildren.map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectItem(item.id);
                    }}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center cursor-default group transition-all ${
                      selectedItemId === item.id
                        ? 'bg-[#007aff]/30 border border-[#007aff]/60 text-white'
                        : 'hover:bg-white/5 border border-transparent text-zinc-200'
                    }`}
                  >
                    <div className="mb-2 group-hover:scale-105 transition-transform flex items-center justify-center">
                      {getItemIcon(item)}
                    </div>
                    <span className="text-[11.5px] font-medium truncate max-w-full leading-tight">
                      {item.name}
                    </span>
                    {item.size && (
                      <span className="text-[10px] text-zinc-500 mt-0.5">{item.size}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* List / Table Mode */
              <div className="w-full text-xs">
                <div className="grid grid-cols-12 pb-2 border-b border-white/10 text-[11px] font-semibold text-zinc-400 px-2">
                  <span className="col-span-6">Name</span>
                  <span className="col-span-3">Date Modified</span>
                  <span className="col-span-3 text-right">Size</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {currentChildren.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectItem(item.id);
                      }}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-lg cursor-default transition-colors ${
                        selectedItemId === item.id
                          ? 'bg-[#007aff] text-white font-medium'
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2 truncate">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {item.type === 'folder' ? (
                            <Folder size={16} className="text-blue-400" />
                          ) : (
                            <FileText size={16} className="text-zinc-400" />
                          )}
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="col-span-3 text-[11px] text-zinc-400 truncate">
                        {item.dateModified}
                      </span>
                      <span className="col-span-3 text-[11px] text-zinc-400 text-right">
                        {item.size || '--'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="h-6 bg-[#1f1f26] border-t border-white/[0.08] px-3 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{currentChildren.length} items</span>
            <span>482.4 GB available on Macintosh HD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
