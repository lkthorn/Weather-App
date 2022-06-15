import "./App.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
  if (measure === "°C") {
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
    if (timeTraslate(weatherHourly[i].date) === "00:00") {
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
  }, []);

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
    if (measure === "°F") {
      measure = "°C";
      distanceTime = "m/s";
    } else {
      measure = "°F";
      distanceTime = "mph";
    }
    getWeatherData(setWeather);
  };

  return (
    <div className="App">
      <Container>
        <Card className="my-3">
          <div className="switchOn">
            <Row className="text-center">
              <h1>{city}</h1>
            </Row>

            <Row>
              
              <Col className="mx-5">
                <h3>{currentWeather}</h3>
                <h3>
                  {currentTemp}
                  {measure}
                </h3>
              </Col>
              <Col>
                <Button
                  className="position-relative squared mx-3 p-3"
                  variant="secondary"
                  onClick={() => {
                    convert();
                  }}
                >
                  Change Units
                </Button>
              </Col>
            </Row>
          </div>
          
          <Row className="justify-content-md-center mx-3 py-3">
            
              
                <Col>
                  <i title="wind"></i>Wind: {currentWind}
                  {distanceTime}
                </Col>
                <Col>
                  <i aria-hidden="true"></i>Humidity: {currentHumidity}%
                </Col>
                <Col>Sunrise at: {sunrise}</Col>
                <Col>Sunset at: {sunset}</Col>
              
            
          </Row>
        </Card>

        <Card className="mb-3">
          <h3 className="col text-center py-2 px-4">Today's Forecast</h3>
          <div className="col text-center px-4">
            <Row className="justify-content-md-center">
              {hourly.map &&
                hourly.map((hour) => (
                  <div>
                    <ListGroup horizontal>
                      <Col xs lg="2">
                        <p>{timeTraslate(hour.dt)}</p>
                      </Col>
                      <Col>
                        <p>
                          {Math.floor(hour.temp)}
                          {measure}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          {hour.wind_speed}
                          {distanceTime}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <i aria-hidden="true"></i>
                          {hour.humidity}%
                        </p>
                      </Col>
                    </ListGroup>
                  </div>
                ))}
            </Row>
          </div>
        </Card>

        <Card className="mb-3">
          <h3 className="col text-center py-2 px-4">5 Days Forecast</h3>
          <div className="col text-center py-4 px-4">
            <Row className="justify-content-md-center">
              <div>
                {daily.map &&
                  daily.map((day) => (
                    <div>
                      <ListGroup horizontal>
                        <Col>
                          <p>
                            <b>{dayTranslate(day.dt)}</b>
                          </p>
                        </Col>
                        <Col>
                          <p>{day.weather[0].main}</p>
                        </Col>
                        <Col>
                          <p>
                            {Math.floor(day.temp.max)}
                            {measure} / {Math.floor(day.temp.min)}
                            {measure}
                          </p>
                        </Col>
                        <Col>
                          <p></p>
                        </Col>
                      </ListGroup>
                    </div>
                  ))}
              </div>
            </Row>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default App;
