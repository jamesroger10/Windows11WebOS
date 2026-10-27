import React, { useState } from 'react';
import { WinIcon } from '../../common/WinIcon';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Star,
  Plus,
  X,
  ExternalLink,
  Search,
  Globe,
  Share2,
  Bookmark,
  Sparkles,
  Newspaper
} from 'lucide-react';

interface EdgeTab {
  id: string;
  title: string;
  url: string;
  inputUrl: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  favicon?: string;
}

export const EdgeBrowser: React.FC = () => {
  const [tabs, setTabs] = useState<EdgeTab[]>([
    {
      id: 'tab-1',
      title: 'New Tab',
      url: 'edge://newtab',
      inputUrl: 'edge://newtab',
      history: ['edge://newtab'],
      historyIndex: 0,
      isLoading: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const createTab = (initialUrl = 'edge://newtab') => {
    const newId = `tab-${Date.now()}`;
    const newTab: EdgeTab = {
      id: newId,
      title: initialUrl === 'edge://newtab' ? 'New Tab' : 'Loading...',
      url: initialUrl,
      inputUrl: initialUrl,
      history: [initialUrl],
      historyIndex: 0,
      isLoading: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) {
      // Reset tab to newtab
      navigateTo('edge://newtab');
      return;
    }
    const filtered = tabs.filter((t) => t.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const navigateTo = (destination: string) => {
    let cleanUrl = destination.trim();
    if (!cleanUrl) return;

    if (cleanUrl === 'edge://newtab' || cleanUrl === 'about:blank') {
      updateActiveTab({
        url: 'edge://newtab',
        inputUrl: 'edge://newtab',
        title: 'New Tab',
      });
      return;
    }

    // Determine if input is a URL or a search query
    const hasProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://');
    const isDomain = !cleanUrl.includes(' ') && cleanUrl.includes('.');

    let targetUrl = '';
    let pageTitle = '';

    if (hasProtocol) {
      targetUrl = cleanUrl;
      pageTitle = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
    } else if (isDomain) {
      targetUrl = `https://${cleanUrl}`;
      pageTitle = cleanUrl.split('/')[0];
    } else {
      // Web search query via DuckDuckGo embed
      targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(cleanUrl)}`;
      pageTitle = `${cleanUrl} - Search`;
    }

    // Update history
    const newHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
    newHistory.push(targetUrl);

    updateActiveTab({
      url: targetUrl,
      inputUrl: targetUrl,
      title: pageTitle,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  };

  const updateActiveTab = (updates: Partial<EdgeTab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t))
    );
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      updateActiveTab({
        url: prevUrl,
        inputUrl: prevUrl,
        title: prevUrl === 'edge://newtab' ? 'New Tab' : prevUrl.replace(/^https?:\/\//, '').split('/')[0],
        historyIndex: newIndex,
      });
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      updateActiveTab({
        url: nextUrl,
        inputUrl: nextUrl,
        title: nextUrl === 'edge://newtab' ? 'New Tab' : nextUrl.replace(/^https?:\/\//, '').split('/')[0],
        historyIndex: newIndex,
      });
    }
  };

  const reload = () => {
    const current = activeTab.url;
    updateActiveTab({ url: 'about:blank' });
    setTimeout(() => {
      updateActiveTab({ url: current });
    }, 50);
  };

  const quickBookmarks = [
    { name: 'Wikipedia', url: 'https://en.m.wikipedia.org' },
    { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html' },
    { name: 'Archive.org', url: 'https://archive.org' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com' },
    { name: 'DevDocs', url: 'https://devdocs.io' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e24] text-zinc-200 select-none overflow-hidden">
      {/* 1. Edge Tab Strip */}
      <div className="flex items-center px-2 pt-1.5 gap-1 bg-[#18181d] border-b border-white/[0.06] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative flex items-center gap-2 max-w-[220px] min-w-[130px] h-8 px-3 rounded-t-lg text-xs cursor-default transition-all ${
                isActive
                  ? 'bg-[#25252d] text-white shadow-sm border-t border-x border-white/10'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              <Globe size={13} className="text-sky-400 shrink-0" />
              <span className="truncate flex-1 font-normal text-[11.5px]">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-opacity"
                title="Close tab (Ctrl+W)"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        <button
          onClick={() => createTab()}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="New tab (Ctrl+T)"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* 2. Navigation Bar (Back, Forward, Refresh, Address Bar) */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#25252d] border-b border-white/[0.06] text-xs">
        <button
          onClick={goBack}
          disabled={activeTab.historyIndex <= 0}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300"
          title="Back"
        >
          <ArrowLeft size={15} />
        </button>
        <button
          onClick={goForward}
          disabled={activeTab.historyIndex >= activeTab.history.length - 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300"
          title="Forward"
        >
          <ArrowRight size={15} />
        </button>
        <button
          onClick={reload}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-300"
          title="Refresh"
        >
          <RotateCw size={14} />
        </button>
        <button
          onClick={() => navigateTo('edge://newtab')}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-300"
          title="Home"
        >
          <Home size={15} />
        </button>

        {/* Omnibox / URL Input */}
        <div className="flex-1 flex items-center h-8 px-3 bg-[#19191f] border border-white/10 rounded-full hover:border-white/20 focus-within:border-sky-500 transition-colors">
          <Lock size={12} className="text-emerald-400 shrink-0 mr-2" />
          <input
            type="text"
            value={activeTab.inputUrl === 'edge://newtab' ? '' : activeTab.inputUrl}
            placeholder="Search the web or enter URL"
            onChange={(e) => updateActiveTab({ inputUrl: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateTo(activeTab.inputUrl);
              }
            }}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 font-normal"
          />
          {activeTab.url !== 'edge://newtab' && (
            <a
              href={activeTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="Open in external browser window"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button className="p-1 text-zinc-400 hover:text-amber-400 transition-colors" title="Bookmark this tab">
            <Star size={13} />
          </button>
        </div>

        {/* Edge Copilot button */}
        <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-400/30 text-sky-300 hover:text-white transition-colors text-xs">
          <Sparkles size={13} />
          <span className="hidden md:inline font-medium text-[11px]">Copilot</span>
        </button>
      </div>

      {/* 3. Bookmarks Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1 bg-[#202026] border-b border-white/[0.04] text-[11px] overflow-x-auto no-scrollbar">
        {quickBookmarks.map((bm, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo(bm.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            <Globe size={11} className="text-sky-400" />
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Browser Content View */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#111115]">
        {activeTab.url === 'edge://newtab' ? (
          /* Microsoft Edge New Tab Page (MSN/Bing Style) */
          <div className="w-full h-full overflow-y-auto flex flex-col items-center p-6 text-center select-text">
            {/* Edge / Bing Logo */}
            <div className="mt-8 mb-6 flex items-center justify-center gap-3">
              <WinIcon name="edge" size={48} />
              <span className="text-2xl font-semibold text-white tracking-tight">Microsoft Edge</span>
            </div>

            {/* Bing Search Box */}
            <div className="w-full max-w-xl flex items-center h-12 px-4 bg-[#1e1e24] border border-white/15 rounded-full shadow-2xl focus-within:border-sky-500 transition-all mb-8">
              <Search size={18} className="text-sky-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search the web with Microsoft Bing"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigateTo((e.target as HTMLInputElement).value);
                  }
                }}
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-zinc-400"
              />
            </div>

            {/* Quick Tiles Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 max-w-2xl w-full mb-10 select-none">
              {[
                { name: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon: 'globe' },
                { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html', icon: 'globe' },
                { name: 'Archive.org', url: 'https://archive.org', icon: 'globe' },
                { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'globe' },
                { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: 'globe' },
                { name: 'DevDocs', url: 'https://devdocs.io', icon: 'globe' },
              ].map((tile, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo(tile.url)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.02] border border-white/[0.06] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-110 transition-transform">
                    <Globe size={20} />
                  </div>
                  <span className="text-xs text-zinc-300 group-hover:text-white truncate max-w-full">
                    {tile.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Daily News Feed (MSN Style) */}
            <div className="max-w-4xl w-full text-left">
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <Newspaper size={16} className="text-sky-400" />
                <span>Microsoft Start • Top Stories</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Windows 11 Introduces Fluent 2 Design & Advanced WebOS Capabilities',
                    source: 'TechRadar • 2h ago',
                    category: 'Technology',
                    actionUrl: 'https://en.m.wikipedia.org/wiki/Windows_11',
                  },
                  {
                    title: 'Space Exploration: James Webb Space Telescope Reveals Ancient Galaxy Formations',
                    source: 'ScienceDaily • 4h ago',
                    category: 'Science',
                    actionUrl: 'https://en.m.wikipedia.org/wiki/James_Webb_Space_Telescope',
                  },
                  {
                    title: 'Global Tech Index Reaches New Highs Driven By Quantum & AI Breakthroughs',
                    source: 'Reuters • 1h ago',
                    category: 'Finance',
                    actionUrl: 'https://en.m.wikipedia.org/wiki/Artificial_intelligence',
                  },
                ].map((news, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigateTo(news.actionUrl)}
                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">{news.category}</span>
                      <h4 className="text-sm font-medium text-white mt-1 leading-snug line-clamp-3">{news.title}</h4>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-3">{news.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Web Browsing Iframe */
          <div className="w-full h-full flex flex-col">
            {/* Info notice bar */}
            <div className="px-3 py-1 bg-[#18181f] border-b border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 truncate">
                <Globe size={12} className="text-sky-400 shrink-0" />
                <span className="truncate">Browsing: {activeTab.url}</span>
              </div>
              <a
                href={activeTab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 shrink-0 ml-2"
              >
                <span>Open in external tab</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Iframe View */}
            <iframe
              src={activeTab.url}
              title={activeTab.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="fullscreen; autoplay; clipboard-write; encrypted-media"
              className="w-full flex-1 border-none bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};
