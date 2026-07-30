import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Moon, Wine, Coffee, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecommendationsScreen({ onNavigate }) {
  const [completedCount, setCompletedCount] = useState(3);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  const handleCompleteToday = () => {
    if (completedCount < 7) {
      setCompletedCount((prev) => prev + 1);
      setIsCompletedToday(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full text-slate-100 justify-between selection:bg-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-light">Recommendations</span>
        </button>
        <MoreHorizontal className="w-5 h-5 text-slate-400 opacity-80 cursor-pointer" />
      </div>

      {/* Scrollable Container */}
      <div className="space-y-4 px-1 overflow-y-auto no-scrollbar pb-2">
        {/* IMPROVE YOUR SLEEP Title */}
        <div>
          <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold mb-2">
            IMPROVE YOUR SLEEP
          </p>

          {/* Horizontal / Vertical List of Recommendation Pills */}
          <div className="space-y-2.5">
            {/* Pill 1: Bedtime */}
            <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Moon className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-white">Bedtime</p>
                <p className="text-xs text-slate-400 font-extralight">10:50 PM</p>
              </div>
            </div>

            {/* Pill 2: Alcohol */}
            <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Wine className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-white">Alcohol</p>
                <p className="text-xs text-slate-400 font-extralight">Skip alcohol tonight</p>
              </div>
            </div>

            {/* Pill 3: Caffeine */}
            <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Coffee className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-white">Caffeine</p>
                <p className="text-xs text-slate-400 font-extralight">Avoid after 3:00 PM</p>
              </div>
            </div>

            {/* Pill 4: Water */}
            <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Droplets className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-white">Water</p>
                <p className="text-xs text-slate-400 font-extralight">600ml before bed</p>
              </div>
            </div>
          </div>
        </div>

        {/* WEEKLY GOAL Card */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
              WEEKLY GOAL
            </p>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              Sleep Before 11:00 PM for 7 consecutive nights.
            </p>
          </div>

          {/* 3 / 7 Counter & Vertical Bars */}
          <div className="flex items-end justify-between pt-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extralight text-white font-sans">{completedCount}</span>
              <span className="text-xl font-extralight text-slate-400">/ 7</span>
            </div>

            {/* 7 Vertical Progress Bars */}
            <div className="flex items-end space-x-1.5 h-12 pb-1">
              {Array.from({ length: 7 }).map((_, index) => {
                const isActive = index < completedCount;
                return (
                  <div
                    key={index}
                    className={`w-2.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] h-10'
                        : 'bg-white/10 border border-white/20 h-6'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="pt-2">
        <button
          onClick={handleCompleteToday}
          className="w-full glass-button py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm font-light text-slate-100 group transition-all"
        >
          {isCompletedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed Today!</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              <span>Complete Today</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
