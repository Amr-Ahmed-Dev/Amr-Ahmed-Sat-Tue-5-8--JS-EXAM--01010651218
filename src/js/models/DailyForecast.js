// src/js/models/DailyForecast.js

export default class DailyForecast {
  constructor(date, tempMax, tempMin, weatherCode, precipitationProbability) {
    this.date = date;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.weatherCode = weatherCode;
    this.precipitationProbability = precipitationProbability;
  }
}
