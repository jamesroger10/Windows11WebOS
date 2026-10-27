import React from 'react';
import { useSystemStore } from '../../../stores/useSystemStore';
import { 
  Laptop, 
  Volume2, 
  Sun, 
  Moon, 
  Wifi, 
  Bluetooth, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Sliders
} from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const {
    theme,
    toggleTheme,
    nightLight,
    toggleNightLight,
    volume,
    setVolume,
    brightness,
    setBrightness,
    wifiEnabled,
    toggleWifi,
    bluetoothEnabled,
    toggleBluetooth,
  } = useSystemStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1c1c22] text-zinc-200 select-none overflow-y-auto p-6">
      {/* System Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Laptop size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">DESKTOP-WIN11PRO</h2>
          <div className="text-xs text-zinc-400">Windows 11 Pro • Version 24H2 (OS Build 26100.1742)</div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Display & Brightness */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Sun size={18} className="text-amber-400" />
            <span>Display & Brightness</span>
          </div>
          <div className="text-xs text-zinc-400">Adjust the screen brightness level</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 accent-sky-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono w-8 text-right">{brightness}%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-zinc-300">Night light</span>
            <button
              onClick={toggleNightLight}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                nightLight ? 'bg-sky-500 justify-end' : 'bg-zinc-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        {/* Sound & Volume */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Volume2 size={18} className="text-sky-400" />
            <span>Sound</span>
          </div>
          <div className="text-xs text-zinc-400">Speakers (Realtek(R) Audio)</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-sky-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono w-8 text-right">{volume}%</span>
          </div>
        </div>

        {/* Personalization & Theme */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Moon size={18} className="text-purple-400" />
            <span>Personalization</span>
          </div>
          <div className="text-xs text-zinc-400">Select your Windows color mode</div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-300">Theme mode: {theme === 'dark' ? 'Dark' : 'Light'}</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 bg-white/10 hover:bg-white/15 text-xs text-white rounded transition-colors"
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Network & Connectivity */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Wifi size={18} className="text-emerald-400" />
            <span>Network & Internet</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Wi-Fi (Home_5GHz)</span>
            <button
              onClick={toggleWifi}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                wifiEnabled ? 'bg-sky-500 justify-end' : 'bg-zinc-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
            <span>Bluetooth</span>
            <button
              onClick={toggleBluetooth}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                bluetoothEnabled ? 'bg-sky-500 justify-end' : 'bg-zinc-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Device Specifications */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mt-4 text-xs">
        <h4 className="text-sm font-semibold text-white mb-3">Device specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-zinc-300">
          <div><span className="text-zinc-500">Processor:</span> 12th Gen Intel(R) Core(TM) i7-12700H 2.30 GHz</div>
          <div><span className="text-zinc-500">Installed RAM:</span> 16.0 GB (15.7 GB usable)</div>
          <div><span className="text-zinc-500">System type:</span> 64-bit operating system, x64-based processor</div>
          <div><span className="text-zinc-500">Edition:</span> Windows 11 Pro</div>
        </div>
      </div>
    </div>
  );
};
