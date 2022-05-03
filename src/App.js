import "./App.css";
import React, { useEffect, useState } from "react";
import Cards, { Card } from "react-bootstrap";

const API_URL = "https://api.openweathermap.org/data/2.5/onecall?";
const API_KEY = "4131a8473c96bf0edf5cb380a0d4a326";
//Parameters
let city = null;
let currentWeather = null;
let currentTemp = null;
let sunrise = null;
let sunset = null;
let currentHumidity = null;
let currentWind = null;
let daily = {};
let measure = "°C";
let distanceTime = "m/s";

const createApi = ({ lon, lat }) => {
  if (measure == "°C") {
    return `${API_URL}lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`;
  } else {
    return `${API_URL}lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=${API_KEY}`;
  }
};

const getCoords = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      );
    } else {
      reject("Could not find you location");
    }
  });
};

const toJSON = (response) => response.json();

const getWeatherData = (setWeather) =>
  getCoords().then(createApi).then(fetch).then(toJSON).then(setWeather);

const timeTraslate = (epoch) => {
  let date = new Date(epoch * 1000);
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  return `${hour}:${minute}`;
};

const timeTrim = (weatherHourly) => {
  for (let i = 0; i < 23; i++) {
    if (timeTraslate(weatherHourly[i].date) == "00:00") {
      return i;
    }
  }
};

const dayTranslate = (epoch) => {
  let newDate = new Date(epoch * 1000);
  switch (newDate.getDay()) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
    default:
      return "error";
  }
};

function App() {
  const [weather, setWeather] = useState({});
  const [hourly, setHourly] = useState({});

  useEffect(() => {
    getWeatherData(setWeather);
  }, [getWeatherData]);

  useEffect(() => {
    if (weather.timezone) {
      city = weather.timezone.slice(7);
      currentWeather = weather.current.weather[0].description;
      currentTemp = Math.floor(weather.current.temp);
      sunrise = timeTraslate(weather.current.sunrise);
      sunset = timeTraslate(weather.current.sunset);
      currentWind = weather.current.wind_speed;
      currentHumidity = weather.current.humidity;
      daily = weather.daily.slice(1, 6);
      setHourly(weather.hourly.slice(0, timeTrim(weather.hourly)));
    } else {
      city = "Could not get weather";
    }
  }, [weather]);

  const convert = () => {
    if (measure == "°F") {
      measure = "°C";
      distanceTime = "m/s";
    } else {
      measure = "°F";
      distanceTime = "mph";
    }
    getWeatherData(setWeather);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="row">
          <div className="col-9 left">
            <div className="row top">
              <h1 className="col">{city}</h1>
              <button
                className="col"
                onClick={() => {
                  convert();
                }}
              >
                Celsius / Fahrenheit{" "}
              </button>
            </div>

            <div className="row top">
              <h3 className="col-7 temp">
                {currentTemp}
                {measure}
              </h3>
              <h3 className="col">{currentWeather}</h3>
            </div>
            <div className="row">
              <div className="col border">
                <p>
                  <i class="col" title="wind"></i>Wind: {currentWind}
                  {distanceTime}
                </p>
                <p>
                  <i class="col" aria-hidden="true"></i>Humidity:{" "}
                  {currentHumidity}%
                </p>
                <p>Sunrise at: {sunrise}</p>
                <p>Sunset at: {sunset}</p>
              </div>
            </div>

            <div className="col-3 right">
              <h3 className="row top">Today's Forecast</h3>
              <div className="hourly">
                {hourly.map &&
                  hourly.map((hour) => (
                    <div>
                      <p className="row">
                        {timeTraslate(hour.dt)}
                      </p>
                      <p className="col">
                        {Math.floor(hour.temp)}
                        {measure}
                      </p>
                      <p className="col"></p>
                      <p className="col">
                        {hour.wind_speed}
                        {distanceTime}
                      </p>
                      <p className="col">
                        <i class="fa fa-tint" aria-hidden="true"></i>
                        {hour.humidity}%
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="row bottom">
            <div className="col">
              <h2 className="col border">5 days forecast</h2>
              <div className="col">
                {daily.map &&
                  daily.map((day) => (
                    <div className="row">
                      <p className="row">
                        <b>{dayTranslate(day.dt)}</b>
                      </p>
                      <p className="row">{day.weather[0].main}</p>
                      <p className="row">
                        {Math.floor(day.temp.max)}
                        {measure} / {Math.floor(day.temp.min)}
                        {measure}
                      </p>
                      <p className="row"></p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
