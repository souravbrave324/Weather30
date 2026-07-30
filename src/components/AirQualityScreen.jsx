import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, Activity, ShieldCheck, Map, ArrowRight } from 'lucide-react';

export default function AirQualityScreen({ weather, onNavigate }) {
  const aqi = weather.aqi || {
    value: 42,
    label: 'Good',
    colorClass: 'text-emerald-400',
    pm2_5: 8.4,
    pm10: 14.2,
    no2: 12.1,
    o3: 45.0,
  };

  const getAqiBarWidth = (val) => {
    return Math.min(Math.max((val / 200) * 100, 10), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full text-slate-100 justify-between selection:bg-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2 shrink-0">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm sm:text-base font-light">Back to Weather</span>
        </button>
        <span className="text-xs sm:text-sm text-slate-400 font-light">{weather.cityName}</span>
      </div>

      {/* Scrollable Container */}
      <div className="space-y-4 px-0.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2">
        {/* HERO AQI GAUGE CARD */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 text-center relative overflow-hidden">
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold mb-1">
            AIR QUALITY INDEX (AQI)
          </p>

          <h2 className={`text-6xl sm:text-7xl font-extralight tracking-tighter my-2 font-sans ${aqi.colorClass}`}>
            {aqi.value}
          </h2>

          <p className="text-base font-light text-slate-200">{aqi.label}</p>

          {/* AQI Progress Scale Bar */}
          <div className="w-full h-2.5 bg-white/10 rounded-full mt-5 overflow-hidden relative border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 rounded-full transition-all duration-700"
              style={{ width: `${getAqiBarWidth(aqi.value)}%` }}
            />
          </div>
        </div>

        {/* POLLUTANT BREAKDOWN GRID */}
        <div>
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold mb-2.5">
            POLLUTANT METRICS
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* PM2.5 */}
            <div className="glass-card-subtle rounded-2xl p-4">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">PM2.5</span>
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-lg font-light text-white mt-1">
                {aqi.pm2_5} <span className="text-xs text-slate-400">µg/m³</span>
              </p>
            </div>

            {/* PM10 */}
            <div className="glass-card-subtle rounded-2xl p-4">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">PM10</span>
                <Activity className="w-4 h-4 text-blue-300" />
              </div>
              <p className="text-lg font-light text-white mt-1">
                {aqi.pm10} <span className="text-xs text-slate-400">µg/m³</span>
              </p>
            </div>

            {/* NO2 */}
            <div className="glass-card-subtle rounded-2xl p-4">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">NO2</span>
                <Activity className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-lg font-light text-white mt-1">
                {aqi.no2} <span className="text-xs text-slate-400">µg/m³</span>
              </p>
            </div>

            {/* O3 */}
            <div className="glass-card-subtle rounded-2xl p-4">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">O3</span>
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
              </div>
              <p className="text-lg font-light text-white mt-1">
                {aqi.o3} <span className="text-xs text-slate-400">µg/m³</span>
              </p>
            </div>
          </div>
        </div>

        {/* HEALTH ADVICE CARD */}
        <div className="glass-panel rounded-2xl p-4.5 flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-normal text-white">Health Recommendation</p>
            <p className="text-xs sm:text-sm text-slate-300 font-extralight mt-0.5">
              {aqi.value <= 50
                ? 'Air quality is clean and ideal for outdoor activities, jogging, and ventilation.'
                : 'Sensitive groups should limit prolonged outdoor exertion.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action CTA Button */}
      <div className="pt-2 shrink-0">
        <button
          onClick={() => onNavigate('map')}
          className="w-full glass-button py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm sm:text-base font-light text-slate-100 group transition-all"
        >
          <Map className="w-4.5 h-4.5 text-emerald-400" />
          <span>Open Interactive Weather Map</span>
          <ArrowRight className="w-4.5 h-4.5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
