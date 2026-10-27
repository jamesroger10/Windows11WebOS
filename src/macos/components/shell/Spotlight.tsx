import React, { useState, useEffect, useRef } from 'react';
import { useMacSystemStore } from '../../stores/useMacSystemStore';
import { useMacWindowStore } from '../../stores/useMacWindowStore';
import { Search, Calculator, FileText, Globe, ArrowRight } from 'lucide-react';
import { MacIcon } from '../common/MacIcon';
import type { MacAppId } from '../../types/macos';

export const Spotlight: React.FC = () => {
  const { isSpotlightOpen, toggleSpotlight, closeAllFlyouts } = useMacSystemStore();
  const { openWindow } = useWindowStoreSafe();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function useWindowStoreSafe() {
    return useMacWindowStore();
  }

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  // Check if query is math
  let mathResult: string | null = null;
  if (/^[\d\s+\-*/().%^]+$/.test(query.trim()) && query.trim().length > 1) {
    try {
      // Safe arithmetic evaluator
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${query})`)();
      if (typeof res === 'number' && !isNaN(res)) {
        mathResult = String(res);
      }
    } catch {
      mathResult = null;
    }
  }

  const apps: { id: MacAppId; name: string; icon: string; category: string }[] = [
    { id: 'finder', name: 'Finder', icon: 'finder', category: 'System Application' },
    { id: 'safari', name: 'Safari', icon: 'safari', category: 'Web Browser' },
    { id: 'settings', name: 'System Settings', icon: 'settings', category: 'Preferences' },
    { id: 'notes', name: 'Notes', icon: 'notes', category: 'Productivity' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal', category: 'Developer Tools' },
  ];

  const filteredApps = query.trim()
    ? apps.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : apps.slice(0, 3);

  const handleLaunchApp = (appId: MacAppId) => {
    closeAllFlyouts();
    openWindow(appId);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAllFlyouts();
      }}
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-28 bg-black/30 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[580px] max-w-[92vw] bg-[#1e1e24]/90 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden text-white"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
      >
        {/* Search Bar Input */}
        <div className="h-14 px-4 flex items-center gap-3 border-b border-white/10">
          <Search size={22} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeAllFlyouts();
              if (e.key === 'Enter') {
                if (filteredApps.length > 0) {
                  handleLaunchApp(filteredApps[0].id);
                }
              }
            }}
            className="w-full bg-transparent border-none outline-none text-xl text-white placeholder-zinc-500 font-light"
          />
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          {/* Math calculation result if present */}
          {mathResult !== null && (
            <div className="p-3 rounded-xl bg-white/10 flex items-center justify-between border border-white/10 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                  <Calculator size={18} />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Calculation</div>
                  <div className="text-lg font-semibold text-white">{mathResult}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400">{query}</span>
            </div>
          )}

          {/* Applications Section */}
          <div className="px-2 pt-1 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Applications
          </div>
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunchApp(app.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#007aff] group transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <MacIcon name={app.icon} size={28} />
                <div>
                  <div className="text-sm font-medium text-white">{app.name}</div>
                  <div className="text-xs text-zinc-400 group-hover:text-blue-100">{app.category}</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-white" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
