import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Share,
  Plus,
  ShieldCheck,
  Search,
  ExternalLink,
} from 'lucide-react';

export const SafariApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://apple.com');
  const [currentUrl, setCurrentUrl] = useState('https://apple.com');

  const bookmarks = [
    { name: 'Apple', url: 'https://apple.com' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  ];

  const handleNavigate = (targetUrl: string) => {
    let formatted = targetUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setUrlInput(formatted);
    setCurrentUrl(formatted);
  };

  return (
    <div
      className="flex-1 flex flex-col h-full bg-[#1e1e24] text-white select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Top Unified Header */}
      <div className="h-11 px-3 bg-[#26262e] border-b border-white/[0.08] flex items-center justify-between gap-3 text-xs">
        {/* Navigation controls */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-white/10 text-zinc-300 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 text-zinc-300 transition-colors">
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => handleNavigate(currentUrl)}
            className="p-1.5 rounded hover:bg-white/10 text-zinc-300 transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Unified Search/URL Pill */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavigate(urlInput);
          }}
          className="flex-1 max-w-lg flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full focus-within:border-blue-500 focus-within:bg-white/15 transition-all"
        >
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-white text-center font-normal"
          />
        </form>

        {/* Share & New Tab */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-white/10 text-zinc-300 transition-colors">
            <Share size={14} />
          </button>
          <button
            onClick={() => handleNavigate('https://apple.com')}
            className="p-1.5 rounded hover:bg-white/10 text-zinc-300 transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-7 px-4 bg-[#202027] border-b border-white/[0.06] flex items-center gap-4 text-[11px] text-zinc-300">
        {bookmarks.map((bm) => (
          <button
            key={bm.name}
            onClick={() => handleNavigate(bm.url)}
            className="hover:text-white transition-colors"
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Web View Frame */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
        <iframe
          src={currentUrl}
          title="Safari Browser Frame"
          className="w-full flex-1 border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};
