import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  text: string;
  type?: 'input' | 'output' | 'error' | 'ascii';
}

export const MacTerminalApp: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'Last login: Tue Oct 27 09:41:00 on ttys001', type: 'output' },
    { text: 'Type "help" or "neofetch" to see available commands.', type: 'output' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setLines((prev) => [...prev, { text: 'user@MacBook-Pro ~ %', type: 'input' }]);
      return;
    }

    const newHistory: TerminalLine[] = [
      ...lines,
      { text: `user@MacBook-Pro ~ % ${trimmed}`, type: 'input' },
    ];

    const [action, ...args] = trimmed.split(' ');

    switch (action.toLowerCase()) {
      case 'help':
        newHistory.push({
          text: `Available commands:
  neofetch    - Display system overview and Apple Silicon stats
  ls          - List directory contents
  uname -a    - Kernel release and architecture
  whoami      - Print current user
  date        - Current system timestamp
  clear       - Clear screen
  echo <text> - Print arguments to standard output`,
          type: 'output',
        });
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      case 'whoami':
        newHistory.push({ text: 'admin (User ID: 501, Staff, Wheel)', type: 'output' });
        break;

      case 'date':
        newHistory.push({ text: new Date().toString(), type: 'output' });
        break;

      case 'uname':
        newHistory.push({
          text: 'Darwin MacBook-Pro.local 27.0.0 Darwin Kernel Version 27.0.0: arm64e',
          type: 'output',
        });
        break;

      case 'ls':
        newHistory.push({
          text: 'Applications   Desktop   Documents   Downloads   Library   Movies   Music   Pictures',
          type: 'output',
        });
        break;

      case 'echo':
        newHistory.push({ text: args.join(' '), type: 'output' });
        break;

      case 'neofetch':
        newHistory.push({
          type: 'ascii',
          text: `                    c.'
                 ,xNMM.          admin@MacBook-Pro
               .OMMMMo           -----------------
               OMMM0,            OS: macOS 27 Sequoia (Liquid Glass)
     .;loddo:' loolloddol;.      Host: MacBookPro18,2
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Kernel: 27.0.0-arm64e
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.   Uptime: 4 days, 18 hours
 XMMMMMMMMMMMMMMMMMMMMMMMX.     Shell: zsh 5.9
;MMMMMMMMMMMMMMMMMMMMMMMM:      Resolution: 3456x2234 @ 120Hz
:MMMMMMMMMMMMMMMMMMMMMMMM:      DE: Aqua / Liquid Glass
.MMMMMMMMMMMMMMMMMMMMMMMMX.     WM: Quartz Compositor 27
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.   CPU: Apple M4 Ultra (24 cores)
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk  GPU: Apple M4 Ultra (60 cores)
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.  Memory: 38420MiB / 131072MiB
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.`,
        });
        break;

      default:
        newHistory.push({
          text: `zsh: command not found: ${action}. Type "help" for a list of commands.`,
          type: 'error',
        });
        break;
    }

    setLines(newHistory);
    setInputVal('');
  };

  return (
    <div
      onClick={(e) => {
        // focus input
        const input = (e.currentTarget as HTMLElement).querySelector('input');
        input?.focus();
      }}
      className="flex-1 flex flex-col h-full bg-[#121217] text-zinc-100 font-mono text-xs p-3 overflow-y-auto select-text cursor-text"
    >
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'error'
                ? 'text-red-400'
                : line.type === 'input'
                ? 'text-emerald-400 font-semibold'
                : line.type === 'ascii'
                ? 'text-cyan-400'
                : 'text-zinc-300'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Live Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputVal);
        }}
        className="flex items-center gap-2 mt-1.5"
      >
        <span className="text-emerald-400 font-semibold shrink-0">user@MacBook-Pro ~ %</span>
        <input
          type="text"
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};
