import React, { useEffect } from 'react';
import { useSystemStore } from '../../stores/useSystemStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { WinIcon } from '../common/WinIcon';
import type { AppId } from '../../types/window';
import {
  Search,
  Wifi,
  Volume2,
  VolumeX,
  BatteryCharging,
  ChevronUp,
  CloudSun
} from 'lucide-react';

export const Taskbar: React.FC = () => {
  const {
    currentTime,
    setCurrentTime,
    isStartMenuOpen,
    toggleStartMenu,
    toggleQuickSettings,
    toggleCalendar,
    volume,
    wifiEnabled,
    batteryLevel,
  } = useSystemStore();

  const { windows, activeWindowId, toggleWindow, minimizeAll } = useWindowStore();

  // Live real-time clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [setCurrentTime]);

  const taskbarApps: { id: AppId; name: string; icon: string }[] = [
    { id: 'edge', name: 'Microsoft Edge', icon: 'edge' },
    { id: 'explorer', name: 'File Explorer', icon: 'folder' },
    { id: 'taskmgr', name: 'Task Manager', icon: 'activity' },
    { id: 'notepad', name: 'Notepad', icon: 'file-text' },
    { id: 'spotify', name: 'Spotify', icon: 'spotify' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'calc', name: 'Calculator', icon: 'calculator' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal' },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 left-0 right-0 h-12 win-taskbar flex items-center justify-between px-3 select-none z-[9990]"
    >
      {/* Left side: Weather / Widgets button */}
      <div className="flex items-center min-w-[120px]">
        <button
          onClick={toggleStartMenu}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/10 active:bg-white/5 text-zinc-300 hover:text-white transition-colors"
          title="Widgets & Weather"
        >
          <CloudSun size={18} className="text-amber-400" />
          <div className="text-left leading-none hidden sm:block">
            <div className="text-[11px] font-semibold text-zinc-200">72°F</div>
            <div className="text-[9.5px] text-zinc-400">Mostly Sunny</div>
          </div>
        </button>
      </div>

      {/* Centered Launcher Area (Start Button + Apps) */}
      <div className="flex items-center gap-1.5 h-full">
        {/* Windows Start Button */}
        <button
          onClick={toggleStartMenu}
          className={`h-10 w-10 flex items-center justify-center rounded-md transition-all ${
            isStartMenuOpen
              ? 'bg-white/15 shadow-sm'
              : 'hover:bg-white/10 active:bg-white/5 active:scale-95'
          }`}
          title="Start"
        >
          <WinIcon name="windows" size={20} />
        </button>

        {/* Search Button */}
        <button
          onClick={toggleStartMenu}
          className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/10 active:bg-white/5 active:scale-95 transition-all text-zinc-300 hover:text-white"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Taskbar Apps */}
        {taskbarApps.map((app) => {
          const appWindows = windows.filter((w) => w.appId === app.id);
          const hasOpen = appWindows.length > 0;
          const isFocused = appWindows.some((w) => w.id === activeWindowId && !w.isMinimized);

          return (
            <button
              key={app.id}
              onClick={() => toggleWindow(app.id)}
              className={`relative h-10 w-10 flex items-center justify-center rounded-md transition-all ${
                isFocused
                  ? 'bg-white/15'
                  : hasOpen
                  ? 'bg-white/[0.07] hover:bg-white/10'
                  : 'hover:bg-white/10 active:scale-95'
              }`}
              title={app.name}
            >
              <div className="w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow">
                <WinIcon name={app.icon} size={22} />
              </div>

              {/* Windows 11 Running/Active Indicator Bar */}
              {hasOpen && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 transition-all">
                  {isFocused ? (
                    <div className="w-4 h-[3px] bg-sky-400 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: System Tray */}
      <div className="flex items-center gap-1 min-w-[120px] justify-end">
        {/* Hidden Icons Arrow */}
        <button className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <ChevronUp size={14} />
        </button>

        {/* Quick Settings Trigger (Wi-Fi, Volume, Battery) */}
        <button
          onClick={toggleQuickSettings}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/10 active:bg-white/5 transition-colors text-zinc-300 hover:text-white"
          title="Quick Settings (Wi-Fi, Volume, Battery)"
        >
          {wifiEnabled ? <Wifi size={14} /> : <div className="text-[10px] text-zinc-500">Offline</div>}
          {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <BatteryCharging size={14} className="text-emerald-400" />
        </button>

        {/* Date & Time Trigger (Calendar) */}
        <button
          onClick={toggleCalendar}
          className="flex flex-col items-end justify-center px-2 py-1 rounded-md hover:bg-white/10 active:bg-white/5 transition-colors text-right leading-tight"
          title="Notification Center & Calendar"
        >
          <div className="text-[11.5px] font-medium text-zinc-200">
            {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="text-[10px] text-zinc-400">
            {currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </div>
        </button>

        {/* Show Desktop Peek Strip (Far Right) */}
        <div
          onClick={minimizeAll}
          className="w-1.5 h-full hover:bg-white/20 active:bg-white/30 cursor-pointer ml-1 transition-colors border-l border-white/10"
          title="Show Desktop"
        />
      </div>
    </div>
  );
};
