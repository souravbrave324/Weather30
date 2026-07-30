import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Globe } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function WeatherMapScreen({ weather, onNavigate }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = weather.lat || 51.5074;
    const lon = weather.lon || -0.1278;

    // Destroy existing map instance if present
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map with dark tiles
    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 9,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Custom Glass Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(12px);
        border: 1.5px solid rgba(255, 255, 255, 0.4);
        color: #ffffff;
        padding: 6px 12px;
        border-radius: 20px;
        font-family: sans-serif;
        font-size: 11px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <span style="color: #34d399;">📍</span>
        <span>${weather.cityName} (${Math.round(weather.temp)}°C)</span>
      </div>`,
      iconSize: [120, 36],
      iconAnchor: [60, 18],
    });

    L.marker([lat, lon], { icon: customIcon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [weather.lat, weather.lon, weather.cityName, weather.temp]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full text-slate-100 justify-between selection:bg-none relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2 z-20">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-slate-300 hover:text-white transition-colors glass-pill px-3 py-1.5 rounded-2xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="text-xs font-light">Back to Dashboard</span>
        </button>
        <span className="text-xs text-slate-300 font-light flex items-center">
          <Globe className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Weather Radar
        </span>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/20 my-2 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Map Floating Overlay Card */}
        <div className="absolute bottom-4 left-4 right-4 z-20 glass-panel rounded-2xl p-3 flex items-center justify-between pointer-events-auto">
          <div>
            <p className="text-xs font-semibold text-white">{weather.cityName}</p>
            <p className="text-[10px] text-slate-300 font-light">
              {weather.condition} • {Math.round(weather.temp)}°C
            </p>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {weather.lat.toFixed(2)}°, {weather.lon.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
