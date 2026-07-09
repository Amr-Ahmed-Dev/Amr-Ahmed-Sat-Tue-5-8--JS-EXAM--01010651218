// src/js/models/Weather.js

export default class Weather {
  constructor(
    cityName,
    currentTemp,
    feelsLike,
    weatherCode,
    humidity,
    windSpeed,
    precipitation,
    hourlyList,
    dailyList,
  ) {
    this.cityName = cityName;
    this.currentTemp = currentTemp;
    this.feelsLike = feelsLike;
    this.weatherCode = weatherCode;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.precipitation = precipitation;
    this.hourlyList = hourlyList;
    this.dailyList = dailyList;
  }
}
