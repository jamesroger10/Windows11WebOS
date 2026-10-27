export interface ProcessItem {
  id: string; // PID or unique identifier
  name: string;
  type: 'app' | 'background';
  status: 'Running' | 'Suspended' | 'Efficiency Mode';
  cpu: number; // percentage
  memory: number; // in MB
  disk: number; // in MB/s
  network: number; // in Mbps
  icon?: string;
  windowId?: string; // Links process to an active window if applicable
  startTime: number;
}

export interface MetricSnapshot {
  timestamp: number;
  cpuTotal: number;
  memoryTotal: number; // percentage of 16 GB
  diskTotal: number;
  networkTotal: number;
}
