# 🌤️ SkyCast Weather Dashboard

A high-performance, modern React-based weather dashboard that provides real-time forecasts, air quality data, and historical weather trends. Built with a focus on performance (sub-500ms API responses) and a beautiful, responsive UI.

![SkyCast Dashboard](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logo=chartdotjs&logoColor=white)

## 🚀 Features

### 📍 Smart Dashboard
- **Auto-Location Detection**: Automatically fetches weather data based on your GPS coordinates.
- **Fallback Support**: Seamlessly falls back to London if GPS is unavailable.
- **Real-time Overview**: Current temperature, wind speed, sunrise, and sunset at a glance.
- **24h Forecast**: Interactive area charts for temperature, humidity, and precipitation.
- **Air Quality**: Combined PM2.5 and PM10 metrics visualized through Recharts.

### 📜 Historical Trends
- **Custom Date Range**: Analyze weather patterns up to 2 years back.
- **Interactive Charts**: Compare Max, Min, and Mean temperatures over time.
- **Zoom & Scroll**: Integrated brush tools for deep-diving into large historical datasets.

### ⚡ Technical Excellence
- **Performance**: Optimized API layer using `Promise.all()` for concurrent data fetching.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Dark Mode**: Native support for dark/light themes with manual toggle.
- **Unit Toggle**: Instantly switch between Celsius (°C) and Fahrenheit (°F).

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [Day.js](https://day.js.org/)
- **API**: [Open-Meteo](https://open-meteo.com/) (Free, Open-Source Weather API)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anasali0011/SkyCast-Dashboard.git
   cd SkyCast-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
src/
 ├── api/           # API services for Forecast & Historical data
 ├── components/    # Reusable UI components & Charts
 ├── hooks/         # Custom hooks (Geolocation)
 ├── pages/         # Home & History views
 ├── utils/         # Date formatting utilities
 └── App.jsx        # Routing & Layout initialization
```

## 📄 License

This project is open-source and available under the MIT License.

---
Built with ❤️ by [Anas](https://github.com/anasali0011)
