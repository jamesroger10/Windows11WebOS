import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onSelectOS: (os: 'windows' | 'macos') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectOS }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCard, setHoveredCard] = useState<'windows' | 'macos' | null>(null);
  const [glitchText, setGlitchText] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Matrix rain canvas effect (ambient background only)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const chars = katakana + latin;
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 200);

        if (proximity > 0.1) {
          ctx.fillStyle = `rgba(0, 255, 140, ${0.6 + proximity * 0.4})`;
          ctx.shadowBlur = 8 + proximity * 12;
          ctx.shadowColor = '#00ff8c';
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.3 + 0.15})`;
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, x, y);

        if (Math.random() > 0.97) {
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, x, y);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      ctx.shadowBlur = 0;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Periodic glitch effect on title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWindowsClick = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTimeout(() => onSelectOS('windows'), 400);
  };

  const handleMacClick = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(180, 180, 200, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTimeout(() => onSelectOS('macos'), 400);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none cursor-default z-[99999]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.35 }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* OS Selection UI — shown immediately */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-10 px-4">
        <div className="text-center mb-2 relative">
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tighter relative"
            style={{
              color: '#0ff',
              textShadow: glitchText
                ? '-3px 0 #ff003c, 3px 0 #00ff41, 0 0 20px rgba(0,255,255,0.5)'
                : '0 0 30px rgba(0,255,255,0.4), 0 0 60px rgba(0,255,255,0.15)',
              fontFamily: "'Segoe UI', system-ui, monospace",
              transition: 'text-shadow 0.05s',
            }}
          >
            {glitchText ? 'S̸E̵L̷E̶C̵T̷ ̶O̵S̷' : 'SELECT OS'}
          </h1>
          <p
            className="text-sm mt-3 tracking-[0.3em] uppercase font-mono"
            style={{
              color: '#00ff8c',
              textShadow: '0 0 10px rgba(0,255,140,0.5)',
            }}
          >
            ▸ Choose your operating system environment ◂
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Windows 11 Card */}
          <button
            onClick={handleWindowsClick}
            onMouseEnter={() => setHoveredCard('windows')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative w-72 md:w-80 rounded-2xl overflow-hidden transition-all duration-300 text-left"
            style={{
              border: hoveredCard === 'windows' ? '1px solid rgba(0,120,215,0.8)' : '1px solid rgba(255,255,255,0.1)',
              background: hoveredCard === 'windows'
                ? 'linear-gradient(135deg, rgba(0,120,215,0.2) 0%, rgba(0,78,140,0.15) 100%)'
                : 'rgba(10,10,15,0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: hoveredCard === 'windows'
                ? '0 0 40px rgba(0,120,215,0.3), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 10px 40px rgba(0,0,0,0.4)',
              transform: hoveredCard === 'windows' ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
            }}
          >
            <div
              className="h-1 w-full transition-all duration-300"
              style={{
                background: hoveredCard === 'windows'
                  ? 'linear-gradient(90deg, transparent, #0078d4, #00a4ef, #0078d4, transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(0,120,215,0.3), transparent)',
              }}
            />

            <div className="p-7">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: hoveredCard === 'windows'
                      ? 'linear-gradient(135deg, #0078d4, #00a4ef)'
                      : 'rgba(0,120,215,0.15)',
                    boxShadow: hoveredCard === 'windows' ? '0 0 25px rgba(0,120,215,0.5)' : 'none',
                  }}
                >
                  <svg viewBox="0 0 88 88" className="w-8 h-8" fill="none">
                    <path d="M0 12.48L35.66 7.62V41.65H0V12.48Z" fill={hoveredCard === 'windows' ? '#fff' : '#00ADEF'} />
                    <path d="M40.52 6.96L87.82 0V41.65H40.52V6.96Z" fill={hoveredCard === 'windows' ? '#fff' : '#0078D7'} />
                    <path d="M0 46.35H35.66V80.38L0 75.52V46.35Z" fill={hoveredCard === 'windows' ? '#fff' : '#00ADEF'} />
                    <path d="M40.52 46.35H87.82V88L40.52 81.04V46.35Z" fill={hoveredCard === 'windows' ? '#fff' : '#0078D7'} />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Windows 11</h2>
                  <p className="text-xs text-zinc-400 font-mono">Build 26100.1742 Pro</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Fluent UI', 'Mica Glass', 'Multi-Window', 'File Explorer', 'Task Manager'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors duration-200"
                    style={{
                      background: hoveredCard === 'windows' ? 'rgba(0,120,215,0.3)' : 'rgba(255,255,255,0.06)',
                      color: hoveredCard === 'windows' ? '#7dd3fc' : '#71717a',
                      border: `1px solid ${hoveredCard === 'windows' ? 'rgba(0,120,215,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px #34d399' }} />
                  <span className="text-xs font-mono text-emerald-400">READY</span>
                </div>
                <span
                  className="text-xs font-mono font-semibold tracking-wider transition-colors"
                  style={{ color: hoveredCard === 'windows' ? '#0ff' : '#555' }}
                >
                  BOOT →
                </span>
              </div>
            </div>
          </button>

          {/* macOS Card */}
          <button
            onClick={handleMacClick}
            onMouseEnter={() => setHoveredCard('macos')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative w-72 md:w-80 rounded-2xl overflow-hidden transition-all duration-300 text-left"
            style={{
              border: hoveredCard === 'macos' ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.1)',
              background: hoveredCard === 'macos'
                ? 'linear-gradient(135deg, rgba(140,140,160,0.25) 0%, rgba(70,70,85,0.2) 100%)'
                : 'rgba(10,10,15,0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: hoveredCard === 'macos'
                ? '0 0 40px rgba(255,255,255,0.25), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 10px 40px rgba(0,0,0,0.4)',
              transform: hoveredCard === 'macos' ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
            }}
          >
            <div
              className="h-1 w-full transition-all duration-300"
              style={{
                background: hoveredCard === 'macos'
                  ? 'linear-gradient(90deg, transparent, #ffffff, #c7c7cc, #ffffff, transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />

            <div className="p-7">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: hoveredCard === 'macos'
                      ? 'linear-gradient(135deg, #71717a, #a1a1aa)'
                      : 'rgba(160,160,170,0.15)',
                    boxShadow: hoveredCard === 'macos' ? '0 0 25px rgba(255,255,255,0.35)' : 'none',
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill={hoveredCard === 'macos' ? '#fff' : '#d4d4d8'}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">macOS 27</h2>
                  <p className="text-xs text-zinc-400 font-mono">Build 27.0.0 Pro (Liquid Glass)</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Liquid Glass', 'Aqua UI', 'Floating Dock', 'Multi-Tab Finder', 'Control Center', 'Mission Control'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors duration-200"
                    style={{
                      background: hoveredCard === 'macos' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                      color: hoveredCard === 'macos' ? '#ffffff' : '#a1a1aa',
                      border: `1px solid ${hoveredCard === 'macos' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px #34d399' }} />
                  <span className="text-xs font-mono text-emerald-400">READY</span>
                </div>
                <span
                  className="text-xs font-mono font-semibold tracking-wider transition-colors"
                  style={{ color: hoveredCard === 'macos' ? '#0ff' : '#555' }}
                >
                  BOOT →
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
