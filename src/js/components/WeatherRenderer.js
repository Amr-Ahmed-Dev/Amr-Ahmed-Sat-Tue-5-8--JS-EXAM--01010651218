import {getWeatherVisual} from "../utils/weatherUtils.js";

export default class WeatherRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
    this.emptyStateTitle = document.getElementById("empty-state-weather-title");
    this.emptyStateText = document.getElementById("empty-state-weather-text");
  }

  render(weather) {
    this.container.replaceChildren();

    if (!weather) {
      this._setEmptyMessage(
        "No City Selected",
        "Select a country and city from the dashboard to see the weather forecast",
      );
      this.showEmptyState(true);
      return;
    }

    this.showEmptyState(false);

    this.container.appendChild(this._buildHeroCard(weather));
    this.container.appendChild(this._buildDetailsGrid(weather));
    this.container.appendChild(this._buildHourlySection(weather));
    this.container.appendChild(this._buildDailySection(weather));
  }

  _setEmptyMessage(title, text) {
    if (this.emptyStateTitle) this.emptyStateTitle.textContent = title;
    if (this.emptyStateText) this.emptyStateText.textContent = text;
  }

  _buildHeroCard(weather) {
    const visual = getWeatherVisual(weather.weatherCode);

    const hero = document.createElement("div");
    hero.className = "weather-hero-card weather-sunny";

    const locationLine = document.createElement("div");
    locationLine.className = "weather-location";
    const locationIcon = document.createElement("i");
    locationIcon.className = "fa-solid fa-location-dot";
    const locationName = document.createElement("span");
    locationName.textContent = weather.cityName;
    locationLine.appendChild(locationIcon);
    locationLine.appendChild(locationName);

    const heroMain = document.createElement("div");
    heroMain.className = "weather-hero-main";

    const heroLeft = document.createElement("div");
    heroLeft.className = "weather-hero-left";
    const heroIconWrapper = document.createElement("div");
    heroIconWrapper.className = "weather-hero-icon";
    const heroIcon = document.createElement("i");
    heroIcon.className = `fa-solid ${visual.icon}`;
    heroIconWrapper.appendChild(heroIcon);
    const heroTemp = document.createElement("div");
    heroTemp.className = "weather-hero-temp";
    const tempValue = document.createElement("span");
    tempValue.className = "temp-value";
    tempValue.textContent = Math.round(weather.currentTemp);
    const tempUnit = document.createElement("span");
    tempUnit.className = "temp-unit";
    tempUnit.textContent = "°C";
    heroTemp.appendChild(tempValue);
    heroTemp.appendChild(tempUnit);
    heroLeft.appendChild(heroIconWrapper);
    heroLeft.appendChild(heroTemp);

    const heroRight = document.createElement("div");
    heroRight.className = "weather-hero-right";
    const condition = document.createElement("div");
    condition.className = "weather-condition";
    condition.textContent = visual.label;
    const feels = document.createElement("div");
    feels.className = "weather-feels";
    feels.textContent = `Feels like ${Math.round(weather.feelsLike)}°C`;
    heroRight.appendChild(condition);
    heroRight.appendChild(feels);

    heroMain.appendChild(heroLeft);
    heroMain.appendChild(heroRight);

    hero.appendChild(locationLine);
    hero.appendChild(heroMain);

    return hero;
  }

  _buildDetailsGrid(weather) {
    const grid = document.createElement("div");
    grid.className = "weather-details-grid";

    const details = [
      {
        icon: "fa-droplet",
        cls: "humidity",
        label: "Humidity",
        value: `${weather.humidity}%`,
      },
      {
        icon: "fa-wind",
        cls: "wind",
        label: "Wind",
        value: `${weather.windSpeed} km/h`,
      },
      {
        icon: "fa-cloud-rain",
        cls: "precip",
        label: "Precipitation",
        value: `${weather.precipitation} mm`,
      },
    ];

    details.forEach((detail) => {
      const card = document.createElement("div");
      card.className = "weather-detail-card";

      const iconWrapper = document.createElement("div");
      iconWrapper.className = `detail-icon ${detail.cls}`;
      const icon = document.createElement("i");
      icon.className = `fa-solid ${detail.icon}`;
      iconWrapper.appendChild(icon);

      const info = document.createElement("div");
      info.className = "detail-info";
      const label = document.createElement("span");
      label.className = "detail-label";
      label.textContent = detail.label;
      const value = document.createElement("span");
      value.className = "detail-value";
      value.textContent = detail.value;
      info.appendChild(label);
      info.appendChild(value);

      card.appendChild(iconWrapper);
      card.appendChild(info);
      grid.appendChild(card);
    });

    return grid;
  }

  _buildHourlySection(weather) {
    const section = document.createElement("div");
    section.className = "weather-section";

    const title = document.createElement("h3");
    title.className = "weather-section-title";
    const titleIcon = document.createElement("i");
    titleIcon.className = "fa-solid fa-clock";
    title.appendChild(titleIcon);
    title.appendChild(document.createTextNode(" Hourly Forecast"));

    const scroll = document.createElement("div");
    scroll.className = "hourly-scroll";

    weather.hourlyList.forEach((hour, index) => {
      const visual = getWeatherVisual(hour.weatherCode);

      const item = document.createElement("div");
      item.className = index === 0 ? "hourly-item now" : "hourly-item";

      const time = document.createElement("span");
      time.className = "hourly-time";
      time.textContent =
        index === 0
          ? "Now"
          : new Date(hour.time).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });

      const iconWrapper = document.createElement("div");
      iconWrapper.className = "hourly-icon";
      const icon = document.createElement("i");
      icon.className = `fa-solid ${visual.icon}`;
      iconWrapper.appendChild(icon);

      const temp = document.createElement("span");
      temp.className = "hourly-temp";
      temp.textContent = `${Math.round(hour.temperature)}°`;

      item.appendChild(time);
      item.appendChild(iconWrapper);
      item.appendChild(temp);
      scroll.appendChild(item);
    });

    section.appendChild(title);
    section.appendChild(scroll);
    return section;
  }

  _buildDailySection(weather) {
    const section = document.createElement("div");
    section.className = "weather-section";

    const title = document.createElement("h3");
    title.className = "weather-section-title";
    const titleIcon = document.createElement("i");
    titleIcon.className = "fa-solid fa-calendar-week";
    title.appendChild(titleIcon);
    title.appendChild(document.createTextNode(" 7-Day Forecast"));

    const list = document.createElement("div");
    list.className = "forecast-list";

    weather.dailyList.forEach((day, index) => {
      const visual = getWeatherVisual(day.weatherCode);
      const dateObj = new Date(day.date);

      const row = document.createElement("div");
      row.className = index === 0 ? "forecast-day today" : "forecast-day";

      const nameWrapper = document.createElement("div");
      nameWrapper.className = "forecast-day-name";
      const dayLabel = document.createElement("span");
      dayLabel.className = "day-label";
      dayLabel.textContent =
        index === 0
          ? "Today"
          : dateObj.toLocaleString("en-US", {weekday: "short"});
      const dayDate = document.createElement("span");
      dayDate.className = "day-date";
      dayDate.textContent = dateObj.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
      });
      nameWrapper.appendChild(dayLabel);
      nameWrapper.appendChild(dayDate);

      const iconWrapper = document.createElement("div");
      iconWrapper.className = "forecast-icon";
      const icon = document.createElement("i");
      icon.className = `fa-solid ${visual.icon}`;
      iconWrapper.appendChild(icon);

      const temps = document.createElement("div");
      temps.className = "forecast-temps";
      const tempMax = document.createElement("span");
      tempMax.className = "temp-max";
      tempMax.textContent = `${Math.round(day.tempMax)}°`;
      const tempMin = document.createElement("span");
      tempMin.className = "temp-min";
      tempMin.textContent = `${Math.round(day.tempMin)}°`;
      temps.appendChild(tempMax);
      temps.appendChild(tempMin);

      const precip = document.createElement("div");
      precip.className = "forecast-precip";
      if (day.precipitationProbability > 0) {
        const precipIcon = document.createElement("i");
        precipIcon.className = "fa-solid fa-droplet";
        const precipValue = document.createElement("span");
        precipValue.textContent = `${day.precipitationProbability}%`;
        precip.appendChild(precipIcon);
        precip.appendChild(precipValue);
      }

      row.appendChild(nameWrapper);
      row.appendChild(iconWrapper);
      row.appendChild(temps);
      row.appendChild(precip);
      list.appendChild(row);
    });

    section.appendChild(title);
    section.appendChild(list);
    return section;
  }

  showEmptyState(show) {
    if (show) {
      this.emptyState?.classList.remove("hidden");
      this.container?.classList.add("hidden");
    } else {
      this.emptyState?.classList.add("hidden");
      this.container?.classList.remove("hidden");
    }
  }
}
