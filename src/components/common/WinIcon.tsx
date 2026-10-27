import React from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music as MusicIcon, 
  Download, 
  Monitor, 
  HardDrive, 
  Activity, 
  Settings, 
  Calculator, 
  Terminal, 
  FileCode, 
  FileArchive, 
  FileSpreadsheet, 
  File, 
  Cpu
} from 'lucide-react';

interface WinIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WinIcon: React.FC<WinIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconSize = size ? { width: size, height: size } : {};

  switch (name) {
    case 'windows':
    case 'start':
      return (
        <svg viewBox="0 0 88 88" className={className} style={iconSize} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12.48L35.66 7.62V41.65H0V12.48Z" fill="#00ADEF" />
          <path d="M40.52 6.96L87.82 0V41.65H40.52V6.96Z" fill="#0078D7" />
          <path d="M0 46.35H35.66V80.38L0 75.52V46.35Z" fill="#00ADEF" />
          <path d="M40.52 46.35H87.82V88L40.52 81.04V46.35Z" fill="#0078D7" />
        </svg>
      );

    case 'explorer':
    case 'folder':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={iconSize}>
          <Folder className="w-full h-full text-amber-400 fill-amber-400 drop-shadow-sm" />
        </div>
      );

    case 'taskmgr':
    case 'activity':
      return (
        <div className={`relative flex items-center justify-center p-0.5 rounded bg-emerald-700/80 ${className}`} style={iconSize}>
          <Activity className="w-full h-full text-emerald-300 drop-shadow-sm" />
        </div>
      );

    case 'notepad':
    case 'file-text':
      return (
        <div className={`relative flex items-center justify-center p-0.5 rounded bg-sky-600/80 ${className}`} style={iconSize}>
          <FileText className="w-full h-full text-white drop-shadow-sm" />
        </div>
      );

    case 'settings':
      return <Settings className={`text-slate-300 ${className}`} style={iconSize} />;

    case 'calc':
    case 'calculator':
      return (
        <div className={`relative flex items-center justify-center p-0.5 rounded bg-blue-600/80 ${className}`} style={iconSize}>
          <Calculator className="w-full h-full text-white" />
        </div>
      );

    case 'terminal':
      return (
        <div className={`relative flex items-center justify-center p-0.5 rounded bg-zinc-900 border border-zinc-700 ${className}`} style={iconSize}>
          <Terminal className="w-full h-full text-emerald-400" />
        </div>
      );

    case 'desktop':
    case 'monitor':
      return <Monitor className={`text-sky-400 ${className}`} style={iconSize} />;

    case 'documents':
      return <Folder className={`text-amber-400 fill-amber-400/80 ${className}`} style={iconSize} />;

    case 'downloads':
    case 'download':
      return <Download className={`text-blue-400 ${className}`} style={iconSize} />;

    case 'pictures':
    case 'image':
      return <ImageIcon className={`text-purple-400 ${className}`} style={iconSize} />;

    case 'music':
      return <MusicIcon className={`text-pink-400 ${className}`} style={iconSize} />;

    case 'hard-drive':
    case 'drive-c':
      return <HardDrive className={`text-slate-300 ${className}`} style={iconSize} />;

    case 'txt':
    case 'md':
      return <FileText className={`text-blue-300 ${className}`} style={iconSize} />;

    case 'xlsx':
      return <FileSpreadsheet className={`text-emerald-400 ${className}`} style={iconSize} />;

    case 'docx':
      return <FileText className={`text-blue-500 ${className}`} style={iconSize} />;

    case 'zip':
      return <FileArchive className={`text-amber-300 ${className}`} style={iconSize} />;

    case 'edge':
      return (
        <svg viewBox="0 0 48 48" className={className} style={iconSize} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#0078D7" />
          <path d="M24 6C14.06 6 6 14.06 6 24C6 33.94 14.06 42 24 42C32.15 42 39.02 36.59 41.22 29.21C38.86 31.96 35.29 33.72 31.3 33.72C24.49 33.72 18.96 28.19 18.96 21.38C18.96 16.29 22.05 11.91 26.47 10C25.66 9.87 24.84 9.8 24 9.8C18.97 9.8 14.65 12.44 12.24 16.42C14.28 12.29 18.66 9.4 23.68 9.4C30.86 9.4 36.68 15.22 36.68 22.4C36.68 22.84 36.65 23.27 36.6 23.69C39.42 21.01 41.14 17.21 41.14 13C41.14 9.13 37.95 6 34.08 6H24Z" fill="#50E6FF" />
          <path d="M41.22 29.21C38.86 31.96 35.29 33.72 31.3 33.72C24.49 33.72 18.96 28.19 18.96 21.38C18.96 16.29 22.05 11.91 26.47 10C35.23 10.6 42 17.8 42 26.5C42 27.42 41.91 28.33 41.74 29.21H41.22Z" fill="#13C2C2" />
        </svg>
      );

    case 'spotify':
      return (
        <svg viewBox="0 0 48 48" className={className} style={iconSize} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#1DB954" />
          <path d="M33.2 30.8C32.8 31.4 32.1 31.6 31.5 31.2C26.1 27.9 19.3 27.1 11.3 29C10.6 29.2 10 28.7 9.8 28.1C9.6 27.4 10.1 26.8 10.7 26.6C19.5 24.6 27.1 25.5 33.1 29.2C33.6 29.5 33.8 30.2 33.4 30.8M36.1 25C35.6 25.8 34.6 26.1 33.8 25.6C27.7 21.8 18.3 20.7 11 22.9C10.1 23.2 9.2 22.7 8.9 21.8C8.6 20.9 9.1 20 10 19.7C18.4 17.2 28.8 18.4 35.8 22.7C36.5 23.2 36.8 24.2 36.3 25M36.4 19C29.1 14.7 16.9 14.3 9.9 16.4C8.7 16.8 7.5 16.1 7.2 15C6.8 13.8 7.5 12.6 8.7 12.2C16.8 9.7 30.3 10.2 38.6 15.2C39.7 15.8 40 17.2 39.4 18.3C38.8 19.3 37.4 19.6 36.4 19Z" fill="white" />
        </svg>
      );

    default:
      return <File className={`text-slate-400 ${className}`} style={iconSize} />;
  }
};
