import React, {useState, useEffect} from "react";
import "./App.css";
import Form from "./components/Form";
import Weather from "./components/Weather";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";
import Forecast from "./components/Forecast";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,      
      icon: undefined,
      main: undefined,
      celsius: undefined,
      windSpeed: undefined,
      humidity: undefined,      
      description: ' ',
      error: false
    };

    
    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeather = async e => {
    e.preventDefault();

    
    const city = e.target.elements.city.value;

    if (city) {
      const api_call = await fetch(
        `${process.env.REACT_APP_API_URL}/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );

      const response = await api_call.json();

      this.setState({
        city: `${response.name}`,        
        main: response.weather[0].main,
        celsius: this.calCelsius(response.main.temp),
        windSpeed: response.wind.speed,
        humidity: response.main.humidity,
        description: response.weather[0].description,
        error: false
      });
      
      // seting icons
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);


    } else {
      this.setState({
        error: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error} />
        <Weather
          cityname={this.state.city}
          weatherIcon={this.state.icon}
          temp_celsius={this.state.celsius}
          windSpeed={this.state.windSpeed}
          humidity={this.state.humidity}
          description={this.state.description}
                   
        />
        
      </div>
    );
  }
  
}


export default App;



