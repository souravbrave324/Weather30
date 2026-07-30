import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function PhoneFrame({ children, currentCity, theme }) {
  const [timeStr, setTimeStr] = useState('09:41');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const borderGlow = theme?.borderGlow || 'border-white/20';
  const shadowGlowClass = theme?.glow || 'shadow-[0_35px_100px_rgba(0,0,0,0.85)]';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: (-y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="perspective-1000 flex items-center justify-center p-2 sm:p-4 h-full w-full my-auto overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-[360px] sm:w-[410px] md:w-[450px] h-[calc(100vh-80px)] max-h-[820px] min-h-[560px] rounded-[48px] md:rounded-[54px] bg-slate-950/95 p-3 sm:p-4 border transition-all duration-500 ease-out flex flex-col justify-between ${borderGlow} ${shadowGlowClass}`}
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >

        {/* Outer Bezel Border Glow */}
        <div className="absolute -inset-[1px] rounded-[49px] md:rounded-[55px] bg-gradient-to-b from-white/30 via-white/10 to-white/20 pointer-events-none -z-10" />

        {/* Screen Surface (Razor Sharp Dark Glass) */}
        <div className="relative w-full h-full rounded-[40px] md:rounded-[44px] bg-[#0c1018]/90 border border-white/20 flex flex-col overflow-hidden justify-between p-3.5 sm:p-4 shadow-2xl min-h-0">
          {/* Top Status Bar */}
          <div className="w-full flex items-center justify-between px-3 pt-1 pb-2 z-20 select-none shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-slate-100 tracking-tight font-mono">
              {timeStr}
            </span>

            {/* Dynamic Island Pill Notch */}
            <div className="w-20 sm:w-24 h-4 sm:h-5 bg-black/95 rounded-full border border-white/20 flex items-center justify-center space-x-2 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-white/10" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* System Icons */}
            <div className="flex items-center space-x-2 text-slate-200">
              <Signal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Battery className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* Inner Screen Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden relative pt-1 flex flex-col">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full pt-1.5 flex justify-center items-center z-20 shrink-0">
            <div className="w-32 sm:w-36 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Gloss Glare Highlight */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none rounded-r-[48px] md:rounded-r-[54px]" />
      </div>
    </div>
  );
}
