import React, { useState } from 'react';
import { useSystemStore } from '../../stores/useSystemStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { useFileSystemStore } from '../../stores/useFileSystemStore';
import { WinIcon } from '../common/WinIcon';
import type { AppId } from '../../types/window';
import {
  Search,
  Power,
  ChevronRight,
  RotateCcw,
  Moon,
  LogOut,
  User
} from 'lucide-react';

export const StartMenu: React.FC = () => {
  const { isStartMenuOpen, closeAllFlyouts } = useSystemStore();
  const { openWindow } = useWindowStore();
  const { items } = useFileSystemStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isStartMenuOpen) return null;

  const pinnedApps: { id: AppId; name: string; icon: string }[] = [
    { id: 'edge', name: 'Microsoft Edge', icon: 'edge' },
    { id: 'explorer', name: 'File Explorer', icon: 'folder' },
    { id: 'taskmgr', name: 'Task Manager', icon: 'activity' },
    { id: 'spotify', name: 'Spotify', icon: 'spotify' },
    { id: 'notepad', name: 'Notepad', icon: 'file-text' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'calc', name: 'Calculator', icon: 'calculator' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal' },
    { id: 'notepad', name: 'Word', icon: 'docx' },
    { id: 'notepad', name: 'Excel', icon: 'xlsx' },
    { id: 'explorer', name: 'Photos', icon: 'pictures' },
    { id: 'explorer', name: 'Music', icon: 'music' },
  ];

  const filteredApps = searchQuery.trim()
    ? pinnedApps.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : pinnedApps;

  const handleAppClick = (appId: AppId, appName?: string) => {
    closeAllFlyouts();
    if (appName === 'Downloads') {
      openWindow('explorer');
    } else {
      openWindow(appId);
    }
  };

  const handleOpenFile = (fileId: string) => {
    closeAllFlyouts();
    const file = items[fileId];
    if (file) {
      openWindow('notepad', {
        title: file.name,
        content: file.content || `[Content of ${file.name}]`,
        fileId: file.id,
      });
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowPowerMenu(false);
      }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[580px] max-w-[94vw] h-[600px] max-h-[85vh] win-acrylic win-flyout-shadow rounded-xl flex flex-col text-white z-[9999] animate-win-pop border border-white/10 overflow-hidden"
    >
      {/* Top Search Bar */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5 h-10 px-3.5 bg-[#1b1b20] border border-white/10 rounded-full focus-within:border-sky-500 shadow-inner transition-colors">
          <Search size={16} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        {/* Pinned Section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide text-zinc-200">Pinned</span>
          <button className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
            <span>All apps</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Pinned Apps Grid */}
        <div className="grid grid-cols-6 gap-y-4 gap-x-2 mb-6">
          {filteredApps.map((app, idx) => (
            <button
              key={idx}
              onClick={() => handleAppClick(app.id, app.name)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 active:bg-white/5 transition-colors group text-center"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform drop-shadow">
                <WinIcon name={app.icon} size={32} />
              </div>
              <span className="text-[11.5px] text-zinc-300 group-hover:text-white truncate max-w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Recommended Section */}
        {!searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wide text-zinc-200">Recommended</span>
              <button className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                <span>More</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'welcome-file', title: 'Welcome to Windows 11.txt', time: 'Just now', icon: 'txt' },
                { id: 'project-specs', title: 'Project_Architecture.md', time: '1 hour ago', icon: 'md' },
                { id: 'annual-budget', title: 'Financial_Report_2026.xlsx', time: 'Yesterday at 2:12 PM', icon: 'xlsx' },
                { id: 'meeting-notes', title: 'Sprint_Planning_Notes.txt', time: 'Yesterday at 11:15 AM', icon: 'txt' },
              ].map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleOpenFile(rec.id)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-left transition-colors group"
                >
                  <WinIcon name={rec.icon} size={24} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">{rec.title}</div>
                    <div className="text-[10.5px] text-zinc-400">{rec.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Bar */}
      <div className="h-14 bg-black/20 border-t border-white/[0.08] px-8 flex items-center justify-between text-xs relative select-none">
        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-sm font-semibold">
            <User size={16} />
          </div>
          <span className="text-xs font-medium text-white">Windows User</span>
        </div>

        {/* Power Button & Flyout */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPowerMenu(!showPowerMenu);
            }}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Power"
          >
            <Power size={18} />
          </button>

          {showPowerMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-36 bg-[#25252c] win-menu-shadow rounded-lg border border-white/10 p-1 text-xs z-50">
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  closeAllFlyouts();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-sky-600 text-left text-zinc-200 hover:text-white"
              >
                <Moon size={14} />
                <span>Sleep</span>
              </button>
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  closeAllFlyouts();
                  window.location.reload();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-sky-600 text-left text-zinc-200 hover:text-white"
              >
                <RotateCcw size={14} />
                <span>Restart</span>
              </button>
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  closeAllFlyouts();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-sky-600 text-left text-zinc-200 hover:text-white"
              >
                <Power size={14} />
                <span>Shut down</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
