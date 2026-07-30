import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Cloud,
  CloudSun,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { formatTemp } from '../services/WeatherApi';

export default function ForecastScreen({ weather, unit, onNavigate }) {
  const getDayIcon = (bgType) => {
    switch (bgType) {
      case 'clear':
        return <Sun className="w-6 h-6 text-amber-300" />;
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-6 h-6 text-indigo-200" />;
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 text-yellow-300" />;
      default:
        return <CloudSun className="w-6 h-6 text-slate-300" />;
    }
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

      {/* Main 7-Day List Scrollable */}
      <div className="space-y-3.5 px-0.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2">
        <div>
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold mb-2.5">
            7-DAY WEATHER FORECAST
          </p>

          <div className="space-y-2.5">
            {weather.daily &&
              weather.daily.map((day, idx) => (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl p-3.5 sm:p-4 flex items-center justify-between transition-transform hover:scale-[1.01]"
                >
                  {/* Day Name & Date */}
                  <div className="w-24">
                    <p className="text-sm sm:text-base font-normal text-white">{day.day}</p>
                    <p className="text-xs text-slate-400 font-extralight">{day.date}</p>
                  </div>

                  {/* Icon & Condition */}
                  <div className="flex items-center space-x-2.5 flex-1 justify-center">
                    {getDayIcon(day.bgType)}
                    <span className="text-xs sm:text-sm font-light text-slate-200 hidden sm:inline">
                      {day.condition}
                    </span>
                  </div>

                  {/* Rain Pop */}
                  <div className="w-16 text-center">
                    {day.pop > 0 ? (
                      <span className="text-xs text-blue-300 flex items-center justify-center font-extralight">
                        <Droplets className="w-3.5 h-3.5 mr-0.5" />
                        {day.pop}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">-</span>
                    )}
                  </div>

                  {/* Min / Max Temp Bar */}
                  <div className="w-28 text-right">
                    <span className="text-sm sm:text-base font-light text-white">
                      {formatTemp(day.maxTemp, unit)}
                    </span>
                    <span className="text-xs sm:text-sm font-extralight text-slate-400 ml-2">
                      {formatTemp(day.minTemp, unit)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-2 shrink-0">
        <button
          onClick={() => onNavigate('air-quality')}
          className="w-full glass-button py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm sm:text-base font-light text-slate-100 group transition-all"
        >
          <span>Check Air Quality Index</span>
          <ArrowRight className="w-4.5 h-4.5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
