import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Gauge,
  Sunrise,
  Sunset,
  Star,
  ChevronRight,
  Sparkles,
  CloudRain,
  Cloud,
  CloudSun,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { searchCities, formatTemp } from '../services/WeatherApi';

export default function WeatherDashboard({
  weather,
  unit,
  onToggleUnit,
  onSelectCity,
  onUseLocation,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      const results = await searchCities(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSelectSearchResult = (city) => {
    onSelectCity(city.latitude, city.longitude, `${city.name}, ${city.country}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      e.preventDefault();
      let cityToSelect = null;
      if (searchResults.length > 0) {
        cityToSelect = searchResults[0];
      } else {
        setIsSearching(true);
        const results = await searchCities(searchQuery);
        if (results && results.length > 0) {
          cityToSelect = results[0];
        }
        setIsSearching(false);
      }

      if (cityToSelect) {
        handleSelectSearchResult(cityToSelect);
      }
    }
  };


  const getWeatherIcon = (bgType) => {
    switch (bgType) {
      case 'clear':
        return <Sun className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 animate-spin-slow" />;
      case 'rain':
        return <CloudRain className="w-10 h-10 sm:w-12 sm:h-12 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-200" />;
      case 'thunderstorm':
        return <CloudLightning className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300" />;
      case 'fog':
        return <CloudFog className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />;
      default:
        return <CloudSun className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200" />;
    }
  };

  const getHourlyIcon = (bgType) => {
    switch (bgType) {
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-5 h-5 text-indigo-200" />;
      case 'thunderstorm':
        return <CloudLightning className="w-5 h-5 text-yellow-300" />;
      default:
        return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full text-slate-100 justify-between selection:bg-none relative overflow-hidden"
    >
      {/* Top Search Bar & Unit Toggle */}
      <div className="relative pt-1 pb-2 space-y-2 z-30 shrink-0">
        <div className="flex items-center space-x-2">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
              placeholder="Search city (e.g. Tokyo, London)..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all shadow-inner"
            />

            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </div>

          {/* Use My Location GPS Button */}
          <button
            onClick={onUseLocation}
            title="Use My GPS Location"
            className="glass-pill p-2.5 rounded-2xl text-slate-300 hover:text-white transition-all flex items-center justify-center shrink-0"
          >
            <MapPin className="w-4.5 h-4.5 text-emerald-400" />
          </button>

          {/* Unit Toggle Button (°C / °F) */}
          <button
            onClick={onToggleUnit}
            title="Toggle °C / °F"
            className="glass-pill px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white tracking-wider hover:bg-white/20 transition-all shrink-0"
          >
            °{unit}
          </button>

          {/* Favorite Star Button */}
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="glass-pill p-2.5 rounded-2xl transition-all shrink-0"
          >
            <Star
              className={`w-4.5 h-4.5 ${
                isFavorite
                  ? 'text-amber-400 fill-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            />
          </button>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 right-0 top-12 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-40 divide-y divide-white/10"
            >
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectSearchResult(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/15 transition-colors flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="font-light text-slate-100">
                    {city.name}, <span className="text-slate-400">{city.country}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {city.latitude.toFixed(1)}°, {city.longitude.toFixed(1)}°
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable Weather Details Body */}
      <div className="space-y-4 px-0.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2">
        {/* HERO CARD: CURRENT WEATHER */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-white tracking-tight flex items-center">
                {weather.cityName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-extralight mt-0.5">
                {weather.condition}
              </p>
            </div>
            {getWeatherIcon(weather.bgType)}
          </div>

          {/* Main Temperature Display */}
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-6xl sm:text-7xl font-extralight text-white tracking-tighter font-sans">
              {formatTemp(weather.temp, unit)}
            </span>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-slate-300 font-light">
                Feels like {formatTemp(weather.feelsLike, unit)}
              </p>
              {weather.daily && weather.daily[0] && (
                <p className="text-[11px] sm:text-xs text-slate-400 font-extralight mt-0.5">
                  H: {formatTemp(weather.daily[0].maxTemp, unit)} / L:{' '}
                  {formatTemp(weather.daily[0].minTemp, unit)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* HOURLY FORECAST HORIZONTAL SCROLL */}
        <div className="space-y-2">
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold pl-1">
            24-HOUR HOURLY FORECAST
          </p>
          <div className="flex space-x-2.5 overflow-x-auto no-scrollbar py-1">
            {weather.hourly &&
              weather.hourly.slice(0, 16).map((h, i) => (
                <div
                  key={i}
                  className="glass-card-subtle min-w-[70px] sm:min-w-[80px] p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-between space-y-1.5 shrink-0 transition-transform hover:scale-105"
                >
                  <span className="text-[11px] text-slate-400 font-light">{h.time}</span>
                  {getHourlyIcon(h.bgType)}
                  <span className="text-xs sm:text-sm font-light text-white">
                    {formatTemp(h.temp, unit)}
                  </span>
                  {h.pop > 0 && (
                    <span className="text-[10px] text-blue-300 font-extralight">
                      {h.pop}%
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* QUICK METRICS GRID (6 Cards) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Wind Speed */}
          <div className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                WIND
              </p>
              <p className="text-xs sm:text-sm font-light text-white">
                {weather.windSpeed} km/h
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                HUMIDITY
              </p>
              <p className="text-xs sm:text-sm font-light text-white">{weather.humidity}%</p>
            </div>
          </div>

          {/* UV Index */}
          <div className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                UV INDEX
              </p>
              <p className="text-xs sm:text-sm font-light text-white">{weather.uvIndex} / 11</p>
            </div>
          </div>

          {/* Air Quality AQI */}
          <div
            onClick={() => onNavigate('air-quality')}
            className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3 cursor-pointer hover:bg-white/15 transition-all"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                AQI INDEX
              </p>
              <p className={`text-xs sm:text-sm font-light ${weather.aqi?.colorClass}`}>
                {weather.aqi?.value} ({weather.aqi?.label.split(' ')[0]})
              </p>
            </div>
          </div>

          {/* Pressure */}
          <div className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                PRESSURE
              </p>
              <p className="text-xs sm:text-sm font-light text-white">{weather.pressure} hPa</p>
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div className="glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 border border-white/20 shrink-0">
              {weather.isDay ? (
                <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              ) : (
                <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
              )}
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                {weather.isDay ? 'SUNSET' : 'SUNRISE'}
              </p>
              <p className="text-xs sm:text-sm font-light text-white">
                {weather.isDay ? weather.sunset : weather.sunrise}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action CTA Button */}
      <div className="pt-2 shrink-0">
        <button
          onClick={() => onNavigate('forecast')}
          className="w-full glass-button py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm sm:text-base font-light text-slate-100 group transition-all"
        >
          <span>View 7-Day Forecast</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
