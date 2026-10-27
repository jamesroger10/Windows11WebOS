import React, { useRef, useState, useCallback } from 'react';
import { useMacWindowStore } from '../../stores/useMacWindowStore';
import { MacIcon } from '../common/MacIcon';
import type { MacAppId } from '../../types/macos';

interface DockItemDef {
  id: MacAppId | 'trash' | 'downloads';
  title: string;
  icon: string;
  isApp: boolean;
}

export const Dock: React.FC = () => {
  const { windows, activeWindowId, openWindow, focusWindow, restoreWindow, minimizeWindow } =
    useMacWindowStore();

  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);

  const DOCK_ITEMS: DockItemDef[] = [
    { id: 'finder', title: 'Finder', icon: 'finder', isApp: true },
    { id: 'safari', title: 'Safari', icon: 'safari', isApp: true },
    { id: 'notes', title: 'Notes', icon: 'notes', isApp: true },
    { id: 'settings', title: 'System Settings', icon: 'settings', isApp: true },
    { id: 'terminal', title: 'Terminal', icon: 'terminal', isApp: true },
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setHoveredTitle(null);
  }, []);

  const handleItemClick = (item: DockItemDef) => {
    if (!item.isApp) return;
    const appId = item.id as MacAppId;

    // Trigger bounce animation
    setBouncingApp(appId);
    setTimeout(() => setBouncingApp(null), 1200);

    const existingWindow = windows.find((w) => w.appId === appId);
    if (!existingWindow) {
      openWindow(appId);
    } else if (existingWindow.isMinimized) {
      restoreWindow(existingWindow.id);
    } else if (activeWindowId === existingWindow.id) {
      minimizeWindow(existingWindow.id);
    } else {
      focusWindow(existingWindow.id);
    }
  };

  // Base icon slot dimension
  const baseSize = 48;
  const maxScale = 1.32;

  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-[9999] select-none flex flex-col items-center pointer-events-auto">
      {/* Floating App Name Tooltip */}
      {hoveredTitle && (
        <div
          className="mb-2 px-3 py-1 bg-[#1e1e24]/90 backdrop-blur-md rounded-md text-[11px] font-medium text-white border border-white/10 shadow-lg pointer-events-none transition-opacity"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
        >
          {hoveredTitle}
        </div>
      )}

      {/* Glass Dock Shelf */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="mac-dock-container px-3.5 py-2 flex items-center gap-2.5 transition-all duration-150 relative"
      >
        {/* Main App Icons */}
        {DOCK_ITEMS.map((item, idx) => {
          const isOpen = windows.some((w) => w.appId === item.id);
          const isBouncing = bouncingApp === item.id;

          // Calculate dynamic magnification based on distance to mouse
          let scale = 1;
          if (mouseX !== null && dockRef.current) {
            const itemCenterX = idx * (baseSize + 10) + baseSize / 2 + 14;
            const dist = Math.abs(mouseX - itemCenterX);
            const sigma = 45;
            const gaussian = Math.exp(-(dist * dist) / (2 * sigma * sigma));
            scale = 1 + (maxScale - 1) * gaussian;
          }

          const currentSize = Math.round(baseSize * scale);

          return (
            <div
              key={item.id}
              className="relative flex items-center justify-center group"
              style={{ width: baseSize, height: baseSize }}
              onMouseEnter={() => setHoveredTitle(item.title)}
            >
              <button
                onClick={() => handleItemClick(item)}
                className={`relative flex items-center justify-center transition-transform duration-100 ease-out origin-center ${
                  isBouncing ? 'animate-dock-bounce' : ''
                }`}
                style={{
                  width: currentSize,
                  height: currentSize,
                }}
              >
                <MacIcon name={item.icon} size={currentSize} className="drop-shadow-md select-none" />
              </button>

              {/* Running App Indicator Dot (positioned absolutely below icon, perfectly centered) */}
              {isOpen && (
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80 shadow-[0_0_4px_#fff] pointer-events-none"
                />
              )}
            </div>
          );
        })}

        {/* Separator Line */}
        <div className="w-[1px] h-8 bg-white/20 mx-1 self-center" />

        {/* Downloads folder */}
        <div
          className="relative flex items-center justify-center group cursor-pointer"
          style={{ width: baseSize, height: baseSize }}
          onMouseEnter={() => setHoveredTitle('Downloads')}
          onClick={() => openWindow('finder')}
        >
          <div className="flex items-center justify-center">
            <MacIcon name="folder" size={baseSize} className="drop-shadow select-none" />
          </div>
        </div>

        {/* Trash */}
        <div
          className="relative flex items-center justify-center group cursor-pointer"
          style={{ width: baseSize, height: baseSize }}
          onMouseEnter={() => setHoveredTitle('Trash')}
        >
          <div className="flex items-center justify-center">
            <MacIcon name="trash" size={baseSize} className="drop-shadow select-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
