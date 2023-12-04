// src/components/WeatherApp.tsx
import React, { useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import { FaSearch } from "react-icons/fa";
import "./App.css";

interface ForecastItem {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  coord: { lat: number; lon: number };
  weather: { main: "Clear" | "Clouds" | "Rain" | "Snow" }[];
}

const WeatherApp: React.FC = () => {
  const [inputCity, setInputCity] = useState("");
  const [showCity, setShowCity] = useState("");
  const [showLatLon, setShowLatLon] = useState("");
  const [startDate, setStartDate] = useState<string>(""); // Added startDate state
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [sunrise, setSunrise] = useState<number>(0);
  const [sunset, setSunset] = useState<number>(0);

  const API_KEY = "431f9a86c3d2e68e42453fb109c691d2";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  const handleSearch = async () => {
    if (inputCity.length === 0) {
      return alert("Choose your city");
    }
    if (startDate.length === 0) {
      return alert("Choose a start date");
    }

    try {
      const cityResponse = await axios.get(API_URL, {
        params: {
          q: inputCity,
          appid: API_KEY,
        },
      });

      const { lat, lon } = cityResponse.data.city.coord;

      const response = await axios.get(API_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      });
      console.log("response", response);

      setShowCity(response.data.city.name);
      setShowLatLon(`Lat: ${lat}, Lon: ${lon}`);
      setSunrise(response.data.city.sunrise);
      setSunset(response.data.city.sunset);

      const filteredForecast = response.data.list
        .filter((item: any) => {
          const date = new Date(item.dt_txt);
          const hours = date.getHours();
          // Filter for 06:00:00 and unique dates
          return (
            hours === 6 &&
            !forecast.find((day) => day.dt === item.dt) &&
            date >= new Date(startDate)
          );
        })
        .slice(0, 5);
      console.log("filtered forecast", filteredForecast);

      setForecast(filteredForecast);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="weather_app">
      <div className="weather_navbar">
        <div className="navbar_left">Weather 99</div>
        <div className="navbar_right">Refresh</div>
      </div>
      <div className="info_container">
        <div className="input_btn_container">
          <input
            type="text"
            placeholder="Search your city here..."
            value={inputCity}
            className="input_city"
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch className="search_icon" />
          </button>
        </div>

        {showCity && (
          <div className="area">
            <h1 className="location">{showCity}</h1>
            <p className="lat_lon">{showLatLon}</p>
          </div>
        )}
      </div>
      <div className="forecast">
        <div className="weather-card">
          <label htmlFor="date">Select date</label>
          <input
            id="date"
            type="date"
            value={startDate}
            className="input_date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <div>High Temperature</div>
          <div>Low Temperature</div>

          <div>Humidity</div>
          <div>Sunrise</div>
          <div>Sunset</div>
        </div>
        {forecast.map((day) => (
          <WeatherCard
            key={day.dt}
            day={day}
            date={formatDate(day.dt)}
            sunrise={sunrise}
            sunset={sunset}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
