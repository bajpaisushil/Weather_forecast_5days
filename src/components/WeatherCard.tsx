// src/components/WeatherCard.tsx
import React from 'react';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake } from 'react-icons/fa';

interface WeatherCardProps {
  day: {
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    coord?: { lat: number; lon: number };
    weather: { main: 'Clear' | 'Clouds' | 'Rain' | 'Snow' }[];
  };
  sunrise: any;
  sunset: any;
  date: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ day, date, sunrise, sunset }) => {
  const { main, weather } = day;
  console.log('day', day);

  const getWeatherIcon = () => {
    const weatherType = weather[0]?.main || 'Clear';
    switch (weatherType) {
      case 'Clear':
        return <FaSun />;
      case 'Clouds':
        return <FaCloud />;
      case 'Rain':
        return <FaCloudRain />;
      case 'Snow':
        return <FaSnowflake />;
      default:
        return null;
    }
  };

  return (
    <div className="weather-card">
      <div className="date">{date}</div>
      <div className="weather-icon">{getWeatherIcon()}</div>
      <div>{main.temp_max}&deg;C</div>
      <div>{main.temp_min}&deg;C</div>
      
      <div>{main.humidity}%</div>
      <div>{sunrise && new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
      <div>{sunset && new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
    </div>
  );
};

export default WeatherCard;
