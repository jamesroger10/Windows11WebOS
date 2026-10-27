import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { MacWindow } from '../../types/macos';
import { useMacWindowStore } from '../../stores/useMacWindowStore';
import { WindowTrafficLights } from './WindowTrafficLights';

interface MacWindowFrameProps {
  window: MacWindow;
  children: React.ReactNode;
}

export const MacWindowFrame: React.FC<MacWindowFrameProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useMacWindowStore();

  const isFocused = activeWindowId === win.id;
  const frameRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const windowStartPosRef = useRef({ x: 0, y: 0 });

  // Resizing state
  const isResizingRef = useRef(false);
  const resizeDirectionRef = useRef<string | null>(null);
  const resizeStartRectRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Mouse drag handler
  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      focusWindow(win.id);

      isDraggingRef.current = true;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      windowStartPosRef.current = { ...win.position };

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = ev.clientX - dragStartPosRef.current.x;
        const dy = ev.clientY - dragStartPosRef.current.y;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const nextX = Math.max(0, Math.min(screenW - win.size.width, windowStartPosRef.current.x + dx));
        // Keep below the 28px top menu bar
        const nextY = Math.max(28, Math.min(screenH - 80, windowStartPosRef.current.y + dy));

        updateWindowPosition(win.id, { x: nextX, y: nextY });
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [win.id, win.isMaximized, win.position, win.size.width, focusWindow, updateWindowPosition]
  );

  // Resize handler
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.stopPropagation();
      if (win.isMaximized) return;
      focusWindow(win.id);

      isResizingRef.current = true;
      resizeDirectionRef.current = direction;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      resizeStartRectRef.current = {
        x: win.position.x,
        y: win.position.y,
        width: win.size.width,
        height: win.size.height,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!isResizingRef.current) return;
        const dx = ev.clientX - dragStartPosRef.current.x;
        const dy = ev.clientY - dragStartPosRef.current.y;
        const start = resizeStartRectRef.current;
        const dir = resizeDirectionRef.current;

        let nextWidth = start.width;
        let nextHeight = start.height;
        let nextX = start.x;
        let nextY = start.y;

        if (dir?.includes('e')) {
          nextWidth = Math.max(380, start.width + dx);
        }
        if (dir?.includes('s')) {
          nextHeight = Math.max(260, start.height + dy);
        }
        if (dir?.includes('w')) {
          const possibleW = start.width - dx;
          if (possibleW >= 380) {
            nextWidth = possibleW;
            nextX = start.x + dx;
          }
        }
        if (dir?.includes('n')) {
          const possibleH = start.height - dy;
          if (possibleH >= 260 && start.y + dy >= 28) {
            nextHeight = possibleH;
            nextY = start.y + dy;
          }
        }

        updateWindowSize(win.id, { width: nextWidth, height: nextHeight });
        if (nextX !== start.x || nextY !== start.y) {
          updateWindowPosition(win.id, { x: nextX, y: nextY });
        }
      };

      const onMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [win.id, win.isMaximized, win.position, win.size, focusWindow, updateWindowPosition, updateWindowSize]
  );

  if (win.isMinimized) {
    return null; // Minimized windows reside in the dock
  }

  return (
    <div
      ref={frameRef}
      onMouseDown={() => focusWindow(win.id)}
      style={{
        position: 'absolute',
        transform: `translate3d(${win.position.x}px, ${win.position.y}px, 0)`,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
        transition: isDraggingRef.current || isResizingRef.current ? 'none' : 'box-shadow 0.2s ease',
      }}
      className={`flex flex-col rounded-xl overflow-hidden select-none border ${
        isFocused
          ? 'mac-window-shadow border-white/20'
          : 'mac-window-shadow-inactive border-white/10 opacity-95'
      } bg-[#1e1e24]/90 backdrop-blur-2xl text-white`}
    >
      {/* Window Header / Title Bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
        className="h-10 px-3 flex items-center justify-between border-b border-white/[0.08] bg-[#2a2a32]/80 backdrop-blur-xl relative cursor-default select-none shrink-0"
      >
        {/* Traffic Lights */}
        <WindowTrafficLights
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximizeWindow(win.id)}
          isMaximized={win.isMaximized}
        />

        {/* Centered Window Title */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-xs font-semibold tracking-wide truncate max-w-[50%] ${
              isFocused ? 'text-zinc-200' : 'text-zinc-400'
            }`}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            {win.title}
          </span>
        </div>

        {/* Right placeholder to balance traffic lights */}
        <div className="w-14" />
      </div>

      {/* Window Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>

      {/* Resize handles (8 directions) */}
      {!win.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
            className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
            className="absolute top-2 bottom-2 left-0 w-1.5 cursor-ew-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            className="absolute top-2 bottom-2 right-0 w-1.5 cursor-ew-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
};
