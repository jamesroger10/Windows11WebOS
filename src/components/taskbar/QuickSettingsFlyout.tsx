import React from 'react';
import { useSystemStore } from '../../stores/useSystemStore';
import { useWindowStore } from '../../stores/useWindowStore';
import {
  Wifi,
  Bluetooth,
  Sun,
  Volume2,
  VolumeX,
  BatteryCharging,
  Settings,
  Moon,
  Plane,
  ShieldAlert
} from 'lucide-react';

export const QuickSettingsFlyout: React.FC = () => {
  const {
    isQuickSettingsOpen,
    volume,
    setVolume,
    brightness,
    setBrightness,
    wifiEnabled,
    toggleWifi,
    bluetoothEnabled,
    toggleBluetooth,
    nightLight,
    toggleNightLight,
    batteryLevel,
    isCharging,
    closeAllFlyouts,
  } = useSystemStore();

  const { openWindow } = useWindowStore();

  if (!isQuickSettingsOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-84 win-acrylic win-flyout-shadow rounded-xl p-4 text-white z-[9999] animate-win-flyout border border-white/10"
    >
      {/* Quick Action Tiles (2x3 grid) */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Wi-Fi */}
        <button
          onClick={toggleWifi}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
            wifiEnabled
              ? 'bg-sky-500 border-sky-400 text-white'
              : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
          }`}
        >
          <Wifi size={18} className="mb-1" />
          <span className="text-[11px] font-medium truncate w-full text-center">Wi-Fi</span>
        </button>

        {/* Bluetooth */}
        <button
          onClick={toggleBluetooth}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
            bluetoothEnabled
              ? 'bg-sky-500 border-sky-400 text-white'
              : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
          }`}
        >
          <Bluetooth size={18} className="mb-1" />
          <span className="text-[11px] font-medium truncate w-full text-center">Bluetooth</span>
        </button>

        {/* Night Light */}
        <button
          onClick={toggleNightLight}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
            nightLight
              ? 'bg-sky-500 border-sky-400 text-white'
              : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
          }`}
        >
          <Moon size={18} className="mb-1" />
          <span className="text-[11px] font-medium truncate w-full text-center">Night light</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-3 py-2 border-y border-white/[0.08]">
        {/* Brightness Slider */}
        <div className="flex items-center gap-3">
          <Sun size={17} className="text-zinc-400 shrink-0" />
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-1 accent-sky-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 75)}
            className="text-zinc-400 hover:text-white"
          >
            {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-sky-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Footer Info & Settings Link */}
      <div className="flex items-center justify-between pt-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <BatteryCharging size={16} className="text-emerald-400" />
          <span>{batteryLevel}% {isCharging && '• Charging'}</span>
        </div>
        <button
          onClick={() => {
            closeAllFlyouts();
            openWindow('settings');
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          title="All settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};
