import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, ArrowRight, Activity, Droplets, Thermometer } from 'lucide-react';

export default function DashboardScreen({ onNavigate, skinTempDiff = '+0.2 °C' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full text-slate-100 justify-between selection:bg-none"
    >
      {/* Top Bar Date */}
      <div className="flex items-center justify-center space-x-2 pt-1 pb-3">
        <span className="text-slate-300 text-sm font-medium tracking-wide">July 9th</span>
        <Calendar className="w-3.5 h-3.5 text-slate-400 opacity-80" />
      </div>

      {/* Main Container Scrollable */}
      <div className="space-y-4 px-1 overflow-y-auto no-scrollbar pb-2">
        {/* Bedtime, Wake up, Time Asleep Summary */}
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="space-y-2">
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">BEDTIME</p>
              <p className="text-base font-light text-slate-200 tracking-tight">10:54 PM</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">WAKE UP</p>
              <p className="text-base font-light text-slate-200 tracking-tight">6:36 AM</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">TIME ASLEEP</p>
              <p className="text-base font-light text-slate-200 tracking-tight">7h 42m</p>
            </div>
          </div>

          {/* SLEEP SCORE Gauge Circle */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Ring Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 * (1 - 0.84)}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))',
                  }}
                />
              </svg>

              {/* Score Value inside Circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] tracking-widest text-slate-400 uppercase font-medium -mb-1">
                  SLEEP SCORE
                </span>
                <span className="text-4xl font-extralight text-white tracking-tighter my-0 font-sans">
                  84
                </span>
                <span className="text-[10px] text-slate-400 font-light">
                  / 100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LAST 7 DAYS Card */}
        <div className="glass-panel rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                LAST 7 DAYS
              </p>
              <p className="text-xs text-slate-300 font-light">
                +2% Sleep Quality
              </p>
            </div>
            {/* Score Pill Badge */}
            <div className="glass-pill px-3 py-1 rounded-full text-xs font-light text-white shadow-inner">
              87
            </div>
          </div>

          {/* Spline Graph Canvas / SVG */}
          <div className="relative h-14 w-full flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 50">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Curve Fill */}
              <path
                d="M 0 35 Q 20 40, 40 30 T 80 25 T 120 18 T 160 30 T 200 20 L 200 50 L 0 50 Z"
                fill="url(#areaGrad)"
              />
              {/* Curve Line */}
              <path
                d="M 0 35 Q 20 40, 40 30 T 80 25 T 120 18 T 160 30 T 200 20"
                fill="none"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Indicator Dot */}
              <circle cx="120" cy="18" r="3.5" fill="#ffffff" className="animate-ping opacity-75" />
              <circle cx="120" cy="18" r="3" fill="#ffffff" />
            </svg>

            {/* Floating indicator badge 76 */}
            <div className="absolute left-[54%] top-[-2px] -translate-x-1/2 glass-pill px-1.5 py-0.5 rounded text-[10px] font-extralight text-slate-200">
              76
            </div>
          </div>

          {/* All Statistics Link */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs text-slate-400 hover:text-white flex items-center transition-colors font-light"
            >
              All statistics <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 3 Metric Pills Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Heart Rate */}
          <div className="glass-card-subtle rounded-xl p-2.5 flex flex-col justify-between items-start space-y-1">
            <div className="flex items-center space-x-1 text-slate-400">
              <Activity className="w-3 h-3 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-light text-white tracking-tight">57 <span className="text-[10px] text-slate-400">bpm</span></p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Heart Rate</p>
            </div>
          </div>

          {/* SpO2 */}
          <div className="glass-card-subtle rounded-xl p-2.5 flex flex-col justify-between items-start space-y-1">
            <div className="flex items-center space-x-1 text-slate-400">
              <Droplets className="w-3 h-3 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-light text-white tracking-tight">98%</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">SpO2</p>
            </div>
          </div>

          {/* Skin Temp */}
          <div className="glass-card-subtle rounded-xl p-2.5 flex flex-col justify-between items-start space-y-1">
            <div className="flex items-center space-x-1 text-slate-400">
              <Thermometer className="w-3 h-3 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-light text-white tracking-tight">{skinTempDiff}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Skin temp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onNavigate('ai-insights')}
          className="w-full glass-button py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm font-light text-slate-100 group transition-all"
        >
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          <span>View AI Insights</span>
        </button>
      </div>
    </motion.div>
  );
}
