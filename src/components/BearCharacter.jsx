import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BearCharacter({ state = 'idle', targetCity = '', theme }) {
  // state: 'idle' | 'spinning' | 'pointing'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const badgeClass = theme?.badgeBg || 'bg-white/10 border-white/20 text-white';

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const mainCtx = canvas.getContext('2d', { alpha: true });
    
    // Offscreen Canvas Buffer
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 140;
    offCanvas.height = 140;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    canvas.width = 140;
    canvas.height = 140;

    let animId;

    const processFrame = () => {
      if (video && !video.paused && !video.ended && !video.seeking && video.readyState >= 2) {
        offCtx.drawImage(video, 0, 0, 140, 140);
        const frame = offCtx.getImageData(0, 0, 140, 140);
        const data = frame.data;
        const len = data.length;

        let validBearPixelCount = 0;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Key out white background
          if (r > 220 && g > 220 && b > 220) {
            data[i + 3] = 0;
          } else {
            validBearPixelCount++;
            if (r > 190 && g > 190 && b > 190) {
              const brightness = (r + g + b) / 3;
              const alpha = Math.max(0, Math.min(255, (255 - brightness) * 4.5));
              data[i + 3] = Math.floor(alpha);
            }
          }
        }

        if (validBearPixelCount > 60) {
          offCtx.putImageData(frame, 0, 0);
          mainCtx.clearRect(0, 0, 140, 140);
          mainCtx.drawImage(offCanvas, 0, 0);
        }
      } else if (video && video.paused) {
        video.play().catch(() => {});
      }

      animId = requestAnimationFrame(processFrame);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(processFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none z-20">
      {/* Speech Bubble - Constrained Width to Prevent Overlap */}
      <div className={`mb-1.5 glass-pill px-3 py-1.5 rounded-2xl border shadow-2xl text-center backdrop-blur-md transition-all duration-300 max-w-[190px] sm:max-w-[210px] ${badgeClass}`}>
        <p className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight">
          {state === 'spinning' && `Spinning globe to ${targetCity || 'location'}! 🐾`}
          {state === 'pointing' && `Found ${targetCity || 'location'}! 📍`}
          {state === 'idle' && `Search a city to spin! 🐻`}
        </p>
      </div>

      {/* Hidden Video Source */}
      <video
        ref={videoRef}
        src="/bear-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Responsive Glitch-Free Bear Canvas */}
      <motion.div
        animate={
          state === 'spinning'
            ? {
                rotate: [0, -12, 4, -12, 0],
                scale: [1, 1.06, 1],
                x: [0, -4, 0],
              }
            : state === 'pointing'
            ? { x: [0, -3, 0], scale: 1.02 }
            : { y: [0, -3, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: state === 'spinning' ? 0.45 : 2,
          ease: 'easeInOut',
        }}
        className="w-24 h-24 sm:w-28 sm:h-28 xl:w-32 xl:h-32 relative flex items-center justify-center bg-transparent border-0 shadow-none overflow-visible transform-gpu"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transform-gpu"
        />
      </motion.div>
    </div>
  );
}
