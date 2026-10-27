import React, { useState, useRef, useEffect } from 'react';
import { useFileSystemStore } from '../../../stores/useFileSystemStore';
import { useProcessStore } from '../../../stores/useProcessStore';

export const TerminalApp: React.FC = () => {
  const { items, getChildren } = useFileSystemStore();
  const { processes, endTask } = useProcessStore();

  const [currentFolderId, setCurrentFolderId] = useState('desktop');
  const [history, setHistory] = useState<string[]>([
    'Windows PowerShell',
    'Copyright (C) Microsoft Corporation. All rights reserved.',
    '',
    'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows',
    '',
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const currentFolder = items[currentFolderId] || items['desktop'];

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    const promptLine = `PS C:\\Users\\WindowsUser\\${currentFolder.name}> ${cmdStr}`;

    if (!raw) {
      setHistory((prev) => [...prev, promptLine]);
      return;
    }

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newOutputs: string[] = [promptLine];

    switch (cmd) {
      case 'cls':
      case 'clear':
        setHistory([]);
        return;

      case 'help':
        newOutputs.push(
          'Supported commands:',
          '  dir, ls         - List files in current directory',
          '  cd <folder>     - Change directory (cd .. to go up)',
          '  cat <file>      - View file contents',
          '  tasklist        - Show running processes and metrics',
          '  taskkill <id>   - Terminate a process by ID or Name',
          '  cls, clear      - Clear screen',
          '  ver             - Display Windows version',
          '  echo <text>     - Print text to screen'
        );
        break;

      case 'ver':
        newOutputs.push('Microsoft Windows [Version 10.0.26100.1742]');
        break;

      case 'echo':
        newOutputs.push(args.join(' '));
        break;

      case 'dir':
      case 'ls': {
        const children = getChildren(currentFolderId);
        newOutputs.push(` Directory of C:\\Users\\WindowsUser\\${currentFolder.name}`, '');
        children.forEach((item) => {
          const typeStr = item.type === 'folder' ? '<DIR>          ' : `       ${(item.sizeFormatted || '0 B').padStart(8, ' ')}`;
          newOutputs.push(`${item.modified}    ${typeStr}  ${item.name}`);
        });
        newOutputs.push(`               ${children.length} File(s) / Dir(s)`);
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '.') break;
        if (target === '..') {
          if (currentFolder.parentId) {
            setCurrentFolderId(currentFolder.parentId);
          }
        } else {
          const children = getChildren(currentFolderId);
          const match = children.find(
            (c) => c.type === 'folder' && c.name.toLowerCase() === target.toLowerCase()
          );
          if (match) {
            setCurrentFolderId(match.id);
          } else {
            newOutputs.push(`The system cannot find the path specified: '${target}'`);
          }
        }
        break;
      }

      case 'cat':
      case 'type': {
        const filename = args[0];
        if (!filename) {
          newOutputs.push('Specify a file to view.');
          break;
        }
        const children = getChildren(currentFolderId);
        const file = children.find(
          (c) => c.type === 'file' && c.name.toLowerCase() === filename.toLowerCase()
        );
        if (file) {
          newOutputs.push(file.content || `[Binary/Non-text file: ${file.name}]`);
        } else {
          newOutputs.push(`File not found: '${filename}'`);
        }
        break;
      }

      case 'tasklist': {
        newOutputs.push(
          'Image Name                     PID    Session Name        Mem Usage',
          '========================= ======== ================ ============ '
        );
        processes.forEach((p, idx) => {
          const pid = String(1000 + idx * 4).padStart(8, ' ');
          const name = p.name.padEnd(25, ' ').substring(0, 25);
          const mem = `${p.memory.toFixed(1)} MB`.padStart(12, ' ');
          newOutputs.push(`${name} ${pid} Console          ${mem}`);
        });
        break;
      }

      case 'taskkill': {
        const target = args[0];
        if (!target) {
          newOutputs.push('Usage: taskkill <id or name>');
          break;
        }
        const proc = processes.find(
          (p) => p.id === target || p.name.toLowerCase().includes(target.toLowerCase())
        );
        if (proc) {
          endTask(proc.id);
          newOutputs.push(`SUCCESS: Sent termination signal to process "${proc.name}".`);
        } else {
          newOutputs.push(`ERROR: The process "${target}" not found.`);
        }
        break;
      }

      default:
        newOutputs.push(`'${cmd}' is not recognized as an internal or external command.`);
    }

    setHistory((prev) => [...prev, ...newOutputs]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0c0c] text-zinc-100 font-mono text-[13px] p-3 overflow-y-auto select-text">
      <div className="flex flex-col gap-1">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed">{line}</div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-zinc-300 shrink-0">PS C:\Users\WindowsUser\{currentFolder.name}&gt;</span>
        <input
          type="text"
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(inputVal);
              setInputVal('');
            }
          }}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
