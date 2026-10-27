import React, { useState, useEffect } from 'react';
import { useWindowStore } from './stores/useWindowStore';
import { useSystemStore } from './stores/useSystemStore';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/taskbar/Taskbar';
import { StartMenu } from './components/start-menu/StartMenu';
import { QuickSettingsFlyout } from './components/taskbar/QuickSettingsFlyout';
import { CalendarFlyout } from './components/taskbar/CalendarFlyout';
import { WindowFrame } from './components/window-manager/WindowFrame';
import { LandingPage } from './components/landing/LandingPage';
import { MacOSShell } from './macos/components/shell/MacOSShell';

// Apps
import { FileExplorer } from './components/apps/explorer/FileExplorer';
import { TaskManager } from './components/apps/taskmgr/TaskManager';
import { NotepadApp } from './components/apps/notepad/NotepadApp';
import { SettingsApp } from './components/apps/settings/SettingsApp';
import { CalculatorApp } from './components/apps/calc/CalculatorApp';
import { TerminalApp } from './components/apps/terminal/TerminalApp';
import { EdgeBrowser } from './components/apps/edge/EdgeBrowser';
import { SpotifyApp } from './components/apps/spotify/SpotifyApp';

export const App: React.FC = () => {
  const [currentOS, setCurrentOS] = useState<'landing' | 'windows' | 'macos'>('landing');
  const { windows, openWindow } = useWindowStore();
  const { toggleStartMenu, closeAllFlyouts } = useSystemStore();

  // Initial auto-open File Explorer and Task Manager when Windows boots
  useEffect(() => {
    if (currentOS === 'windows') {
      openWindow('explorer');
      const timer = setTimeout(() => {
        openWindow('taskmgr');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentOS, openWindow]);

  // Global keyboard shortcuts (Windows key, Escape)
  useEffect(() => {
    if (currentOS !== 'windows') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllFlyouts();
      }
      // Windows Key (Meta or specific key)
      if (e.key === 'Meta' || e.key === 'OS') {
        toggleStartMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentOS, toggleStartMenu, closeAllFlyouts]);

  if (currentOS === 'landing') {
    return (
      <LandingPage
        onSelectOS={(os) => {
          setCurrentOS(os);
        }}
      />
    );
  }

  if (currentOS === 'macos') {
    return <MacOSShell onRestartToBootloader={() => setCurrentOS('landing')} />;
  }


  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      {/* 1. Desktop Canvas & Shortcuts */}
      <Desktop />

      {/* 2. Window Manager Stacking Layer */}
      {windows.map((win) => (
        <WindowFrame key={win.id} window={win}>
          {win.appId === 'explorer' && <FileExplorer windowId={win.id} />}
          {win.appId === 'taskmgr' && <TaskManager windowId={win.id} />}
          {win.appId === 'notepad' && <NotepadApp windowId={win.id} customData={win.customData} />}
          {win.appId === 'settings' && <SettingsApp />}
          {win.appId === 'calc' && <CalculatorApp />}
          {win.appId === 'terminal' && <TerminalApp />}
          {win.appId === 'edge' && <EdgeBrowser />}
          {win.appId === 'spotify' && <SpotifyApp />}
        </WindowFrame>
      ))}

      {/* 3. Start Menu Popover */}
      <StartMenu />

      {/* 4. Tray Flyouts */}
      <QuickSettingsFlyout />
      <CalendarFlyout />

      {/* 5. Fixed Taskbar */}
      <Taskbar />
    </div>
  );
};

export default App;
