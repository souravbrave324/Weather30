import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WeatherBackgroundCanvas from './components/WeatherBackgroundCanvas';
import PhoneFrame from './components/PhoneFrame';
import WeatherDashboard from './components/WeatherDashboard';
import ForecastScreen from './components/ForecastScreen';
import AirQualityScreen from './components/AirQualityScreen';
import WeatherMapScreen from './components/WeatherMapScreen';
import FavoritesScreen from './components/FavoritesScreen';
import { GlobeWeather } from './components/ui/cobe-globe-weather';
import BearCharacter from './components/BearCharacter';
import { fetchFullWeatherData } from './services/WeatherApi';
import { Smartphone, Monitor, Star, CloudSun, Globe } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isFullView, setIsFullView] = useState(false);
  const [unit, setUnit] = useState(() => localStorage.getItem('weather30_unit') || 'C');

  // Bear interaction state: 'idle' | 'spinning' | 'pointing'
  const [bearState, setBearState] = useState('idle');

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('weather30_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Weather data state
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active location state - starts null for auto GPS detection
  const [location, setLocation] = useState(null);

  // 1. Auto-detect user's current GPS location on initial mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setBearState('spinning');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: '', // Will reverse geocode automatically to user's real city name
          });
        },
        () => {
          // Fallback to London if GPS permission denied or unavailable
          setLocation({ lat: 51.5074, lon: -0.1278, name: 'London, United Kingdom' });
        },
        { timeout: 8000 }
      );
    } else {
      setLocation({ lat: 51.5074, lon: -0.1278, name: 'London, United Kingdom' });
    }
  }, []);

  // 2. Load weather data whenever location changes
  useEffect(() => {
    if (!location) return;
    let isMounted = true;
    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFullWeatherData(location.lat, location.lon, location.name);
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load weather data');
          setLoading(false);
        }
      }
    }
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [location]);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('weather30_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist Unit Preference
  const handleToggleUnit = () => {
    const nextUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    localStorage.setItem('weather30_unit', nextUnit);
  };

  // Manual GPS Location Refresh
  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      setBearState('spinning');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: '',
          });
        },
        () => {
          alert('GPS Location access denied or unavailable.');
        }
      );
    }
  };

  const handleSelectCity = (lat, lon, name) => {
    setBearState('spinning');
    setLocation({ lat, lon, name });
    setCurrentScreen('dashboard');
  };

  const isCurrentFavorite = favorites.some((f) => f.name === location?.name);

  const handleToggleFavorite = () => {
    if (!location) return;
    if (isCurrentFavorite) {
      setFavorites(favorites.filter((f) => f.name !== location.name));
    } else {
      setFavorites([
        ...favorites,
        { name: location.name, lat: location.lat, lon: location.lon },
      ]);
    }
  };

  const handleRemoveFavorite = (cityName) => {
    setFavorites(favorites.filter((f) => f.name !== cityName));
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080a0f] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-white/20">
      {/* Weather-Reactive Animated Canvas Background */}
      <WeatherBackgroundCanvas bgType={weather?.bgType || 'clouds'} />

      {/* Outer Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 md:p-8 flex justify-between items-center pointer-events-none select-none bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="space-y-0.5">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extralight tracking-wider text-slate-100 font-sans leading-none opacity-90">
            WEATHER30 PLATFORM
          </h1>
        </div>
        <div className="text-sm sm:text-lg md:text-xl font-light text-slate-300 opacity-80 tracking-widest">
          //
        </div>
      </header>

      {/* Outer Bottom Tagline */}
      <footer className="fixed bottom-4 left-4 sm:left-6 z-40 pointer-events-none select-none hidden sm:block">
        <span className="text-xs md:text-sm font-light text-slate-400 tracking-wider uppercase flex items-center">
          <CloudSun className="w-4 h-4 mr-2 text-emerald-400" /> #WEATHER30
        </span>
      </footer>

      {/* Floating Control Bar for View Toggle & Screen Selector */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50 flex items-center space-x-1.5 sm:space-x-2 glass-panel p-1.5 sm:p-2.5 rounded-3xl shadow-2xl backdrop-blur-2xl border border-white/25 max-w-[95vw]">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
            currentScreen === 'dashboard'
              ? 'bg-white text-slate-950 shadow-lg font-semibold scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/15'
          }`}
        >
          Weather
        </button>
        <button
          onClick={() => setCurrentScreen('forecast')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
            currentScreen === 'forecast'
              ? 'bg-white text-slate-950 shadow-lg font-semibold scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/15'
          }`}
        >
          7-Day
        </button>
        <button
          onClick={() => setCurrentScreen('air-quality')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
            currentScreen === 'air-quality'
              ? 'bg-white text-slate-950 shadow-lg font-semibold scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/15'
          }`}
        >
          AQI
        </button>
        <button
          onClick={() => setCurrentScreen('map')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
            currentScreen === 'map'
              ? 'bg-white text-slate-950 shadow-lg font-semibold scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/15'
          }`}
        >
          Radar
        </button>
        <button
          onClick={() => setCurrentScreen('favorites')}
          className={`p-2 sm:p-2.5 rounded-2xl transition-all ${
            currentScreen === 'favorites'
              ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/15'
          }`}
        >
          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </button>

        <div className="w-[1px] h-6 sm:h-7 bg-white/30 mx-0.5 sm:mx-1" />

        <button
          onClick={() => setIsFullView(!isFullView)}
          title={isFullView ? 'Switch to Phone Showcase' : 'Switch to Full Screen Workstation'}
          className="p-2 sm:p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/15 transition-all"
        >
          {isFullView ? <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" /> : <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Main Layout - Wide Gap Between Columns */}
      <main className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-center min-h-0 overflow-y-auto lg:overflow-hidden pt-16 sm:pt-20 pb-20 lg:pb-4 px-4 sm:px-8 gap-8 lg:gap-12 xl:gap-16">
        {/* Transparent Interactive 3D Climate Globe + Bear Mascot Container */}
        <div className="flex flex-col items-center justify-between w-full max-w-[290px] sm:max-w-[320px] xl:w-[340px] lg:h-[calc(100vh-140px)] lg:max-h-[640px] p-2 bg-transparent rounded-3xl relative overflow-visible transition-all duration-300 my-auto shrink-0">
          <div className="w-full flex items-center justify-between z-10 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center">
              <Globe className="w-4 h-4 text-emerald-400 mr-2" /> Global Climate Sphere
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Bear Mascot & 3D Globe Wrapper */}
          <div className="w-full flex-1 flex items-center justify-center relative my-4 lg:my-auto">
            {/* 3D Cobe Globe */}
            <div className="w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] xl:w-[250px] xl:h-[250px] flex items-center justify-center p-1">
              <GlobeWeather
                className="w-full h-full"
                targetLat={location?.lat}
                targetLon={location?.lon}
                onSpinStart={() => setBearState('spinning')}
                onSpinComplete={() => setBearState('pointing')}
              />
            </div>

            {/* Interactive Bear Character Mascot on Right of Globe */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
              <BearCharacter state={bearState} targetCity={weather?.cityName} theme={weather?.theme} />
            </div>
          </div>

          {/* Tagline Box */}
          <div className="w-full text-center z-10 py-2 px-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/25 shadow-lg">
            <p className="text-xs font-medium text-slate-100 tracking-wide leading-snug">
              Search any city & watch the bear spin the globe to your location! 🐾
            </p>
          </div>
        </div>

        {/* Center Display: 3D Phone Showcase or Desktop Full Screen Workstation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center glass-panel p-8 rounded-3xl space-y-3 my-auto">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-slate-300 font-light">Detecting your location & loading live weather...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center glass-panel p-8 rounded-3xl space-y-3 text-center my-auto">
            <p className="text-xs text-red-400">{error}</p>
            <button
              onClick={() => setLocation({ lat: 51.5074, lon: -0.1278, name: 'London, UK' })}
              className="glass-button px-4 py-2 rounded-xl text-xs"
            >
              Reset to London
            </button>
          </div>
        ) : isFullView ? (
          /* Full Screen Desktop Workstation View */
          <div className="w-full max-w-full lg:max-w-3xl xl:max-w-4xl h-auto lg:h-[calc(100vh-130px)] lg:max-h-[780px] p-4 sm:p-6 glass-panel rounded-3xl overflow-hidden my-auto flex flex-col shadow-2xl">
            <AnimatePresence mode="wait">
              {currentScreen === 'dashboard' && (
                <WeatherDashboard
                  key="dashboard"
                  weather={weather}
                  unit={unit}
                  onToggleUnit={handleToggleUnit}
                  onSelectCity={handleSelectCity}
                  onUseLocation={handleUseLocation}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'forecast' && (
                <ForecastScreen
                  key="forecast"
                  weather={weather}
                  unit={unit}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'air-quality' && (
                <AirQualityScreen
                  key="air-quality"
                  weather={weather}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'map' && (
                <WeatherMapScreen
                  key="map"
                  weather={weather}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'favorites' && (
                <FavoritesScreen
                  key="favorites"
                  favorites={favorites}
                  onSelectFavorite={handleSelectCity}
                  onRemoveFavorite={handleRemoveFavorite}
                  onNavigate={setCurrentScreen}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* 3D Phone Frame Showcase View */
          <PhoneFrame currentCity={weather?.cityName} theme={weather?.theme}>
            <AnimatePresence mode="wait">
              {currentScreen === 'dashboard' && (
                <WeatherDashboard
                  key="dashboard"
                  weather={weather}
                  unit={unit}
                  onToggleUnit={handleToggleUnit}
                  onSelectCity={handleSelectCity}
                  onUseLocation={handleUseLocation}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'forecast' && (
                <ForecastScreen
                  key="forecast"
                  weather={weather}
                  unit={unit}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'air-quality' && (
                <AirQualityScreen
                  key="air-quality"
                  weather={weather}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'map' && (
                <WeatherMapScreen
                  key="map"
                  weather={weather}
                  onNavigate={setCurrentScreen}
                />
              )}
              {currentScreen === 'favorites' && (
                <FavoritesScreen
                  key="favorites"
                  favorites={favorites}
                  onSelectFavorite={handleSelectCity}
                  onRemoveFavorite={handleRemoveFavorite}
                  onNavigate={setCurrentScreen}
                />
              )}
            </AnimatePresence>
          </PhoneFrame>
        )}
      </main>
    </div>
  );
}
