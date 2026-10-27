import React, { useState, useRef } from 'react';
import { useFileSystemStore } from '../../stores/useFileSystemStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSystemStore } from '../../stores/useSystemStore';
import { WinIcon } from '../common/WinIcon';
import type { FSItem } from '../../types/filesystem';
import {
  RotateCw,
  FolderPlus,
  FilePlus,
  Monitor,
  Settings,
  Sliders,
  Trash2,
  Folder,
  Terminal,
  Activity
} from 'lucide-react';

export const Desktop: React.FC = () => {
  const { getChildren, createItem, items } = useFileSystemStore();
  const { openWindow } = useWindowStore();
  const { closeAllFlyouts, nightLight } = useSystemStore();

  const desktopFiles = getChildren('desktop');

  const [selectedDesktopId, setSelectedDesktopId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Marquee selection state
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const isMouseDownRef = useRef(false);

  // Double click file or folder
  const handleItemDoubleClick = (item: FSItem) => {
    if (item.type === 'folder') {
      openWindow('explorer');
    } else {
      openWindow('notepad', {
        title: item.name,
        content: item.content || `[Content of ${item.name}]`,
        fileId: item.id,
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Left click only for marquee selection
    if (e.button === 0) {
      closeAllFlyouts();
      setContextMenu(null);
      setSelectedDesktopId(null);

      isMouseDownRef.current = true;
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isMouseDownRef.current && selectionBox) {
      setSelectionBox((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
    setSelectionBox(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAllFlyouts();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Fixed core desktop icons
  const coreShortcuts = [
    { id: 'sc-thispc', name: 'This PC', icon: 'monitor', action: () => openWindow('explorer') },
    { id: 'sc-recycle', name: 'Recycle Bin', icon: 'trash', action: () => openWindow('explorer') },
    { id: 'sc-edge', name: 'Microsoft Edge', icon: 'edge', action: () => openWindow('edge') },
    { id: 'sc-explorer', name: 'File Explorer', icon: 'folder', action: () => openWindow('explorer') },
    { id: 'sc-spotify', name: 'Spotify', icon: 'spotify', action: () => openWindow('spotify') },
    { id: 'sc-taskmgr', name: 'Task Manager', icon: 'activity', action: () => openWindow('taskmgr') },
    { id: 'sc-terminal', name: 'Terminal', icon: 'terminal', action: () => openWindow('terminal') },
  ];

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      className={`fixed inset-0 w-screen h-screen select-none overflow-hidden bg-cover bg-center ${
        nightLight ? 'sepia-[0.25]' : ''
      }`}
      style={{
        backgroundImage: `url('./assets/wallpaper.jpg'), url('./wallpaper.jpg'), url('/wallpaper.jpg')`,
        backgroundColor: '#0a0d18',
      }}
    >
      {/* Desktop Icons Grid (Vertical flow on the left) */}
      <div className="absolute top-2 left-2 bottom-14 flex flex-col flex-wrap gap-y-1 gap-x-2 p-1 z-10 w-fit">
        {/* Core System Shortcuts */}
        {coreShortcuts.map((sc) => {
          const isSelected = selectedDesktopId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDesktopId(sc.id);
                setContextMenu(null);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                sc.action();
              }}
              className={`w-20 h-20 flex flex-col items-center justify-center p-1 rounded-md cursor-pointer transition-all text-center group ${
                isSelected
                  ? 'bg-sky-500/30 border border-sky-400/50 shadow-sm'
                  : 'hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {sc.id === 'sc-recycle' ? (
                  <Trash2 size={32} className="text-zinc-300 drop-shadow" />
                ) : (
                  <WinIcon name={sc.icon} size={32} />
                )}
              </div>
              <span className="text-[11.5px] font-normal text-white text-shadow leading-tight line-clamp-2 px-1">
                {sc.name}
              </span>
            </div>
          );
        })}

        {/* User Desktop Files */}
        {desktopFiles.map((file) => {
          const isSelected = selectedDesktopId === file.id;
          return (
            <div
              key={file.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDesktopId(file.id);
                setContextMenu(null);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleItemDoubleClick(file);
              }}
              className={`w-20 h-20 flex flex-col items-center justify-center p-1 rounded-md cursor-pointer transition-all text-center group ${
                isSelected
                  ? 'bg-sky-500/30 border border-sky-400/50 shadow-sm'
                  : 'hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                <WinIcon name={file.extension || file.icon || (file.type === 'folder' ? 'folder' : 'file')} size={32} />
              </div>
              <span className="text-[11.5px] font-normal text-white text-shadow leading-tight line-clamp-2 px-1">
                {file.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Marquee Selection Rectangle */}
      {selectionBox && (
        <div
          className="absolute bg-sky-500/20 border border-sky-400/60 pointer-events-none z-20"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
          }}
        />
      )}

      {/* Right Click Desktop Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed w-56 bg-[#25252c]/95 win-menu-shadow rounded-lg border border-white/10 p-1.5 text-xs text-zinc-200 z-[9999] animate-win-pop"
          style={{
            top: Math.min(contextMenu.y, window.innerHeight - 250),
            left: Math.min(contextMenu.x, window.innerWidth - 240),
          }}
        >
          <button
            onClick={() => {
              setContextMenu(null);
              window.location.reload();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <RotateCw size={14} />
            <span>Refresh</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              createItem('desktop', 'New Folder', 'folder');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <FolderPlus size={14} className="text-amber-400" />
            <span>New folder</span>
          </button>
          <button
            onClick={() => {
              createItem('desktop', 'New Text Document.txt', 'file', 'Hello from new document!');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <FilePlus size={14} className="text-sky-400" />
            <span>New text document</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              openWindow('settings');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <Monitor size={14} />
            <span>Display settings</span>
          </button>
          <button
            onClick={() => {
              openWindow('settings');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <Sliders size={14} />
            <span>Personalize</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              openWindow('terminal');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-sky-600 text-left hover:text-white"
          >
            <Terminal size={14} className="text-emerald-400" />
            <span>Open in Terminal</span>
          </button>
        </div>
      )}
    </div>
  );
};
