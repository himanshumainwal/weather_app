import React, { useState, useEffect } from "react";
import { BsCloudHaze2Fill, BsSunFill, BsCloudRainFill, BsSnow } from "react-icons/bs";
import { WiDayCloudy, WiThunderstorm, WiNightFog } from "react-icons/wi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { GiSmokeBomb } from "react-icons/gi";



const WeatherApp = () => {
  const [city, setCity] = useState("mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_KEY = "c90014614b52ac63c57a83b060b43f67";

  //  Function to fetch weather
  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();
      // console.log(weatherData);

      if (weatherData.cod !== 200) {
        throw new Error(weatherData.message);
      }

      setWeather(weatherData);

      // Fetch 5-day forecast Weather
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // OpenWeatherMap provides weather data in 3-hour intervals (24 hours, you get 8 entries)
      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);
      // console.log(dailyForecast);
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delays API call until user stops typing
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.length > 2) {
        setCity(searchTerm);
      }
    }, 700);

    return () => clearTimeout(delay); // Cleanup to prevent multiple calls (Unmounting)
  }, [searchTerm]);

  // Fetch weather only when city is updated
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Haze":
        return <BsCloudHaze2Fill color="white" />;
      case "Clear":
        return <BsSunFill color="orange" />;
      case "Clouds":
        return <WiDayCloudy color="white" />;
      case "Smoke":
        return <GiSmokeBomb color="white" />;
      case "Rain":
        return <BsCloudRainFill color="white" />;
      case "Snow":
        return <BsSnow color="white" />;
      case "Thunderstorm":
        return <WiThunderstorm color="white" />;
      case "Mist":
        return <WiNightFog color="white" />;
      default:
        return <BsSunFill color="orange" />;
    }
  };

  return (//bg-linear-to-r from-cyan-500 to-blue-500
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-5">
      <h1 className="text-4xl font-bold mb-4 underline">Weather App</h1>
      <div className="flex w-full px-2 rounded-lg items-center max-w-md border border-gray-300 ">
        < BiSearch className="text-2xl " />
        <input
          type="text"
          className="flex-1 p-2 focus:outline-none "
          placeholder="Enter city name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <AiOutlineLoading3Quarters className="text-9xl mt-8 text-gray-200 animate-spin" />}
      {error && <p className="mt-4 text-red-500 text-2xl">{error}</p>}

      {weather && (
        <div className="mt-6 p-5 rounded-lg shadow-md w-full max-w-md border bg-transparent">
          <video
            key={weather.weather[0].main}
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          >
            <source src={`/public/${weather.weather[0].main || "Default"}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h2 className="text-3xl font-bold text-center mb-4">
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="flex justify-around gap-3">
            <div className="weather-icon text-9xl">{getWeatherIcon(weather.weather[0].main)}</div>
            <div>
              <p className="text-xl">{weather.weather[0].description}</p>
              <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="mt-6 p-6 rounded-lg shadow-md w-full max-w-md bg-transparent border">
          <h2 className="text-2xl text-center font-bold">5-Day Forecast</h2>
          <div className="mt-4 space-y-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex justify-between border-b py-2">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <p className="font-bold">{Math.round(day.main.temp)}°C</p>
                <div className="flex items-center gap-1">
                  <div className="weather-icon text-xl">{getWeatherIcon(day.weather[0].main)}</div>
                  <p>{day.weather[0].description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
