import React, { useEffect, useState } from 'react';
import { useMacWindowStore } from '../../stores/useMacWindowStore';
import { useMacSystemStore } from '../../stores/useMacSystemStore';
import { useMacFinderStore } from '../../stores/useMacFinderStore';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { ControlCenter } from './ControlCenter';
import { Spotlight } from './Spotlight';
import { MacWindowFrame } from '../window-manager/MacWindowFrame';

// Apps
import { FinderApp } from '../apps/finder/FinderApp';
import { SystemSettingsApp } from '../apps/settings/SystemSettingsApp';
import { SafariApp } from '../apps/safari/SafariApp';
import { NotesApp } from '../apps/notes/NotesApp';
import { MacTerminalApp } from '../apps/terminal/MacTerminalApp';

// Icons
import { MacIcon } from '../common/MacIcon';
import { HardDrive, FileText, Image } from 'lucide-react';
import tahoeWallpaper from '../../../../images/macos-tahoe-26-5120x2880-22675.jpg';

interface MacOSShellProps {
  onRestartToBootloader: () => void;
}

export const MacOSShell: React.FC<MacOSShellProps> = ({ onRestartToBootloader }) => {
  const { windows, openWindow } = useMacWindowStore();
  const { wallpaper, closeAllFlyouts, toggleSpotlight } = useMacSystemStore();
  const { items } = useMacFinderStore();

  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Auto-open Finder and Notes on initial macOS boot
  useEffect(() => {
    openWindow('finder');
    const timer = setTimeout(() => {
      openWindow('notes');
    }, 200);
    return () => clearTimeout(timer);
  }, [openWindow]);

  // Global keyboard shortcuts (Cmd+Space, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllFlyouts();
        setContextMenuPos(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllFlyouts, toggleSpotlight]);

  const getWallpaperBackground = (wp: string) => {
    if (wp === 'tahoe' || !wp || wp === 'sequoia-dark') {
      return `url(${tahoeWallpaper}), url('./images/macos-tahoe-26-5120x2880-22675.jpg'), url('/images/macos-tahoe-26-5120x2880-22675.jpg')`;
    }
    switch (wp) {
      case 'sonoma-horizon':
        return 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)';
      case 'ventura-abstract':
        return 'linear-gradient(135deg, #0575E6 0%, #00F260 100%)';
      case 'monterey-purple':
        return 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)';
      case 'cyber-dark':
        return 'linear-gradient(135deg, #09090e 0%, #181926 50%, #050608 100%)';
      default:
        return `url(${tahoeWallpaper}), url('./images/macos-tahoe-26-5120x2880-22675.jpg'), url('/images/macos-tahoe-26-5120x2880-22675.jpg')`;
    }
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = () => {
    closeAllFlyouts();
    setContextMenuPos(null);
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none text-white cursor-default bg-black"
      style={{
        backgroundImage: getWallpaperBackground(wallpaper),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >

      {/* Dynamic Ambient Blur Glows on Wallpaper */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Desktop Icons (Upper right layout - classic macOS arrangement) */}
      <div className="absolute top-10 right-5 flex flex-col items-center gap-6 z-10">
        {/* Macintosh HD */}
        <div
          onDoubleClick={() => openWindow('finder')}
          className="flex flex-col items-center w-20 group cursor-pointer text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-zinc-200 group-hover:scale-105 transition-transform shadow-lg">
            <HardDrive size={26} />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1 px-1 rounded group-hover:bg-blue-600/60 leading-tight">
            Macintosh HD
          </span>
        </div>

        {/* Welcome file */}
        <div
          onDoubleClick={() =>
            openWindow('notes', {
              title: 'Welcome to macOS 27.txt',
              content: items['doc-readme']?.content,
            })
          }
          className="flex flex-col items-center w-20 group cursor-pointer text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-zinc-200 group-hover:scale-105 transition-transform shadow-lg">
            <FileText size={26} className="text-amber-400" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1 px-1 rounded group-hover:bg-blue-600/60 leading-tight truncate max-w-full">
            Welcome.txt
          </span>
        </div>
      </div>

      {/* Windows Layer */}
      {windows.map((win) => (
        <MacWindowFrame key={win.id} window={win}>
          {win.appId === 'finder' && <FinderApp />}
          {win.appId === 'settings' && <SystemSettingsApp />}
          {win.appId === 'safari' && <SafariApp />}
          {win.appId === 'notes' && <NotesApp customData={win.customData} />}
          {win.appId === 'terminal' && <MacTerminalApp />}
        </MacWindowFrame>
      ))}

      {/* Top Menu Bar */}
      <MenuBar onRestartToBootloader={onRestartToBootloader} />

      {/* Control Center */}
      <ControlCenter />

      {/* Spotlight Search Overlay */}
      <Spotlight />

      {/* Floating Glass Dock */}
      <Dock />

      {/* Desktop Context Menu */}
      {contextMenuPos && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-[10000] w-48 bg-[#23232c]/95 backdrop-blur-2xl rounded-xl border border-white/15 p-1 text-xs shadow-2xl"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <button
            onClick={() => {
              setContextMenuPos(null);
              openWindow('finder');
            }}
            className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white"
          >
            New Folder
          </button>
          <button
            onClick={() => {
              setContextMenuPos(null);
              openWindow('finder');
            }}
            className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white"
          >
            Get Info
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => {
              setContextMenuPos(null);
              openWindow('settings');
            }}
            className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white"
          >
            Change Wallpaper...
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => {
              setContextMenuPos(null);
              onRestartToBootloader();
            }}
            className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white text-zinc-300"
          >
            Switch OS / Boot Menu
          </button>
        </div>
      )}
    </div>
  );
};
