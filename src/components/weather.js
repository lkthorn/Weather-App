import React from "react";
import Card from 'react-bootstrap/Card';

const weatherCard = ({weatherData}) => (
<Card style={{ width: '18rem' }}>
    <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
    <p>City: {weatherData.name}</p>{}
    <p>Temprature: {weatherData.main.temp}ºC</p>
    <p>Wind Speed: {weatherData.wind.speed}m/s</p>
    <p>Humidity: {weatherData.main.humidity}%</p>
    <p>Sunrise: {weatherData.sys.sunrise}</p>
    <p>Sunset: {weatherData.sys.sunset}</p>
    </Card.Text>
    </Card.Body>
</Card>
)

export default weatherCard;