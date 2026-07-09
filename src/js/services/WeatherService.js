import HourlyForecast from "../models/HourlyForecast.js";
import DailyForecast from "../models/DailyForecast.js";
import Weather from "../models/Weather.js";

export default class WeatherService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchWeather(lat, lng, cityName) {
    try {
      const url =
        `${this.apiUrl}?latitude=${lat}&longitude=${lng}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`;

      const response = await fetch(url);
      const result = await response.json();

      const currentIndex = result.hourly.time.indexOf(result.current.time);
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      const hourlyList = [];
      for (
        let i = startIndex;
        i < startIndex + 8 && i < result.hourly.time.length;
        i++
      ) {
        hourlyList.push(
          new HourlyForecast(
            result.hourly.time[i],
            result.hourly.temperature_2m[i],
            result.hourly.weather_code[i],
          ),
        );
      }

      const dailyList = result.daily.time.map(
        (date, i) =>
          new DailyForecast(
            date,
            result.daily.temperature_2m_max[i],
            result.daily.temperature_2m_min[i],
            result.daily.weather_code[i],
            result.daily.precipitation_probability_max[i],
          ),
      );

      return new Weather(
        cityName,
        result.current.temperature_2m,
        result.current.apparent_temperature,
        result.current.weather_code,
        result.current.relative_humidity_2m,
        result.current.wind_speed_10m,
        result.current.precipitation,
        hourlyList,
        dailyList,
      );
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  }
}
