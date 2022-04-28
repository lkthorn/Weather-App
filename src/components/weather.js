import React from "react";
import Card from "react-bootstrap/Card";

import moment from "moment";

const weatherCard = ({ weatherData }) => (
  <Card style={{ width: "18rem" }}>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>
        <p>City: {weatherData.name}</p>
        {}
        <p>Temperature: {weatherData.main.temp}ºC</p>
        <p>Wind Speed: {weatherData.wind.speed}m/s</p>
        <p>Humidity: {weatherData.main.humidity}%</p>       
        <p>
          Sunrise:{" "}
          {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-IN")}
        </p>
        <p>
          Sunset:{" "}
          {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-IN")}
        </p>
        <p>Day: {moment().format("dddd")}</p>
        <p>Date: {moment().format("LL")}</p>
        
             
      </Card.Text>
    </Card.Body>
  </Card>
);

export default weatherCard;
