import React, { useState, useEffect, useMemo } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { getWeather } from '../api/weatherApi';
import WeatherCard from '../components/WeatherCard';
import WeatherChart from '../components/Charts/WeatherChart';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate, formatTime } from '../utils/formatDate';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  Sunrise, 
  Sunset, 
  Eye, 
  AlertCircle,
  Settings2,
  MapPin
} from 'lucide-react';

const Home = () => {
  const { location: geoCoords, error: geoError, loading: geoLoading } = useGeolocation();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  // Default to London if geolocation is not available
  const DEFAULT_LOCATION = { latitude: 51.5074, longitude: -0.1278, name: 'London' };
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    // If geolocation is still loading after 3 seconds, use fallback to avoid a blank screen
    const timer = setTimeout(() => {
      if (!activeLocation && geoLoading) {
        console.warn('Geolocation taking too long, using fallback');
        setActiveLocation(DEFAULT_LOCATION);
        fetchData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
      }
    }, 3000);

    if (!geoLoading) {
      if (geoCoords) {
        setActiveLocation({ ...geoCoords, name: 'Current Location' });
        fetchData(geoCoords.latitude, geoCoords.longitude);
      } else {
        // Use fallback if geolocation fails
        setActiveLocation(DEFAULT_LOCATION);
        fetchData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
      }
    }

    return () => clearTimeout(timer);
  }, [geoCoords, geoLoading]);

  const fetchData = async (lat, lon) => {
    setLoading(true);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp) => {
    if (unit === 'F') {
      return ((temp * 9) / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
  };

  const hourlyChartData = useMemo(() => {
    if (!weatherData || !weatherData.weather || !weatherData.weather.hourly) return [];
    
    // Combine weather and air quality data for the first 24 hours
    try {
      const times = weatherData.weather.hourly.time || [];
      const temps = weatherData.weather.hourly.temperature_2m || [];
      const humidities = weatherData.weather.hourly.relative_humidity_2m || [];
      const precipitations = weatherData.weather.hourly.precipitation || [];
      const windSpeeds = weatherData.weather.hourly.wind_speed_10m || [];
      const pm25s = weatherData.airQuality?.hourly?.pm2_5 || [];
      const pm10s = weatherData.airQuality?.hourly?.pm10 || [];

      return times.slice(0, 24).map((time, index) => ({
        time: formatTime(time),
        temperature: unit === 'C' 
          ? (temps[index] ?? 0) 
          : ((temps[index] ?? 0) * 9/5 + 32),
        humidity: humidities[index] ?? 0,
        precipitation: precipitations[index] ?? 0,
        windSpeed: windSpeeds[index] ?? 0,
        pm25: pm25s[index] ?? 0,
        pm10: pm10s[index] ?? 0,
      }));
    } catch (err) {
      console.error('Error processing chart data:', err);
      return [];
    }
  }, [weatherData, unit]);

  // Handle errors first, but allow fallback location to work even if geoError exists
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{error}</p>
        <button 
          onClick={() => fetchData(activeLocation.latitude, activeLocation.longitude)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (geoLoading || (loading && !weatherData)) {
    return <LoadingSkeleton />;
  }

  const current = weatherData.weather.current_weather;
  const daily = weatherData.weather.daily;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Weather Overview
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {activeLocation?.name || 'Loading...'} • {formatDate(new Date())}
            </p>
            {geoError && (
              <span className="text-xs px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Using fallback location (GPS unavailable)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => setUnit('C')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              unit === 'C' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              unit === 'F' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            °F
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherCard 
          title="Current Temperature" 
          value={convertTemp(current.temperature)} 
          unit={`°${unit}`}
          icon={Thermometer}
        />
        <WeatherCard 
          title="Wind Speed" 
          value={current.windspeed} 
          unit="km/h"
          icon={Wind}
        />
        <WeatherCard 
          title="Sunrise" 
          value={formatTime(daily.sunrise[0])} 
          icon={Sunrise}
        />
        <WeatherCard 
          title="Sunset" 
          value={formatTime(daily.sunset[0])} 
          icon={Sunset}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeatherChart 
          title={`Temperature Trends (°${unit})`} 
          data={hourlyChartData} 
          dataKey="temperature" 
          color="#3b82f6" 
          unit={`°${unit}`}
          type="area"
        />
        <WeatherChart 
          title="Humidity (%)" 
          data={hourlyChartData} 
          dataKey="humidity" 
          color="#10b981" 
          unit="%"
        />
        <WeatherChart 
          title="Precipitation (mm)" 
          data={hourlyChartData} 
          dataKey="precipitation" 
          color="#6366f1" 
          unit="mm"
          type="bar"
        />
        <WeatherChart 
          title="Wind Speed (km/h)" 
          data={hourlyChartData} 
          dataKey="windSpeed" 
          color="#f59e0b" 
          unit="km/h"
        />
        <div className="lg:col-span-2">
          <WeatherChart 
            title="Air Quality (PM2.5 & PM10)" 
            data={hourlyChartData} 
            dataKey="pm25" 
            color="#ec4899" 
            unit="µg/m³"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
