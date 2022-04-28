import "./App.css";
import React, { useEffect, useState } from "react";
import Weather from "./components/Weather";
import { Forecast } from "./components/Forecast";

export default function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);

  const [weatherForecast, setWeatherForecast] = useState();

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      fetch(
        `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      )
        .then((res) => res.json())
        .then((result) => {
          setData(result);
          console.log(result);
        });
    };
    fetchData();
  }, [lat, long]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&exclude=current,minutely,hourly,alerts&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then(res => res.json())
      .then(res => {
      console.log(res);
        setWeatherForecast(
          res.weatherForecast
          .map((wf) => {
            return {
              min: wf.weatherForecast.daily.temp.min.Value,
              max: wf.weatherForecast.daily.temp.max.Value,
              description: wf.weatherForecast.daily.weather.icon,
            }
          }))
      });
      
  }, []);

  useEffect(() => {
    console.log(weatherForecast);
  }, [weatherForecast]);

  return (
    (
      <div>
        {!!weatherForecast &&
          weatherForecast.map((i, index) => (
            <div key={index}>
              <weatherForecast
                min={i.min}
                max={i.max}
                description={i.description}
              />
            </div>
          ))}
      </div>
    ),
    (
      <div className="App">
        {typeof data.main != "undefined" ? (
          <Weather weatherData={data} />
        ) : (
          <div></div>
        )}
      </div>
    )
  );
}
