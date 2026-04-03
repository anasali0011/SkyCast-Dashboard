import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Brush,
} from 'recharts';

const WeatherChart = ({ data, dataKey, color, type = 'line', unit = '', title, showBrush = true }) => {
  const ChartComponent = type === 'bar' ? BarChart : (type === 'area' ? AreaChart : LineChart);
  const DataComponent = type === 'bar' ? Bar : (type === 'area' ? Area : Line);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px]">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            unit={unit}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            itemStyle={{ color: '#fff' }}
          />
          <DataComponent
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={type === 'area' || type === 'bar' ? color : 'none'}
            fillOpacity={type === 'area' ? 0.1 : 1}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          {showBrush && data.length > 10 && (
            <Brush 
              dataKey="time" 
              height={30} 
              stroke={color} 
              fill="transparent"
              travellerWidth={10}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
