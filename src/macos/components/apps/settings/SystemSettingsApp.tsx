import React, { useState } from 'react';
import { useMacSystemStore } from '../../../stores/useMacSystemStore';
import {
  Wifi,
  Bluetooth,
  Globe,
  Sun,
  Image,
  Monitor,
  Info,
  Shield,
  Search,
  Check,
  User,
  Sliders,
} from 'lucide-react';
import { MacIcon } from '../../common/MacIcon';

type SettingsCategory = 'appearance' | 'wallpaper' | 'displays' | 'about' | 'wifi' | 'bluetooth';

export const SystemSettingsApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('appearance');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    wifiEnabled,
    setWifiEnabled,
    bluetoothEnabled,
    setBluetoothEnabled,
    brightness,
    setBrightness,
  } = useMacSystemStore();

  const WALLPAPERS = [
    { id: 'tahoe', name: 'macOS Tahoe (Photo)', bg: "url('./images/macos-tahoe-26-5120x2880-22675.jpg'), linear-gradient(135deg, #1c1a27 0%, #2b1f3d 100%)" },
    { id: 'sequoia-dark', name: 'macOS Sequoia Dark', bg: 'linear-gradient(135deg, #1c1a27 0%, #2b1f3d 50%, #15162b 100%)' },
    { id: 'sonoma-horizon', name: 'Sonoma Horizon', bg: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)' },
    { id: 'ventura-abstract', name: 'Ventura Abstract', bg: 'linear-gradient(135deg, #0575E6 0%, #00F260 100%)' },
    { id: 'monterey-purple', name: 'Monterey Purple', bg: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' },
    { id: 'cyber-dark', name: 'Cyber Void', bg: 'linear-gradient(135deg, #09090e 0%, #181926 50%, #050608 100%)' },
  ];


  const ACCENT_COLORS = ['#007aff', '#ff3b30', '#ff9500', '#34c759', '#af52de', '#ff2d55', '#8e8e93'];
  const [selectedAccent, setSelectedAccent] = useState('#007aff');

  const categories = [
    { id: 'wifi', name: 'Wi-Fi', icon: Wifi, color: 'bg-blue-500' },
    { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth, color: 'bg-blue-600' },
    { id: 'appearance', name: 'Appearance', icon: Sun, color: 'bg-purple-500' },
    { id: 'wallpaper', name: 'Wallpaper', icon: Image, color: 'bg-teal-500' },
    { id: 'displays', name: 'Displays', icon: Monitor, color: 'bg-sky-500' },
    { id: 'about', name: 'About This Mac', icon: Info, color: 'bg-zinc-500' },
  ];

  return (
    <div
      className="flex-1 flex h-full bg-[#1e1e24] text-white select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Left Sidebar */}
      <div className="w-56 bg-[#18181f]/95 border-r border-white/[0.08] p-3 flex flex-col gap-3 shrink-0 overflow-y-auto text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/10 rounded-lg border border-white/10">
          <Search size={14} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500"
          />
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">Admin User</div>
            <div className="text-[10px] text-zinc-400">Apple Account</div>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as SettingsCategory)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  isSelected ? 'bg-[#007aff] text-white font-medium' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-white shrink-0 ${cat.color}`}
                >
                  <Icon size={12} />
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#1e1e24] text-xs">
        {activeCategory === 'appearance' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Appearance</h2>

            {/* Light / Dark Mode selector */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-zinc-300 block mb-3">Theme</span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'border-[#007aff] bg-white/10 ring-2 ring-[#007aff]/40'
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="w-full h-14 rounded-lg bg-zinc-200 border border-zinc-400 p-1 flex flex-col justify-between">
                    <div className="w-12 h-2 bg-blue-500 rounded" />
                    <div className="w-full h-4 bg-zinc-300 rounded" />
                  </div>
                  <span className="font-medium text-zinc-200">Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'border-[#007aff] bg-white/10 ring-2 ring-[#007aff]/40'
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="w-full h-14 rounded-lg bg-zinc-900 border border-zinc-700 p-1 flex flex-col justify-between">
                    <div className="w-12 h-2 bg-blue-500 rounded" />
                    <div className="w-full h-4 bg-zinc-800 rounded" />
                  </div>
                  <span className="font-medium text-zinc-200">Dark</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block">Accent Color</span>
                <span className="text-[11px] text-zinc-400">Controls buttons, selections, and focus</span>
              </div>
              <div className="flex items-center gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedAccent(color)}
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    {selectedAccent === color && <Check size={11} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'wallpaper' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Wallpaper</h2>
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className={`p-2 rounded-xl border flex flex-col items-start gap-2 transition-all ${
                    wallpaper === wp.id
                      ? 'border-[#007aff] bg-white/10 ring-2 ring-[#007aff]/40'
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-full h-24 rounded-lg shadow-inner"
                    style={{ background: wp.bg }}
                  />
                  <span className="text-xs font-medium text-zinc-200">{wp.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeCategory === 'displays' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Displays</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Built-in Liquid Retina XDR Display</div>
                  <div className="text-[11px] text-zinc-400">16-inch (3456 × 2234) ProMotion 120Hz</div>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-zinc-300 font-medium block mb-2">Brightness: {brightness}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/20 accent-[#007aff] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'about' && (
          <div className="max-w-xl space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg">
                <MacIcon name="apple" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">MacBook Pro</h3>
              <p className="text-xs text-zinc-400 mt-1">16-inch, 2026</p>

              <div className="w-full mt-6 space-y-2 text-left border-t border-white/10 pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">OS</span>
                  <span className="font-medium text-zinc-200">macOS 27 (Liquid Glass)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Chip</span>
                  <span className="font-medium text-zinc-200">Apple M4 Ultra (24-core CPU, 60-core GPU)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Memory</span>
                  <span className="font-medium text-zinc-200">128 GB Unified LPDDR5X</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Startup Disk</span>
                  <span className="font-medium text-zinc-200">Macintosh HD (2 TB PCIe 4.0 SSD)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Serial Number</span>
                  <span className="font-mono text-zinc-300">C02GL0W9MD6T</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'wifi' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Wi-Fi</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block">Wi-Fi</span>
                <span className="text-[11px] text-zinc-400">{wifiEnabled ? 'Connected to Antigravity_5G' : 'Off'}</span>
              </div>
              <button
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  wifiEnabled ? 'bg-[#34c759]' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    wifiEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeCategory === 'bluetooth' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Bluetooth</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block">Bluetooth</span>
                <span className="text-[11px] text-zinc-400">{bluetoothEnabled ? 'Now discoverable as "MacBook Pro"' : 'Off'}</span>
              </div>
              <button
                onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  bluetoothEnabled ? 'bg-[#34c759]' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    bluetoothEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
