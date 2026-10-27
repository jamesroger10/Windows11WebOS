import React, { useState, useEffect, useRef } from 'react';
import { useProcessStore } from '../../../stores/useProcessStore';
import { useWindowStore } from '../../../stores/useWindowStore';
import { WinIcon } from '../../common/WinIcon';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Rocket,
  Users,
  ListFilter,
  Search,
  Power,
  Play,
  RotateCw
} from 'lucide-react';

interface TaskManagerProps {
  windowId: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ windowId }) => {
  const {
    processes,
    selectedProcessId,
    selectProcess,
    endTask,
    tickMetrics,
    metricHistory,
    currentTotalCpu,
    currentTotalMemory,
    currentTotalDisk,
    currentTotalNetwork,
    syncWithWindows,
  } = useProcessStore();

  const { openWindow } = useWindowStore();

  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'startup' | 'history'>('processes');
  const [filterQuery, setFilterQuery] = useState('');
  const [perfMetric, setPerfMetric] = useState<'cpu' | 'memory' | 'disk' | 'network'>('cpu');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tick telemetry metrics every 1.5 seconds
  useEffect(() => {
    syncWithWindows();
    const interval = setInterval(() => {
      tickMetrics();
    }, 1500);
    return () => clearInterval(interval);
  }, [tickMetrics, syncWithWindows]);

  // Render 60 FPS Canvas graph for the Performance tab
  useEffect(() => {
    if (activeTab !== 'performance') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Draw horizontal grid lines (every 25%)
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw vertical grid lines
    const stepX = width / 10;
    for (let x = stepX; x < width; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    if (metricHistory.length < 2) return;

    // Pick metric values
    const values = metricHistory.map((m) => {
      if (perfMetric === 'cpu') return m.cpuTotal;
      if (perfMetric === 'memory') return m.memoryTotal;
      if (perfMetric === 'disk') return Math.min(100, m.diskTotal * 20);
      return Math.min(100, m.networkTotal * 30);
    });

    const primaryColor =
      perfMetric === 'cpu'
        ? '#00a4ef'
        : perfMetric === 'memory'
        ? '#7f56d9'
        : perfMetric === 'disk'
        ? '#10b981'
        : '#f59e0b';

    // Filled area under curve
    ctx.beginPath();
    ctx.moveTo(0, height);

    const pointSpacing = width / (values.length - 1);
    values.forEach((val, index) => {
      const x = index * pointSpacing;
      const y = height - (val / 100) * height;
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, primaryColor + '55');
    gradient.addColorStop(1, primaryColor + '05');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Waveform line
    ctx.beginPath();
    values.forEach((val, index) => {
      const x = index * pointSpacing;
      const y = height - (val / 100) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [metricHistory, perfMetric, activeTab]);

  // Filter processes
  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const appProcesses = filteredProcesses.filter((p) => p.type === 'app');
  const bgProcesses = filteredProcesses.filter((p) => p.type === 'background');

  const selectedProc = processes.find((p) => p.id === selectedProcessId);

  // Heatmap helper for CPU/Memory table cells
  const getHeatmapBg = (percent: number) => {
    if (percent > 60) return 'bg-amber-600/35 text-amber-200';
    if (percent > 30) return 'bg-amber-500/20 text-amber-300';
    if (percent > 10) return 'bg-sky-500/15 text-sky-200';
    return '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e24] text-zinc-200 select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#25252d] border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          {/* Action: Run New Task */}
          <button
            onClick={() => openWindow('terminal')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Play size={13} className="text-emerald-400" />
            <span>Run new task</span>
          </button>

          {/* Action: End Task (Main Requirement!) */}
          <button
            onClick={() => endTask()}
            disabled={!selectedProcessId}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-all ${
              selectedProcessId
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-white border border-red-500/40'
                : 'opacity-40 text-zinc-500 hover:bg-transparent'
            }`}
          >
            <Power size={13} />
            <span>End task</span>
          </button>
        </div>

        {/* Search filter input */}
        <div className="w-60 flex items-center h-7 px-2.5 bg-[#1b1b22] border border-white/[0.08] rounded hover:border-white/20 focus-within:border-sky-500 transition-colors">
          <Search size={13} className="text-zinc-400 shrink-0 mr-1.5" />
          <input
            type="text"
            placeholder="Type a name, publisher, or PID"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[12px] text-white placeholder-zinc-500"
          />
        </div>
      </div>

      {/* 2. Main Body with Navigation Rail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Rail */}
        <div className="w-14 sm:w-44 shrink-0 bg-[#1a1a20]/90 border-r border-white/[0.06] py-2 flex flex-col gap-1 text-xs">
          {[
            { id: 'processes', name: 'Processes', icon: Activity },
            { id: 'performance', name: 'Performance', icon: Cpu },
            { id: 'startup', name: 'Startup apps', icon: Rocket },
            { id: 'history', name: 'App history', icon: Clock },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-r-md text-left transition-all relative ${
                  isActive
                    ? 'bg-white/10 text-white font-medium before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-sky-500 before:rounded-r'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-sky-400' : 'text-zinc-400'} />
                <span className="hidden sm:inline truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto bg-[#19191e]">
          {/* TAB 1: PROCESSES */}
          {activeTab === 'processes' && (
            <div className="w-full text-xs">
              {/* Table Column Headers */}
              <div className="sticky top-0 bg-[#22222a] z-10 grid grid-cols-12 px-3 py-2 text-zinc-400 border-b border-white/[0.08] font-medium text-[11px]">
                <div className="col-span-5 flex items-center gap-1">
                  <span>Name</span>
                  <span className="text-[10px] text-zinc-500">({processes.length})</span>
                </div>
                <div className="col-span-2 text-zinc-400">Status</div>
                <div className="col-span-1 text-right pr-2">
                  <div className="font-semibold text-white">{currentTotalCpu}%</div>
                  <div className="text-[10px] text-zinc-400">CPU</div>
                </div>
                <div className="col-span-2 text-right pr-2">
                  <div className="font-semibold text-white">{currentTotalMemory}%</div>
                  <div className="text-[10px] text-zinc-400">Memory</div>
                </div>
                <div className="col-span-1 text-right pr-2">
                  <div className="font-semibold text-white">{currentTotalDisk} MB/s</div>
                  <div className="text-[10px] text-zinc-400">Disk</div>
                </div>
                <div className="col-span-1 text-right pr-1">
                  <div className="font-semibold text-white">{currentTotalNetwork} Mbps</div>
                  <div className="text-[10px] text-zinc-400">Network</div>
                </div>
              </div>

              {/* Apps Section */}
              {appProcesses.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-white/[0.02]">
                    Apps ({appProcesses.length})
                  </div>
                  {appProcesses.map((p) => {
                    const isSelected = selectedProcessId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => selectProcess(p.id)}
                        onDoubleClick={() => endTask(p.id)}
                        className={`grid grid-cols-12 items-center px-3 py-1.5 cursor-pointer border-b border-white/[0.02] transition-colors ${
                          isSelected
                            ? 'bg-sky-500/25 border-l-2 border-l-sky-500 text-white'
                            : 'hover:bg-white/[0.04] text-zinc-300'
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-2 truncate pr-2">
                          <WinIcon name={p.name.toLowerCase().includes('explorer') ? 'folder' : p.name.toLowerCase().includes('edge') ? 'windows' : 'activity'} size={15} />
                          <span className="truncate font-medium">{p.name}</span>
                        </div>
                        <div className="col-span-2 text-zinc-400 text-[11px]">{p.status}</div>
                        <div className={`col-span-1 text-right pr-2 py-0.5 rounded ${getHeatmapBg(p.cpu)}`}>
                          {p.cpu.toFixed(1)}%
                        </div>
                        <div className={`col-span-2 text-right pr-2 py-0.5 rounded ${getHeatmapBg(p.memory / 10)}`}>
                          {p.memory.toFixed(1)} MB
                        </div>
                        <div className="col-span-1 text-right pr-2 text-zinc-400">
                          {p.disk > 0 ? `${p.disk.toFixed(1)} MB/s` : '0 MB/s'}
                        </div>
                        <div className="col-span-1 text-right pr-1 text-zinc-400">
                          {p.network > 0 ? `${p.network.toFixed(1)} Mbps` : '0 Mbps'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Background Processes Section */}
              {bgProcesses.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-white/[0.02] mt-2">
                    Background processes ({bgProcesses.length})
                  </div>
                  {bgProcesses.map((p) => {
                    const isSelected = selectedProcessId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => selectProcess(p.id)}
                        onDoubleClick={() => endTask(p.id)}
                        className={`grid grid-cols-12 items-center px-3 py-1.5 cursor-pointer border-b border-white/[0.02] transition-colors ${
                          isSelected
                            ? 'bg-sky-500/25 border-l-2 border-l-sky-500 text-white'
                            : 'hover:bg-white/[0.04] text-zinc-300'
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-2 truncate pr-2">
                          <Cpu size={14} className="text-zinc-500 shrink-0" />
                          <span className="truncate text-zinc-300">{p.name}</span>
                        </div>
                        <div className="col-span-2 text-zinc-500 text-[11px]">{p.status}</div>
                        <div className={`col-span-1 text-right pr-2 py-0.5 rounded ${getHeatmapBg(p.cpu)}`}>
                          {p.cpu.toFixed(1)}%
                        </div>
                        <div className={`col-span-2 text-right pr-2 py-0.5 rounded ${getHeatmapBg(p.memory / 10)}`}>
                          {p.memory.toFixed(1)} MB
                        </div>
                        <div className="col-span-1 text-right pr-2 text-zinc-500">
                          {p.disk > 0 ? `${p.disk.toFixed(1)} MB/s` : '0 MB/s'}
                        </div>
                        <div className="col-span-1 text-right pr-1 text-zinc-500">
                          {p.network > 0 ? `${p.network.toFixed(1)} Mbps` : '0 Mbps'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="p-4 flex flex-col md:flex-row gap-4 h-full">
              {/* Metric Selectors */}
              <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                {[
                  { id: 'cpu', name: 'CPU', value: `${currentTotalCpu}%`, sub: '3.40 GHz', icon: Cpu, color: 'text-sky-400' },
                  { id: 'memory', name: 'Memory', value: `${(currentTotalMemory * 0.16).toFixed(1)}/16.0 GB`, sub: `${currentTotalMemory}%`, icon: Activity, color: 'text-purple-400' },
                  { id: 'disk', name: 'Disk 0 (C:)', value: `${currentTotalDisk} MB/s`, sub: 'SSD (Active 2%)', icon: HardDrive, color: 'text-emerald-400' },
                  { id: 'network', name: 'Wi-Fi', value: `${currentTotalNetwork} Mbps`, sub: 'Intel(R) Wi-Fi 6', icon: Wifi, color: 'text-amber-400' },
                ].map((item) => {
                  const isCurrent = perfMetric === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPerfMetric(item.id as any)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? 'bg-white/10 border-sky-500/50 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-zinc-300'
                      }`}
                    >
                      <Icon size={24} className={item.color} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{item.name}</div>
                        <div className="text-sm font-bold text-white">{item.value}</div>
                        <div className="text-[11px] text-zinc-400">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Rolling Chart */}
              <div className="flex-1 flex flex-col bg-[#141418] border border-white/[0.08] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                      {perfMetric === 'cpu' ? 'Processor (CPU)' : perfMetric === 'memory' ? 'Memory' : perfMetric === 'disk' ? 'Disk 0 (C:)' : 'Wi-Fi'}
                    </h3>
                    <div className="text-xs text-zinc-400">60 seconds rolling utilization</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sky-400">
                      {perfMetric === 'cpu' ? `${currentTotalCpu}%` : perfMetric === 'memory' ? `${currentTotalMemory}%` : `${currentTotalDisk} MB/s`}
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[220px] relative">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={220}
                    className="w-full h-full rounded border border-white/5"
                  />
                </div>

                {/* Hardware Spec footer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-white/[0.08] text-xs">
                  <div>
                    <div className="text-zinc-500 text-[11px]">Utilization</div>
                    <div className="font-semibold text-white">{currentTotalCpu}%</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Speed</div>
                    <div className="font-semibold text-white">3.40 GHz</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Processes</div>
                    <div className="font-semibold text-white">{processes.length}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Up time</div>
                    <div className="font-semibold text-white">0:04:32:18</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STARTUP APPS */}
          {activeTab === 'startup' && (
            <div className="p-4 text-xs">
              <div className="text-sm font-semibold text-white mb-2">Startup Apps</div>
              <div className="text-zinc-400 text-xs mb-4">Apps configured to start when you sign in</div>
              <div className="border border-white/[0.08] rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#22222a] px-3 py-2 text-zinc-400 font-medium text-[11px] border-b border-white/[0.08]">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Publisher</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Startup impact</div>
                </div>
                {[
                  { name: 'Microsoft Teams', publisher: 'Microsoft Corporation', status: 'Enabled', impact: 'High' },
                  { name: 'Spotify', publisher: 'Spotify AB', status: 'Enabled', impact: 'Medium' },
                  { name: 'OneDrive', publisher: 'Microsoft Corporation', status: 'Enabled', impact: 'Low' },
                  { name: 'Discord', publisher: 'Discord Inc.', status: 'Disabled', impact: 'None' },
                  { name: 'Terminal Daemon', publisher: 'Microsoft Corporation', status: 'Enabled', impact: 'Low' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center px-3 py-2 border-b border-white/[0.04] hover:bg-white/[0.03]">
                    <div className="col-span-5 font-medium text-white">{item.name}</div>
                    <div className="col-span-3 text-zinc-400">{item.publisher}</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${item.status === 'Enabled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700 text-zinc-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-right text-zinc-300">{item.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APP HISTORY */}
          {activeTab === 'history' && (
            <div className="p-4 text-xs">
              <div className="text-sm font-semibold text-white mb-2">App History</div>
              <div className="text-zinc-400 text-xs mb-4">Resource usage since last reboot</div>
              <div className="border border-white/[0.08] rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#22222a] px-3 py-2 text-zinc-400 font-medium text-[11px] border-b border-white/[0.08]">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-3 text-right">CPU time</div>
                  <div className="col-span-3 text-right">Network</div>
                </div>
                {[
                  { name: 'File Explorer', cpuTime: '0:14:22', net: '4.2 MB' },
                  { name: 'Microsoft Edge', cpuTime: '1:02:40', net: '184.5 MB' },
                  { name: 'Task Manager', cpuTime: '0:03:10', net: '0.1 MB' },
                  { name: 'Settings', cpuTime: '0:01:05', net: '0.0 MB' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center px-3 py-2 border-b border-white/[0.04] hover:bg-white/[0.03]">
                    <div className="col-span-6 font-medium text-white">{item.name}</div>
                    <div className="col-span-3 text-right text-zinc-300">{item.cpuTime}</div>
                    <div className="col-span-3 text-right text-zinc-300">{item.net}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Status Bar */}
      <div className="h-6 shrink-0 bg-[#18181c] border-t border-white/[0.06] px-3 flex items-center justify-between text-[11px] text-zinc-400">
        <div>Processes: {processes.length} | CPU: {currentTotalCpu}% | Commit: {currentTotalMemory}%</div>
        {selectedProc && (
          <div className="text-sky-400 truncate max-w-xs">
            Selected: {selectedProc.name}
          </div>
        )}
      </div>
    </div>
  );
};
