import React, { Component } from 'react'
import axios from 'axios'
import WeatherIcon from 'react-icons-weather'

export default class forecast extends Component {
  state = {
    fiveForecast: [],
    
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(position => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${
            position.coords.latitude
          }&lon=${
            position.coords.longitude
          }&APPID=4131a8473c96bf0edf5cb380a0d4a326&units=metric`
        )
        .then(res => this.formatData(res))
    })
  }
  
  getWeekly = (item, index) => index % 8 === 0

  formatData(res) {
    const { list } = res.data

    
    let weekly = list.filter(this.getWeekly).map(item => {
      let date = new Date(item.dt * 1000).toDateString()

      return {
        description: item.weather[0].description,
        temp: item.main.temp,
        time: date,
        icon: item.weather[0].id
      }
    })

    this.setState({
      fiveForecast: weekly,
     
    })
  }

  render() {
    const { fiveForecast } = this.state

    const fiveDaily = fiveForecast.map(data => {
      return (
        <div className="fiveForecast" key={data.dt}>
          <p>{data.time}</p>
          <p>{data.description}</p>
          <div>
            <WeatherIcon
              className="owm"
              name="owm"
              iconId={data.icon}
              flip="horizontal"
              rotate="90"
            />
          </div>
          <p>
            Temperature: {data.temp.toFixed()}℃ <br />
          </p>
        </div>
      )
    })
    return (
      <div className="wrapper">        
        <div className="forecast">{fiveDaily}</div>
      </div>
    )
  }
}