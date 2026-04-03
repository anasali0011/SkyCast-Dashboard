import React from 'react';

const WeatherCard = ({ title, value, icon: Icon, unit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
    </div>
  );
};

export default WeatherCard;
