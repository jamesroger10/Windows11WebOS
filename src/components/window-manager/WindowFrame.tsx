import React, { useRef, useState, useCallback } from 'react';
import type { WindowInstance } from '../../types/window';
import { useWindowStore } from '../../stores/useWindowStore';
import { WinIcon } from '../common/WinIcon';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const { focusWindow, minimizeWindow, maximizeWindow, closeWindow, updateWindowBounds, activeWindowId } = useWindowStore();
  const isActive = activeWindowId === win.id;

  const frameRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const [isResizing, setIsResizing] = useState<string | null>(null);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  // Bring to focus on mousedown anywhere on the window
  const handlePointerDown = () => {
    if (!isActive) {
      focusWindow(win.id);
    }
  };

  // Header Drag handling
  const handleTitleBarPointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized) return; // Cannot drag if maximized
    if ((e.target as HTMLElement).closest('button')) return; // Ignore clicks on min/max/close

    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.x,
      startY: win.y,
    };
  };

  const handleTitleBarPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    // Viewport bounds clamping
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    const newX = Math.max(-win.width + 100, Math.min(screenW - 100, dragStartRef.current.startX + deltaX));
    const newY = Math.max(0, Math.min(screenH - 80, dragStartRef.current.startY + deltaY));

    updateWindowBounds(win.id, newX, newY);
  };

  const handleTitleBarPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  // 8-direction Resize handling
  const handleResizePointerDown = (direction: string, e: React.PointerEvent) => {
    if (win.isMaximized) return;
    e.stopPropagation();
    setIsResizing(direction);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.x,
      startY: win.y,
      startW: win.width,
      startH: win.height,
    };
  };

  const handleResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStartRef.current.mouseX;
    const deltaY = e.clientY - resizeStartRef.current.mouseY;

    let newX = resizeStartRef.current.startX;
    let newY = resizeStartRef.current.startY;
    let newW = resizeStartRef.current.startW;
    let newH = resizeStartRef.current.startH;

    if (isResizing.includes('e')) {
      newW = Math.max(win.minWidth, resizeStartRef.current.startW + deltaX);
    }
    if (isResizing.includes('s')) {
      newH = Math.max(win.minHeight, resizeStartRef.current.startH + deltaY);
    }
    if (isResizing.includes('w')) {
      const possibleW = resizeStartRef.current.startW - deltaX;
      if (possibleW >= win.minWidth) {
        newW = possibleW;
        newX = resizeStartRef.current.startX + deltaX;
      }
    }
    if (isResizing.includes('n')) {
      const possibleH = resizeStartRef.current.startH - deltaY;
      if (possibleH >= win.minHeight) {
        newH = possibleH;
        newY = resizeStartRef.current.startY + deltaY;
      }
    }

    updateWindowBounds(win.id, newX, newY, newW, newH);
  }, [isResizing, win.id, win.minWidth, win.minHeight, updateWindowBounds]);

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  if (win.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 48px)',
        zIndex: win.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={frameRef}
      onPointerDown={handlePointerDown}
      style={windowStyle}
      className={`flex flex-col select-none transition-shadow duration-150 ${
        win.isMaximized ? 'rounded-none' : 'rounded-lg'
      } ${
        isActive
          ? 'win-window-shadow ring-1 ring-white/15'
          : 'shadow-2xl ring-1 ring-white/5 opacity-95'
      } bg-[#1f1f24]/90 backdrop-blur-3xl overflow-hidden`}
    >
      {/* Titlebar */}
      <div
        onPointerDown={handleTitleBarPointerDown}
        onPointerMove={handleTitleBarPointerMove}
        onPointerUp={handleTitleBarPointerUp}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`h-9 shrink-0 flex items-center justify-between px-3 text-xs cursor-default ${
          isActive ? 'text-white' : 'text-zinc-400'
        } bg-white/[0.02] border-b border-white/[0.06] select-none`}
      >
        {/* App Icon & Title */}
        <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
          <WinIcon name={win.icon} size={15} />
          <span className="font-normal truncate text-[12px] tracking-wide">{win.title}</span>
        </div>

        {/* Windows 11 Min / Max / Close Controls */}
        <div className="flex items-center -mr-3 h-full">
          <button
            onClick={() => minimizeWindow(win.id)}
            className="h-full px-3.5 flex items-center justify-center hover:bg-white/10 active:bg-white/5 transition-colors text-zinc-300"
            title="Minimize"
          >
            <Minus size={12} strokeWidth={2} />
          </button>
          <button
            onClick={() => maximizeWindow(win.id)}
            className="h-full px-3.5 flex items-center justify-center hover:bg-white/10 active:bg-white/5 transition-colors text-zinc-300"
            title={win.isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {win.isMaximized ? <Copy size={11} className="rotate-90" /> : <Square size={11} strokeWidth={1.75} />}
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            className="h-full px-4 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white active:bg-[#b22617] transition-colors text-zinc-300"
            title="Close"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Window Body / Application Canvas */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[#19191d]/95">
        {children}
      </div>

      {/* Resize Grips (Active only when not maximized) */}
      {!win.isMaximized && (
        <>
          <div
            onPointerDown={(e) => handleResizePointerDown('n', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('s', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('w', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute top-2 bottom-2 left-0 w-1.5 cursor-ew-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('e', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute top-2 bottom-2 right-0 w-1.5 cursor-ew-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('nw', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('ne', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('sw', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('se', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50"
          />
        </>
      )}
    </div>
  );
};
