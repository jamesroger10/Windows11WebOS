import React, { useState } from 'react';
import { useMacSystemStore } from '../../stores/useMacSystemStore';
import {
  Wifi,
  Bluetooth,
  Radio,
  Moon,
  Sun,
  Volume2,
  Play,
  Pause,
  SkipForward,
  Music,
} from 'lucide-react';

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    wifiEnabled,
    bluetoothEnabled,
    airDropEnabled,
    doNotDisturb,
    brightness,
    volume,
    setWifiEnabled,
    setBluetoothEnabled,
    setAirDropEnabled,
    setDoNotDisturb,
    setBrightness,
    setVolume,
  } = useMacSystemStore();

  const [isPlaying, setIsPlaying] = useState(true);

  if (!isControlCenterOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed top-9 right-3 w-80 bg-[#1e1e24]/85 backdrop-blur-3xl rounded-2xl border border-white/15 p-3.5 text-white z-[9999] shadow-2xl select-none"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* 2x2 Top Grid: Wi-Fi, Bluetooth, AirDrop, DND */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {/* Left Column: Connectivity 3-row tile */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between h-36">
          {/* Wi-Fi */}
          <button
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className="flex items-center gap-2.5 text-left w-full hover:bg-white/5 p-1 rounded-lg transition-colors"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                wifiEnabled ? 'bg-[#007aff] text-white shadow-sm' : 'bg-white/10 text-zinc-400'
              }`}
            >
              <Wifi size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-100">Wi-Fi</div>
              <div className="text-[10px] text-zinc-400 truncate">
                {wifiEnabled ? 'Antigravity_5G' : 'Off'}
              </div>
            </div>
          </button>

          {/* Bluetooth */}
          <button
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className="flex items-center gap-2.5 text-left w-full hover:bg-white/5 p-1 rounded-lg transition-colors"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                bluetoothEnabled ? 'bg-[#007aff] text-white shadow-sm' : 'bg-white/10 text-zinc-400'
              }`}
            >
              <Bluetooth size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-100">Bluetooth</div>
              <div className="text-[10px] text-zinc-400 truncate">
                {bluetoothEnabled ? 'AirPods Pro' : 'Off'}
              </div>
            </div>
          </button>

          {/* AirDrop */}
          <button
            onClick={() => setAirDropEnabled(!airDropEnabled)}
            className="flex items-center gap-2.5 text-left w-full hover:bg-white/5 p-1 rounded-lg transition-colors"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                airDropEnabled ? 'bg-[#007aff] text-white shadow-sm' : 'bg-white/10 text-zinc-400'
              }`}
            >
              <Radio size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-100">AirDrop</div>
              <div className="text-[10px] text-zinc-400 truncate">
                {airDropEnabled ? 'Contacts Only' : 'Off'}
              </div>
            </div>
          </button>
        </div>

        {/* Right Column: Focus / Do Not Disturb */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => setDoNotDisturb(!doNotDisturb)}
            className={`flex-1 rounded-2xl p-3 flex items-center gap-2.5 border transition-all ${
              doNotDisturb
                ? 'bg-[#5856d6] border-purple-400/40 text-white shadow-md'
                : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                doNotDisturb ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              <Moon size={14} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold">Focus</div>
              <div className="text-[10px] text-zinc-400">
                {doNotDisturb ? 'Do Not Disturb' : 'Off'}
              </div>
            </div>
          </button>

          <div className="h-16 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">Stage Manager</span>
            <div className="w-9 h-5 rounded-full bg-zinc-700 relative p-0.5 cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Display Brightness Slider */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-2.5">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
          <span>Display</span>
          <span className="text-[10px] text-zinc-400">{brightness}%</span>
        </div>
        <div className="relative flex items-center">
          <Sun size={15} className="absolute left-3 text-zinc-400 pointer-events-none" />
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-7 rounded-xl appearance-none bg-white/15 outline-none cursor-pointer pl-9 pr-3 accent-[#007aff]"
          />
        </div>
      </div>

      {/* Sound Volume Slider */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-2.5">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
          <span>Sound</span>
          <span className="text-[10px] text-zinc-400">{volume}%</span>
        </div>
        <div className="relative flex items-center">
          <Volume2 size={15} className="absolute left-3 text-zinc-400 pointer-events-none" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-7 rounded-xl appearance-none bg-white/15 outline-none cursor-pointer pl-9 pr-3 accent-[#007aff]"
          />
        </div>
      </div>

      {/* Now Playing Widget */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-md">
          <Music size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white truncate">Starboy</div>
          <div className="text-[10.5px] text-zinc-400 truncate">The Weeknd ft. Daft Punk</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>
          <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <SkipForward size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
