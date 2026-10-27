import { create } from 'zustand';

interface MacSystemState {
  isAppleMenuOpen: boolean;
  isControlCenterOpen: boolean;
  isSpotlightOpen: boolean;
  activeMenuDropdown: string | null;

  // Control Center toggles
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airDropEnabled: boolean;
  doNotDisturb: boolean;
  brightness: number; // 0 - 100
  volume: number;     // 0 - 100

  // System appearance & wallpaper
  theme: 'dark' | 'light';
  wallpaper: string;

  // Actions
  toggleAppleMenu: () => void;
  toggleControlCenter: () => void;
  toggleSpotlight: () => void;
  setActiveMenuDropdown: (name: string | null) => void;
  closeAllFlyouts: () => void;

  setWifiEnabled: (enabled: boolean) => void;
  setBluetoothEnabled: (enabled: boolean) => void;
  setAirDropEnabled: (enabled: boolean) => void;
  setDoNotDisturb: (enabled: boolean) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setWallpaper: (url: string) => void;
}

export const useMacSystemStore = create<MacSystemState>((set) => ({
  isAppleMenuOpen: false,
  isControlCenterOpen: false,
  isSpotlightOpen: false,
  activeMenuDropdown: null,

  wifiEnabled: true,
  bluetoothEnabled: true,
  airDropEnabled: true,
  doNotDisturb: false,
  brightness: 85,
  volume: 75,

  theme: 'dark',
  wallpaper: 'tahoe', // default wallpaper

  toggleAppleMenu: () =>
    set((state) => ({
      isAppleMenuOpen: !state.isAppleMenuOpen,
      isControlCenterOpen: false,
      isSpotlightOpen: false,
      activeMenuDropdown: null,
    })),

  toggleControlCenter: () =>
    set((state) => ({
      isControlCenterOpen: !state.isControlCenterOpen,
      isAppleMenuOpen: false,
      isSpotlightOpen: false,
      activeMenuDropdown: null,
    })),

  toggleSpotlight: () =>
    set((state) => ({
      isSpotlightOpen: !state.isSpotlightOpen,
      isAppleMenuOpen: false,
      isControlCenterOpen: false,
      activeMenuDropdown: null,
    })),

  setActiveMenuDropdown: (name) =>
    set({
      activeMenuDropdown: name,
      isAppleMenuOpen: false,
      isControlCenterOpen: false,
    }),

  closeAllFlyouts: () =>
    set({
      isAppleMenuOpen: false,
      isControlCenterOpen: false,
      isSpotlightOpen: false,
      activeMenuDropdown: null,
    }),

  setWifiEnabled: (wifiEnabled) => set({ wifiEnabled }),
  setBluetoothEnabled: (bluetoothEnabled) => set({ bluetoothEnabled }),
  setAirDropEnabled: (airDropEnabled) => set({ airDropEnabled }),
  setDoNotDisturb: (doNotDisturb) => set({ doNotDisturb }),
  setBrightness: (brightness) => set({ brightness }),
  setVolume: (volume) => set({ volume }),
  setTheme: (theme) => set({ theme }),
  setWallpaper: (wallpaper) => set({ wallpaper }),
}));
