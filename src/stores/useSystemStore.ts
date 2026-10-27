import { create } from 'zustand';

interface SystemState {
  currentTime: Date;
  isStartMenuOpen: boolean;
  isQuickSettingsOpen: boolean;
  isCalendarOpen: boolean;
  isSearchOpen: boolean;
  volume: number;
  brightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  batteryLevel: number;
  isCharging: boolean;
  theme: 'dark' | 'light';
  nightLight: boolean;

  setCurrentTime: (date: Date) => void;
  toggleStartMenu: () => void;
  setStartMenuOpen: (open: boolean) => void;
  toggleQuickSettings: () => void;
  setQuickSettingsOpen: (open: boolean) => void;
  toggleCalendar: () => void;
  setCalendarOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  closeAllFlyouts: () => void;
  setVolume: (val: number) => void;
  setBrightness: (val: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleTheme: () => void;
  toggleNightLight: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  currentTime: new Date(),
  isStartMenuOpen: false,
  isQuickSettingsOpen: false,
  isCalendarOpen: false,
  isSearchOpen: false,
  volume: 75,
  brightness: 100,
  wifiEnabled: true,
  bluetoothEnabled: true,
  batteryLevel: 94,
  isCharging: true,
  theme: 'dark',
  nightLight: false,

  setCurrentTime: (date: Date) => set({ currentTime: date }),

  toggleStartMenu: () =>
    set((state) => ({
      isStartMenuOpen: !state.isStartMenuOpen,
      isQuickSettingsOpen: false,
      isCalendarOpen: false,
      isSearchOpen: false,
    })),

  setStartMenuOpen: (open: boolean) =>
    set({
      isStartMenuOpen: open,
      ...(open ? { isQuickSettingsOpen: false, isCalendarOpen: false, isSearchOpen: false } : {}),
    }),

  toggleQuickSettings: () =>
    set((state) => ({
      isQuickSettingsOpen: !state.isQuickSettingsOpen,
      isStartMenuOpen: false,
      isCalendarOpen: false,
      isSearchOpen: false,
    })),

  setQuickSettingsOpen: (open: boolean) =>
    set({
      isQuickSettingsOpen: open,
      ...(open ? { isStartMenuOpen: false, isCalendarOpen: false, isSearchOpen: false } : {}),
    }),

  toggleCalendar: () =>
    set((state) => ({
      isCalendarOpen: !state.isCalendarOpen,
      isStartMenuOpen: false,
      isQuickSettingsOpen: false,
      isSearchOpen: false,
    })),

  setCalendarOpen: (open: boolean) =>
    set({
      isCalendarOpen: open,
      ...(open ? { isStartMenuOpen: false, isQuickSettingsOpen: false, isSearchOpen: false } : {}),
    }),

  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      isStartMenuOpen: false,
      isQuickSettingsOpen: false,
      isCalendarOpen: false,
    })),

  setSearchOpen: (open: boolean) =>
    set({
      isSearchOpen: open,
      ...(open ? { isStartMenuOpen: false, isQuickSettingsOpen: false, isCalendarOpen: false } : {}),
    }),

  closeAllFlyouts: () =>
    set({
      isStartMenuOpen: false,
      isQuickSettingsOpen: false,
      isCalendarOpen: false,
      isSearchOpen: false,
    }),

  setVolume: (val: number) => set({ volume: val }),
  setBrightness: (val: number) => set({ brightness: val }),
  toggleWifi: () => set((s) => ({ wifiEnabled: !s.wifiEnabled })),
  toggleBluetooth: () => set((s) => ({ bluetoothEnabled: !s.bluetoothEnabled })),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  toggleNightLight: () => set((s) => ({ nightLight: !s.nightLight })),
}));
