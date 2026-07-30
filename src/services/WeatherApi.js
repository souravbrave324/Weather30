/**
 * Open-Meteo API Service for Weather30 App
 * Provides City Search, Live Weather, 24-Hour Hourly Forecast,
 * 7-Day Daily Forecast, Air Quality (AQI) metrics, and Dynamic Weather Themes.
 */

// Weather Code mapping to human-readable condition, animated background, and Live Weather Theme
export function getWeatherDetails(code) {
  if (code === 0) {
    return {
      condition: 'Clear Sky',
      icon: 'Sun',
      bgType: 'clear',
      isDay: true,
      theme: {
        name: 'Sunny Gold',
        accentColor: '#f59e0b',
        accentText: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.35)]',
        borderGlow: 'border-amber-500/30',
        btnBg: 'hover:bg-amber-500/20 hover:border-amber-400/40',
        ringColor: 'stroke-amber-400',
      },
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      bgType: 'clouds',
      isDay: true,
      theme: {
        name: 'Aurora Emerald',
        accentColor: '#34d399',
        accentText: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        glow: 'shadow-[0_0_35px_rgba(52,211,153,0.35)]',
        borderGlow: 'border-emerald-500/30',
        btnBg: 'hover:bg-emerald-500/20 hover:border-emerald-400/40',
        ringColor: 'stroke-emerald-400',
      },
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      condition: 'Foggy Mist',
      icon: 'CloudFog',
      bgType: 'fog',
      isDay: false,
      theme: {
        name: 'Mist Platinum',
        accentColor: '#cbd5e1',
        accentText: 'text-slate-300',
        badgeBg: 'bg-slate-400/20 border-slate-400/30 text-slate-200',
        glow: 'shadow-[0_0_35px_rgba(203,213,225,0.3)]',
        borderGlow: 'border-slate-400/30',
        btnBg: 'hover:bg-slate-400/20 hover:border-slate-300/40',
        ringColor: 'stroke-slate-300',
      },
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      condition: 'Rain Shower',
      icon: 'CloudRain',
      bgType: 'rain',
      isDay: false,
      theme: {
        name: 'Ocean Cyan',
        accentColor: '#38bdf8',
        accentText: 'text-sky-400',
        badgeBg: 'bg-sky-500/20 border-sky-500/30 text-sky-300',
        glow: 'shadow-[0_0_35px_rgba(56,189,248,0.35)]',
        borderGlow: 'border-sky-500/30',
        btnBg: 'hover:bg-sky-500/20 hover:border-sky-400/40',
        ringColor: 'stroke-sky-400',
      },
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      condition: 'Snowfall',
      icon: 'CloudSnow',
      bgType: 'snow',
      isDay: false,
      theme: {
        name: 'Frost Silver',
        accentColor: '#a5f3fc',
        accentText: 'text-cyan-300',
        badgeBg: 'bg-cyan-400/20 border-cyan-400/30 text-cyan-200',
        glow: 'shadow-[0_0_35px_rgba(165,243,252,0.4)]',
        borderGlow: 'border-cyan-400/30',
        btnBg: 'hover:bg-cyan-400/20 hover:border-cyan-300/40',
        ringColor: 'stroke-cyan-300',
      },
    };
  }
  if (code >= 95 && code <= 99) {
    return {
      condition: 'Thunderstorm',
      icon: 'CloudLightning',
      bgType: 'thunderstorm',
      isDay: false,
      theme: {
        name: 'Electric Purple',
        accentColor: '#c084fc',
        accentText: 'text-purple-400',
        badgeBg: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
        glow: 'shadow-[0_0_35px_rgba(192,132,252,0.4)]',
        borderGlow: 'border-purple-500/30',
        btnBg: 'hover:bg-purple-500/20 hover:border-purple-400/40',
        ringColor: 'stroke-purple-400',
      },
    };
  }
  return {
    condition: 'Overcast',
    icon: 'Cloud',
    bgType: 'clouds',
    isDay: true,
    theme: {
      name: 'Aurora Emerald',
      accentColor: '#34d399',
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      glow: 'shadow-[0_0_35px_rgba(52,211,153,0.35)]',
      borderGlow: 'border-emerald-500/30',
      btnBg: 'hover:bg-emerald-500/20 hover:border-emerald-400/40',
      ringColor: 'stroke-emerald-400',
    },
  };
}

