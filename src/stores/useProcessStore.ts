import { create } from 'zustand';
import type { MetricSnapshot, ProcessItem } from '../types/process';
import { useWindowStore } from './useWindowStore';

interface ProcessStoreState {
  processes: ProcessItem[];
  selectedProcessId: string | null;
  metricHistory: MetricSnapshot[];
  currentTotalCpu: number;
  currentTotalMemory: number;
  currentTotalDisk: number;
  currentTotalNetwork: number;

  selectProcess: (id: string | null) => void;
  endTask: (id?: string) => void;
  tickMetrics: () => void;
  syncWithWindows: () => void;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  // Apps
  {
    id: 'proc-explorer',
    name: 'File Explorer',
    type: 'app',
    status: 'Running',
    cpu: 1.8,
    memory: 142.4,
    disk: 0.2,
    network: 0.0,
    startTime: Date.now() - 3600000,
  },
  {
    id: 'proc-taskmgr',
    name: 'Task Manager',
    type: 'app',
    status: 'Running',
    cpu: 2.1,
    memory: 68.2,
    disk: 0.1,
    network: 0.0,
    startTime: Date.now() - 1200000,
  },
  {
    id: 'proc-edge',
    name: 'Microsoft Edge',
    type: 'app',
    status: 'Running',
    cpu: 3.4,
    memory: 412.0,
    disk: 0.4,
    network: 1.2,
    startTime: Date.now() - 7200000,
  },
  {
    id: 'proc-settings',
    name: 'Settings',
    type: 'app',
    status: 'Suspended',
    cpu: 0.0,
    memory: 32.1,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 1800000,
  },

  // Background processes
  {
    id: 'bg-dwm',
    name: 'Desktop Window Manager (dwm.exe)',
    type: 'background',
    status: 'Running',
    cpu: 1.2,
    memory: 184.6,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-csrss',
    name: 'Client Server Runtime Process (csrss.exe)',
    type: 'background',
    status: 'Running',
    cpu: 0.3,
    memory: 14.8,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-antimalware',
    name: 'Antimalware Service Executable',
    type: 'background',
    status: 'Running',
    cpu: 0.9,
    memory: 230.5,
    disk: 1.1,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-audio',
    name: 'Windows Audio Device Graph Isolation',
    type: 'background',
    status: 'Running',
    cpu: 0.2,
    memory: 28.3,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-search',
    name: 'SearchHost.exe',
    type: 'background',
    status: 'Running',
    cpu: 0.4,
    memory: 88.2,
    disk: 0.2,
    network: 0.1,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-runtime',
    name: 'Runtime Broker',
    type: 'background',
    status: 'Running',
    cpu: 0.1,
    memory: 38.4,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-shell',
    name: 'StartMenuExperienceHost.exe',
    type: 'background',
    status: 'Running',
    cpu: 0.2,
    memory: 48.0,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
  {
    id: 'bg-system',
    name: 'System Idle Process',
    type: 'background',
    status: 'Running',
    cpu: 89.2,
    memory: 0.1,
    disk: 0.0,
    network: 0.0,
    startTime: Date.now() - 86400000,
  },
];

// Initial 60 historical data points for the canvas chart
const generateInitialHistory = (): MetricSnapshot[] => {
  const points: MetricSnapshot[] = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    const t = now - i * 1000;
    const baseCpu = 12 + Math.sin(i * 0.2) * 5 + Math.random() * 4;
    points.push({
      timestamp: t,
      cpuTotal: Math.min(100, Math.max(2, baseCpu)),
      memoryTotal: 42 + Math.sin(i * 0.05) * 2,
      diskTotal: Math.max(0, Math.random() * 2.5),
      networkTotal: Math.max(0, Math.random() * 1.5),
    });
  }
  return points;
};

