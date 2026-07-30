import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Trash2, MapPin, ArrowRight } from 'lucide-react';

export default function FavoritesScreen({
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  onNavigate,
}) {
  const defaultPopularCities = [
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  ];

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
        <span className="text-xs sm:text-sm text-amber-400 font-light flex items-center">
          <Star className="w-4 h-4 fill-amber-400 mr-1" /> Favorites
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="space-y-4 px-0.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2">
        {/* SAVED CITIES SECTION */}
        <div>
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold mb-2.5">
            SAVED FAVORITE CITIES
          </p>

          {favorites.length === 0 ? (
            <div className="glass-panel rounded-2xl p-5 text-center text-slate-400 text-xs sm:text-sm font-light">
              No saved cities yet. Tap the star icon on any city to bookmark it here!
            </div>
          ) : (
            <div className="space-y-2.5">
              {favorites.map((fav, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-2xl p-3.5 sm:p-4 flex items-center justify-between transition-transform hover:scale-[1.01]"
                >
                  <button
                    onClick={() => onSelectFavorite(fav.lat, fav.lon, fav.name)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm sm:text-base font-normal text-white flex items-center">
                      <MapPin className="w-4 h-4 text-emerald-400 mr-2" />
                      {fav.name}
                    </p>
                    <p className="text-xs text-slate-400 font-extralight ml-6">
                      Lat: {fav.lat.toFixed(2)}°, Lon: {fav.lon.toFixed(2)}°
                    </p>
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(fav.name)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remove favorite"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POPULAR GLOBAL CITIES QUICK SELECT */}
        <div>
          <p className="text-[11px] tracking-widest text-slate-400 uppercase font-semibold mb-2.5">
            POPULAR DESTINATIONS
          </p>
          <div className="space-y-2.5">
            {defaultPopularCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() =>
                  onSelectFavorite(city.lat, city.lon, `${city.name}, ${city.country}`)
                }
                className="w-full glass-card-subtle rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-white/15 transition-all"
              >
                <div>
                  <p className="text-xs sm:text-sm font-light text-white">{city.name}</p>
                  <p className="text-[11px] text-slate-400 font-extralight">{city.country}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="pt-2 shrink-0">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full glass-button py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm sm:text-base font-light text-slate-100 transition-all"
        >
          <span>Return to Dashboard</span>
        </button>
      </div>
    </motion.div>
  );
}
