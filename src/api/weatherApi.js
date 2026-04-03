import axios from 'axios';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export const getWeather = async (lat, lon) => {
  console.log(`Fetching weather for: ${lat}, ${lon}`);
  try {
    const weatherPromise = axiosInstance.get(WEATHER_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
        current_weather: true,
        timezone: 'GMT',
      },
    });

    const airQualityPromise = axiosInstance.get(AIR_QUALITY_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'pm10,pm2_5',
        timezone: 'GMT',
      },
    }).catch(err => {
      console.warn('Air quality data fetch failed, continuing without it:', err.message);
      return { data: null };
    });

    const [weatherRes, airQualityRes] = await Promise.all([
      weatherPromise,
      airQualityPromise,
    ]);

    if (!weatherRes || !weatherRes.data) {
      throw new Error('Failed to fetch weather data from primary source');
    }

    console.log('Weather data received:', weatherRes.data);
    return {
      weather: weatherRes.data,
      airQuality: airQualityRes.data,
    };
  } catch (error) {
    console.error('Critical error fetching weather data:', error.response?.data || error.message);
    throw error;
  }
};

export const getHistoricalWeather = async (lat, lon, startDate, endDate) => {
  try {
    const res = await axios.get(ARCHIVE_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean',
        timezone: 'auto',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    throw error;
  }
};
