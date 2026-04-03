import React, { useState, useEffect, useMemo } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { getHistoricalWeather } from '../api/weatherApi';
import WeatherChart from '../components/Charts/WeatherChart';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate } from '../utils/formatDate';
import dayjs from 'dayjs';
import { 
  Calendar, 
  Search, 
  AlertCircle,
  TrendingUp,
  Wind,
  Droplets,
  CloudRain
} from 'lucide-react';

const History = () => {
  const { location: geoCoords, error: geoError, loading: geoLoading } = useGeolocation();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  // Default to London if geolocation is not available
  const DEFAULT_LOCATION = { latitude: 51.5074, longitude: -0.1278 };
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    if (!geoLoading) {
      const coords = geoCoords || DEFAULT_LOCATION;
      setActiveLocation(coords);
      fetchHistory(coords.latitude, coords.longitude);
    }
  }, [geoCoords, geoLoading]);

  const fetchHistory = async (lat, lon) => {
    setLoading(true);
    try {
      const data = await getHistoricalWeather(lat, lon, startDate, endDate);
      setHistoryData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch historical data. Please check your dates and try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!historyData) return [];
    
    return historyData.daily.time.map((time, index) => ({
      time: formatDate(time, 'MMM DD'),
      maxTemp: historyData.daily.temperature_2m_max[index],
      minTemp: historyData.daily.temperature_2m_min[index],
      meanTemp: historyData.daily.temperature_2m_mean[index],
    }));
  }, [historyData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeLocation) {
      fetchHistory(activeLocation.latitude, activeLocation.longitude);
    }
  };

  if (geoLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Historical Trends
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze weather patterns from the past
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-1 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white w-full"
              />
            </div>
          </div>
          <div className="space-y-1 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={dayjs().format('YYYY-MM-DD')}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px] animate-pulse">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
            <div className="h-64 w-full bg-gray-100 dark:bg-gray-700/50 rounded" />
          </div>
        </div>
      ) : historyData ? (
        <div className="grid grid-cols-1 gap-8">
          <WeatherChart 
            title="Temperature Trends (Max, Min, Mean)" 
            data={chartData} 
            dataKey="maxTemp" 
            color="#ef4444" 
            unit="°C"
            type="area"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WeatherChart 
              title="Daily Max Temperature" 
              data={chartData} 
              dataKey="maxTemp" 
              color="#f87171" 
              unit="°C"
            />
            <WeatherChart 
              title="Daily Min Temperature" 
              data={chartData} 
              dataKey="minTemp" 
              color="#60a5fa" 
              unit="°C"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Select a date range to view historical data</p>
        </div>
      )}
    </div>
  );
};

export default History;
