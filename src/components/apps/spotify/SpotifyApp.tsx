import React, { useState } from 'react';
import { WinIcon } from '../../common/WinIcon';
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  ExternalLink,
  Music,
  Radio,
  Disc3,
  ListMusic
} from 'lucide-react';

export const SpotifyApp: React.FC = () => {
  const [currentPlaylistUri, setCurrentPlaylistUri] = useState('playlist/37i9dQZF1DXcBWIGoYBM5M'); // Today's Top Hits
  const [viewMode, setViewMode] = useState<'embed' | 'web'>('embed');

  const playlists = [
    { id: 'playlist/37i9dQZF1DXcBWIGoYBM5M', name: "Today's Top Hits" },
    { id: 'playlist/37i9dQZF1DX4t95PAs1EpY', name: 'Lofi Beats' },
    { id: 'playlist/37i9dQZF1DXdLEN7aqioXM', name: 'RetroWave / Synthwave' },
    { id: 'playlist/37i9dQZF1DXbITWG1ZJKYt', name: 'Jazz in the Background' },
    { id: 'playlist/37i9dQZF1DX4sWSpwq3LiO', name: 'Peaceful Piano' },
    { id: 'playlist/37i9dQZF1DX1lVhptIYRda', name: 'Hot Hits USA' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#121212] text-zinc-200 select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090909] border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          <WinIcon name="spotify" size={22} />
          <span className="font-bold text-white tracking-wide text-sm">Spotify</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#242424] p-0.5 rounded-full text-[11px]">
            <button
              onClick={() => setViewMode('embed')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                viewMode === 'embed' ? 'bg-[#1db954] text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Player View
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                viewMode === 'web' ? 'bg-[#1db954] text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Full Web App
            </button>
          </div>

          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1db954]/20 hover:bg-[#1db954]/30 text-[#1db954] border border-[#1db954]/30 transition-colors text-[11px] font-medium"
          >
            <span>Open in new tab</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Spotify Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Spotify Sidebar Navigation */}
        <div className="w-56 shrink-0 bg-[#000000] p-3 flex flex-col gap-4 text-xs">
          {/* Main Links */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-white font-semibold transition-colors text-left">
              <Home size={18} />
              <span>Home</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white font-semibold transition-colors text-left">
              <Search size={18} />
              <span>Search</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white font-semibold transition-colors text-left">
              <Library size={18} />
              <span>Your Library</span>
            </button>
          </div>

          <div className="h-px bg-white/10 mx-1" />

          {/* Quick Actions */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-left">
              <PlusSquare size={17} className="text-zinc-300" />
              <span>Create Playlist</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-left">
              <Heart size={17} className="text-purple-400" />
              <span>Liked Songs</span>
            </button>
          </div>

          <div className="h-px bg-white/10 mx-1" />

          {/* Playlist list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-1">
            <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Playlists</div>
            {playlists.map((pl) => {
              const isSelected = currentPlaylistUri === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => {
                    setCurrentPlaylistUri(pl.id);
                    setViewMode('embed');
                  }}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-left transition-colors truncate ${
                    isSelected
                      ? 'bg-white/10 text-[#1db954] font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Disc3 size={14} className={isSelected ? 'text-[#1db954]' : 'text-zinc-500'} />
                  <span className="truncate">{pl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Spotify Player/Web App */}
        <div className="flex-1 bg-[#121212] overflow-hidden flex flex-col">
          {viewMode === 'embed' ? (
            <iframe
              src={`https://open.spotify.com/embed/${currentPlaylistUri}?utm_source=generator&theme=0`}
              title="Spotify Web Player"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="flex-1 border-none"
            />
          ) : (
            <iframe
              src="https://open.spotify.com"
              title="Spotify Full Web App"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="flex-1 border-none bg-black"
            />
          )}
        </div>
      </div>
    </div>
  );
};
