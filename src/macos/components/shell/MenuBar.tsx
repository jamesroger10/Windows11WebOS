import React, { useState, useEffect } from 'react';
import { useMacSystemStore } from '../../stores/useMacSystemStore';
import { useMacWindowStore } from '../../stores/useMacWindowStore';
import { MacIcon } from '../common/MacIcon';
import { Wifi, Search, SlidersHorizontal, BatteryCharging } from 'lucide-react';

interface MenuBarProps {
  onRestartToBootloader: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onRestartToBootloader }) => {
  const {
    isAppleMenuOpen,
    toggleAppleMenu,
    toggleControlCenter,
    toggleSpotlight,
    activeMenuDropdown,
    setActiveMenuDropdown,
    closeAllFlyouts,
    wifiEnabled,
  } = useMacSystemStore();

  const { windows, activeWindowId, openWindow, closeWindow } = useMacWindowStore();

  // Determine active app title
  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeAppName = activeWindow ? activeWindow.title : 'Finder';

  // Live Clock
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }) + '  ' + now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (menuName: string) => {
    if (activeMenuDropdown === menuName) {
      setActiveMenuDropdown(null);
    } else {
      setActiveMenuDropdown(menuName);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed top-0 left-0 right-0 h-7 mac-menubar z-[9999] px-3.5 flex items-center justify-between text-[13px] text-white select-none"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Left Menu Items */}
      <div className="flex items-center gap-4">
        {/* Apple Logo Dropdown */}
        <div className="relative">
          <button
            onClick={toggleAppleMenu}
            className={`p-1 rounded flex items-center justify-center transition-colors ${
              isAppleMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <MacIcon name="apple" size={15} className="text-white" />
          </button>

          {/* Apple Dropdown Menu */}
          {isAppleMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-[#23232c]/95 backdrop-blur-3xl rounded-lg border border-white/15 p-1 text-xs shadow-2xl z-[10000]">
              <button
                onClick={() => {
                  closeAllFlyouts();
                  openWindow('settings');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors"
              >
                About This Mac
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  closeAllFlyouts();
                  openWindow('settings');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors"
              >
                System Settings...
              </button>
              <button
                onClick={() => {
                  closeAllFlyouts();
                  openWindow('finder');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors"
              >
                App Store...
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  closeAllFlyouts();
                  if (activeWindow) closeWindow(activeWindow.id);
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors flex justify-between"
              >
                <span>Force Quit...</span>
                <span className="text-zinc-400">⌥⌘⎋</span>
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  closeAllFlyouts();
                  onRestartToBootloader();
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors flex justify-between"
              >
                <span>Restart to Bootloader...</span>
                <span className="text-zinc-400">⎋</span>
              </button>
              <button
                onClick={() => {
                  closeAllFlyouts();
                  onRestartToBootloader();
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors"
              >
                Shut Down...
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  closeAllFlyouts();
                  onRestartToBootloader();
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white transition-colors"
              >
                Lock Screen
              </button>
            </div>
          )}
        </div>

        {/* Active App Name */}
        <span className="font-bold text-zinc-100 tracking-tight">{activeAppName}</span>

        {/* Contextual Menus */}
        {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((item) => (
          <div key={item} className="relative hidden sm:block">
            <button
              onClick={() => handleMenuClick(item)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeMenuDropdown === item ? 'bg-white/20' : 'hover:bg-white/10'
              } text-zinc-200 hover:text-white text-[12.5px]`}
            >
              {item}
            </button>

            {/* Menu dropdown */}
            {activeMenuDropdown === item && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#23232c]/95 backdrop-blur-3xl rounded-lg border border-white/15 p-1 text-xs shadow-2xl z-[10000]">
                {item === 'File' && (
                  <>
                    <button
                      onClick={() => {
                        closeAllFlyouts();
                        openWindow('finder');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white flex justify-between"
                    >
                      <span>New Finder Window</span>
                      <span className="text-zinc-400">⌘N</span>
                    </button>
                    <button
                      onClick={() => {
                        closeAllFlyouts();
                        openWindow('safari');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white flex justify-between"
                    >
                      <span>New Safari Window</span>
                      <span className="text-zinc-400">⌘T</span>
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => {
                        closeAllFlyouts();
                        if (activeWindow) closeWindow(activeWindow.id);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-[#007aff] hover:text-white flex justify-between"
                    >
                      <span>Close Window</span>
                      <span className="text-zinc-400">⌘W</span>
                    </button>
                  </>
                )}
                {item === 'Edit' && (
                  <>
                    <div className="px-3 py-1.5 text-zinc-400 flex justify-between">
                      <span>Undo</span>
                      <span>⌘Z</span>
                    </div>
                    <div className="px-3 py-1.5 text-zinc-400 flex justify-between">
                      <span>Redo</span>
                      <span>⇧⌘Z</span>
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded flex justify-between cursor-pointer">
                      <span>Select All</span>
                      <span className="text-zinc-400">⌘A</span>
                    </div>
                  </>
                )}
                {item === 'View' && (
                  <>
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer">
                      as Icons
                    </div>
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer">
                      as List
                    </div>
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer">
                      as Columns
                    </div>
                  </>
                )}
                {item === 'Go' && (
                  <>
                    <div
                      onClick={() => {
                        closeAllFlyouts();
                        openWindow('finder');
                      }}
                      className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer flex justify-between"
                    >
                      <span>Applications</span>
                      <span className="text-zinc-400">⇧⌘A</span>
                    </div>
                    <div
                      onClick={() => {
                        closeAllFlyouts();
                        openWindow('finder');
                      }}
                      className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer flex justify-between"
                    >
                      <span>Documents</span>
                      <span className="text-zinc-400">⇧⌘O</span>
                    </div>
                  </>
                )}
                {item === 'Window' && (
                  <>
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer flex justify-between">
                      <span>Minimize</span>
                      <span className="text-zinc-400">⌘M</span>
                    </div>
                    <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer">
                      Zoom
                    </div>
                  </>
                )}
                {item === 'Help' && (
                  <div className="px-3 py-1.5 text-zinc-200 hover:bg-[#007aff] hover:text-white rounded cursor-pointer">
                    macOS 27 Help
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right System Tray Icons */}
      <div className="flex items-center gap-3">
        {/* Battery */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
          <span>98%</span>
          <BatteryCharging size={15} className="text-emerald-400" />
        </div>

        {/* Wi-Fi */}
        <button
          onClick={toggleControlCenter}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title={wifiEnabled ? 'Wi-Fi: Connected' : 'Wi-Fi: Off'}
        >
          <Wifi size={14} className={wifiEnabled ? 'text-white' : 'text-zinc-500'} />
        </button>

        {/* Spotlight */}
        <button
          onClick={toggleSpotlight}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title="Spotlight Search (⌘Space)"
        >
          <Search size={14} className="text-zinc-200 hover:text-white" />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={toggleControlCenter}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title="Control Center"
        >
          <SlidersHorizontal size={14} className="text-zinc-200 hover:text-white" />
        </button>

        {/* Clock */}
        <span className="text-xs font-medium text-zinc-200 pl-1 cursor-default">
          {timeStr}
        </span>
      </div>
    </div>
  );
};
