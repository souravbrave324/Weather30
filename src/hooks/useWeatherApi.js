import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch real live weather data from Open-Meteo API 
 * and compute environment recommendations for sleep quality.
 */
export function useWeatherApi() {
  const [weather, setWeather] = useState({
    temp: 21,
    condition: 'Clear',
    humidity: 50,
    idealSleepTemp: '18°C - 20°C',
    tempDiff: '+0.2 °C',
    loading: false,
    error: null,
    locationName: 'Local Environment',
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather(lat, lon, name = 'Current Location') {
      try {
        setWeather((prev) => ({ ...prev, loading: true }));
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
        );
        if (!res.ok) throw new Error('Failed to fetch weather');

        const data = await res.json();
        const currentTemp = data.current?.temperature_2m ?? 21;
        const humidity = data.current?.relative_humidity_2m ?? 50;

        // Ideal room temperature for sleep is 18.3°C (65°F)
        const diff = (currentTemp - 19.5).toFixed(1);
        const tempDiffStr = diff > 0 ? `+${diff} °C` : `${diff} °C`;

        if (isMounted) {
          setWeather({
            temp: Math.round(currentTemp),
            condition: getWeatherCondition(data.current?.weather_code),
            humidity,
            idealSleepTemp: '18°C - 20°C',
            tempDiff: tempDiffStr,
            loading: false,
            error: null,
            locationName: name,
          });
        }
      } catch (err) {
        if (isMounted) {
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error: err.message,
          }));
        }
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your City');
        },
        () => {
          // Default to London fallback coordinates if location permission denied
          fetchWeather(51.5074, -0.1278, 'London');
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(51.5074, -0.1278, 'London');
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return weather;
}

function getWeatherCondition(code) {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Light Rain';
  if (code >= 80 && code <= 99) return 'Stormy';
  return 'Overcast';
}