export const useProcessStore = create<ProcessStoreState>((set, get) => ({
  processes: INITIAL_PROCESSES,
  selectedProcessId: 'proc-explorer',
  metricHistory: generateInitialHistory(),
  currentTotalCpu: 14.2,
  currentTotalMemory: 43.5,
  currentTotalDisk: 1.4,
  currentTotalNetwork: 1.3,

  selectProcess: (id: string | null) => {
    set({ selectedProcessId: id });
  },

  endTask: (targetId?: string) => {
    const idToKill = targetId || get().selectedProcessId;
    if (!idToKill) return;

    const proc = get().processes.find((p) => p.id === idToKill);
    if (!proc) return;

    // Check if this process maps to an open window
    if (proc.name.includes('File Explorer')) {
      useWindowStore.getState().closeWindowsByAppId('explorer');
    } else if (proc.name.includes('Task Manager')) {
      useWindowStore.getState().closeWindowsByAppId('taskmgr');
    } else if (proc.name.includes('Notepad')) {
      useWindowStore.getState().closeWindowsByAppId('notepad');
    } else if (proc.name.includes('Calculator')) {
      useWindowStore.getState().closeWindowsByAppId('calc');
    } else if (proc.name.includes('Settings')) {
      useWindowStore.getState().closeWindowsByAppId('settings');
    } else if (proc.name.includes('Edge')) {
      useWindowStore.getState().closeWindowsByAppId('edge');
    } else if (proc.name.includes('Spotify')) {
      useWindowStore.getState().closeWindowsByAppId('spotify');
    }

    set((state) => {
      const remaining = state.processes.filter((p) => p.id !== idToKill);
      return {
        processes: remaining,
        selectedProcessId: state.selectedProcessId === idToKill ? (remaining[0]?.id ?? null) : state.selectedProcessId,
      };
    });
  },

  tickMetrics: () => {
    set((state) => {
      let activeCpuSum = 0;
      let activeMemSum = 0;

      const updatedProcs = state.processes.map((proc) => {
        if (proc.name === 'System Idle Process') return proc;

        // Random jitter
        const cpuDelta = (Math.random() - 0.48) * 0.8;
        const newCpu = Math.max(0, Math.min(100, +(proc.cpu + cpuDelta).toFixed(1)));
        
        const memDelta = (Math.random() - 0.5) * 1.2;
        const newMem = Math.max(5, +(proc.memory + memDelta).toFixed(1));

        activeCpuSum += newCpu;
        activeMemSum += newMem;

        return {
          ...proc,
          cpu: newCpu,
          memory: newMem,
          disk: +(Math.max(0, proc.disk + (Math.random() - 0.5) * 0.1)).toFixed(1),
          network: +(Math.max(0, proc.network + (Math.random() - 0.5) * 0.2)).toFixed(1),
        };
      });

      const totalCpu = Math.min(100, Math.max(3, +(activeCpuSum * 0.85).toFixed(1)));
      const totalMem = Math.min(95, Math.max(20, +((activeMemSum / 16384) * 100 + 35).toFixed(1)));
      const totalDisk = +(Math.random() * 2.8).toFixed(1);
      const totalNet = +(Math.random() * 1.5).toFixed(1);

      const newPoint: MetricSnapshot = {
        timestamp: Date.now(),
        cpuTotal: totalCpu,
        memoryTotal: totalMem,
        diskTotal: totalDisk,
        networkTotal: totalNet,
      };

      const updatedHistory = [...state.metricHistory.slice(1), newPoint];

      return {
        processes: updatedProcs,
        metricHistory: updatedHistory,
        currentTotalCpu: totalCpu,
        currentTotalMemory: totalMem,
        currentTotalDisk: totalDisk,
        currentTotalNetwork: totalNet,
      };
    });
  },

  syncWithWindows: () => {
    const openWindows = useWindowStore.getState().windows;
    set((state) => {
      // Ensure processes exist for open apps
      const procs = [...state.processes];
      
      openWindows.forEach((win) => {
        const procName = win.title.split(' - ')[0];
        const existing = procs.find((p) => p.name === procName || p.id === `proc-${win.id}`);
        if (!existing) {
          procs.unshift({
            id: `proc-${win.id}`,
            name: win.title,
            type: 'app',
            status: 'Running',
            cpu: +(Math.random() * 2 + 0.5).toFixed(1),
            memory: +(Math.random() * 60 + 50).toFixed(1),
            disk: 0.1,
            network: 0.0,
            windowId: win.id,
            startTime: Date.now(),
          });
        }
      });

      return { processes: procs };
    });
  },
}));
