import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Coffee, Wine, Dumbbell, Smartphone, CloudSun, ArrowRight } from 'lucide-react';

export default function AIInsightsScreen({ onNavigate, weatherData }) {
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
          <span className="text-sm font-light">AI Insights</span>
        </button>
        <MoreHorizontal className="w-5 h-5 text-slate-400 opacity-80 cursor-pointer" />
      </div>

      {/* Main Container Scrollable */}
      <div className="space-y-4 px-1 overflow-y-auto no-scrollbar pb-2">
        {/* HERO CARD: PRIMARY INSIGHT */}
        <div className="glass-panel rounded-2xl p-5 text-center relative overflow-hidden">
          {/* Subtle Ambient Light Spot behind clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold mb-1">
            PRIMARY INSIGHT
          </p>

          {/* Large Clock Display */}
          <h2 className="text-5xl font-extralight text-white tracking-tighter my-1 font-sans">
            3:00 <span className="text-xl font-light tracking-normal text-slate-300">AM</span>
          </h2>

          <p className="text-xs text-slate-300 font-extralight tracking-wide">
            You wake up on Fridays
          </p>
        </div>

        {/* INSIGHT CARDS STACK */}
        <div className="space-y-2.5">
          {/* Coffee Insight */}
          <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Coffee className="w-4 h-4 text-slate-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-light">Coffee after 4 PM</p>
              <p className="text-[11px] text-slate-400 font-extralight">+20 min to fall asleep</p>
            </div>
          </div>

          {/* Alcohol Insight */}
          <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Wine className="w-4 h-4 text-slate-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-light">Alcohol</p>
              <p className="text-[11px] text-slate-400 font-extralight">37% more night awakenings.</p>
            </div>
          </div>

          {/* Exercise Insight */}
          <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Dumbbell className="w-4 h-4 text-slate-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-light">Exercise before 7 PM</p>
              <p className="text-[11px] text-slate-400 font-extralight">+7% Deep Sleep</p>
            </div>
          </div>

          {/* Screen Time Insight */}
          <div className="glass-panel rounded-2xl p-3 flex items-center space-x-3 transition-transform hover:scale-[1.01]">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Smartphone className="w-4 h-4 text-slate-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-light">Screen time &gt; 1 hour</p>
              <p className="text-[11px] text-slate-400 font-extralight">-15% REM Sleep</p>
            </div>
          </div>

          {/* Live API Weather & Climate Insight */}
          {weatherData && (
            <div className="glass-card-subtle rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <CloudSun className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-200 font-light">
                    Climate: {weatherData.temp}°C ({weatherData.condition})
                  </p>
                  <span className="text-[9px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    LIVE API
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-extralight">
                  Target room temp: {weatherData.idealSleepTemp}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onNavigate('recommendations')}
          className="w-full glass-button py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm font-light text-slate-100 group transition-all"
        >
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          <span>Get Recommendations</span>
        </button>
      </div>
    </motion.div>
  );
}