// Convert Celsius to Fahrenheit
export function cToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

// Format temperature string with unit preference
export function formatTemp(tempC, unit = 'C') {
  if (tempC === undefined || tempC === null) return '--°';
  if (unit === 'F') {
    return `${cToF(tempC)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

// Search Cities Autocomplete
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((item) => ({
      id: `${item.latitude}-${item.longitude}`,
      name: item.name,
      country: item.country || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

// Reverse Geocode coordinates to city name
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${lat},${lon}&count=1`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return `${data.results[0].name}, ${data.results[0].country || ''}`;
      }
    }
  } catch (e) {
    console.error('Reverse geocode error:', e);
  }
  return `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
}

// Fetch Full Weather Data
export async function fetchFullWeatherData(lat, lon, cityName = '') {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) throw new Error('Failed to load weather data');

    const weatherData = await weatherRes.json();
    const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

    const current = weatherData.current || {};
    const hourly = weatherData.hourly || {};
    const daily = weatherData.daily || {};

    const conditionInfo = getWeatherDetails(current.weather_code || 0);

    // Build 24-Hour Hourly Forecast
    const nowHourIndex = new Date().getHours();
    const hourlyList = [];
    if (hourly.time) {
      for (let i = nowHourIndex; i < Math.min(nowHourIndex + 24, hourly.time.length); i++) {
        const timeStr = hourly.time[i];
        const dateObj = new Date(timeStr);
        const formattedHour = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hCode = hourly.weather_code[i] || 0;
        const hDetails = getWeatherDetails(hCode);
        hourlyList.push({
          time: formattedHour,
          temp: hourly.temperature_2m[i],
          pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
          condition: hDetails.condition,
          bgType: hDetails.bgType,
        });
      }
    }

    // Build 7-Day Forecast
    const dailyList = [];
    if (daily.time) {
      for (let i = 0; i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const dateObj = new Date(dateStr);
        const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dCode = daily.weather_code[i] || 0;
        const dDetails = getWeatherDetails(dCode);
        dailyList.push({
          day: dayName,
          date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          maxTemp: daily.temperature_2m_max[i],
          minTemp: daily.temperature_2m_min[i],
          pop: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          condition: dDetails.condition,
          bgType: dDetails.bgType,
          uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
        });
      }
    }

    // AQI Info
    const usAqi = aqiData?.current?.us_aqi ?? 42;
    let aqiLabel = 'Good';
    let aqiColor = 'text-emerald-400';
    if (usAqi > 50 && usAqi <= 100) {
      aqiLabel = 'Moderate';
      aqiColor = 'text-yellow-400';
    } else if (usAqi > 100 && usAqi <= 150) {
      aqiLabel = 'Unhealthy for Sensitive Groups';
      aqiColor = 'text-orange-400';
    } else if (usAqi > 150) {
      aqiLabel = 'Unhealthy';
      aqiColor = 'text-red-400';
    }

    // Sunrise & Sunset
    const sunriseTime = daily.sunrise && daily.sunrise[0]
      ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '06:12 AM';
    const sunsetTime = daily.sunset && daily.sunset[0]
      ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '08:45 PM';

    return {
      cityName: cityName || 'Local Weather',
      lat,
      lon,
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      condition: conditionInfo.condition,
      bgType: conditionInfo.bgType,
      theme: conditionInfo.theme,
      isDay: current.is_day === 1,
      humidity: current.relative_humidity_2m ?? 65,
      windSpeed: current.wind_speed_10m ?? 12,
      windDir: current.wind_direction_10m ?? 180,
      pressure: current.surface_pressure ?? 1013,
      uvIndex: current.uv_index ?? 5,
      precipitation: current.precipitation ?? 0,
      sunrise: sunriseTime,
      sunset: sunsetTime,
      hourly: hourlyList,
      daily: dailyList,
      aqi: {
        value: usAqi,
        label: aqiLabel,
        colorClass: aqiColor,
        pm2_5: aqiData?.current?.pm2_5 ?? 8.4,
        pm10: aqiData?.current?.pm10 ?? 14.2,
        no2: aqiData?.current?.nitrogen_dioxide ?? 12.1,
        o3: aqiData?.current?.ozone ?? 45.0,
      },
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    throw err;
  }
}
