// =====================================================
// ------------------- NAVIGATION -------------------
// =====================================================
import Navigation from "./components/Navigation.js";
const appNavigation = new Navigation();

// =====================================================
// ------------------- COUNTRY MODEL -------------------
// =====================================================
import Country from "./models/Country.js";

// ------------------- COUNTRY LIST SERVICE ------------
import CountryListService from "./services/CountryListService.js";

const listService = new CountryListService(
  "https://date.nager.at/api/v3/AvailableCountries",
);

// ------------------- COUNTRY DETAILS SERVICE ----------
import CountryDetailsService from "./services/CountryDetailsService.js";

let selectedCountryDetails = null;
const detailsService = new CountryDetailsService(
  "rc_live_15b0a4f088574e84b7e206dd78a9a95d",
);

// ------------------- COUNTRY DROPDOWN ----------------
import CountryDropdown from "./components/CountryDropdown.js";

let isCountrySelected = false;

const countryDropdown = new CountryDropdown(
  "dropdown-trigger",
  "country-list",
  "selected-flag",
  "selected-name",
  "country-search",
  "dropdown-panel",
  "global-country",

  async (country) => {
    const details = await detailsService.fetchCountryDetilis(country.name);
    isCountrySelected = true;
    if (details) {
      selectedCountryDetails = details;

      citySelect.setCity(details.capital);
      countryFlagSelect.updateCountryDestination(details);

      const yearElement = document.getElementById("global-year");
      const selectedYear = yearElement ? yearElement.value : "2026";
      headerStatus.updateHeader(details, selectedYear);
      eventsHeaderStatus.updateHeader(details);
      weatherHeaderStatus.updateHeader(details);
      lwHeaderStatus.updateHeader(details, selectedYear);

      loadHolidays(details.code, selectedYear);
      loadEvents(details.capital);
      loadWeather(details.capitalLat, details.capitalLng, details.capital);
      loadLongWeekends(details.code, selectedYear);
      sunTimesHeaderStatus.updateHeader(details);
      loadSunTimes(details.capitalLat, details.capitalLng);
    }
  },
);

// ------------------- CITY SELECT -------------------
import CitySelectBuilder from "./components/CitySelectBuilder.js";
const citySelect = new CitySelectBuilder("global-city");

// ------------------- SELECTED DESTINATION CARD -------
import SelectedDestinationCard from "./components/SelectedDestinationCard.js";

const countryFlagSelect = new SelectedDestinationCard(
  "selected-country-flag",
  "selected-country-name",
  "selected-city-name",
);

// ------------------- CLEAR SELECTION ---------------
const closeIcon = document.getElementById("clear-selection-btn");
const selectDestination = document.getElementById("selected-destination");
const dashboardCountryInfo = document.getElementById("dashboard-country-info");
const dashboardBeforeChoiseCountry = document.getElementById(
  "dashboard-before-choise-country",
);

function clearCountrySelection() {
  closeIcon.addEventListener("click", function () {
    selectDestination.classList.add("hidden");
    dashboardCountryInfo.classList.add("hidden");
    dashboardBeforeChoiseCountry.classList.remove("hidden");
    selectedCountryDetails = null;
    isCountrySelected = false;

    holidaysRenderer.render([]);
    holidaysRenderer.showEmptyState(true);
    document.getElementById("holidays-selection")?.classList.add("hidden");

    eventsRenderer.render([]);
    document.getElementById("events-selection")?.classList.add("hidden");

    weatherRenderer.render(null);
    document.getElementById("weather-selection")?.classList.add("hidden");

    longWeekendRenderer.render([]);
    longWeekendRenderer.showEmptyState(true);
    document.getElementById("long-weekend-selection")?.classList.add("hidden");

    sunTimesRenderer.render({});
    sunTimesRenderer.showEmptyState(true);
    document.getElementById("sunTimes-selection")?.setAttribute("hidden", "");

    countryDropdown.showPlaceholderAfterClose("Select Country");
  });
}
clearCountrySelection();

// ------------------- DASHBOARD COUNTRY INFO -----------
import DashboardCountryInfoSection from "./components/DashboardCountryInfoSection.js";

const countryDetilies = new DashboardCountryInfoSection(
  "dashboard-country-info",
);

// ------------------- YEAR / EXPLORE BUTTON -------------
const yearBtn = document.getElementById("global-search-btn");

yearBtn.addEventListener("click", () => {
  if (!selectedCountryDetails) return;
  countryDetilies.updateDashboard(selectedCountryDetails);
  const yearElement = document.getElementById("global-year");
  const year = yearElement.value;
  loadHolidays(selectedCountryDetails.code, year);
  loadLongWeekends(selectedCountryDetails.code, year);
});

// ------------------- INIT ------------------------------
async function initCountryDropdown() {
  const countries = await listService.fetchCountries();
  countryDropdown.setCountries(countries);
}

initCountryDropdown();

// =====================================================
// ------------------- HOLIDAYS VIEW -------------------
// =====================================================

// ------------------- HEADER HOLIDAYS -------------- //
import HeaderStatusUpdater from "./components/HeaderStatusUpdater.js";

const headerStatus = new HeaderStatusUpdater({
  flagId: "header-selection-flag",
  nameId: "header-selection-name",
  viewSelectionId: "holidays-selection",
  yearId: "header-selection-year",
});

const year = document.getElementById("global-year");
year.addEventListener("change", (e) => {
  if (isCountrySelected) {
    headerStatus.updateHeader(selectedCountryDetails, e.target.value);
    loadHolidays(selectedCountryDetails.code, e.target.value);
    lwHeaderStatus.updateHeader(selectedCountryDetails, e.target.value);
    loadLongWeekends(selectedCountryDetails.code, e.target.value);
  } else if (headerStatus.yearEl) {
    headerStatus.yearEl.textContent = e.target.value;
  }
});

// ------------------- Holidays Model ------------------- //
import Holiday from "./models/Holiday.js";

// ------------------- Holidays List Service ------------ //
import HolidaysListService from "./services/HolidaysListService.js";

// ------------------- Holidays Renderer ----------------- //
import HolidaysRenderer from "./components/HolidaysRenderer.js";

// ------------------- Instances + Loader ---------------- //
const holidaysRenderer = new HolidaysRenderer(
  "holidays-content",
  "empty-state",
);

async function loadHolidays(countryCode, year) {
  if (!countryCode || !year) return;

  const holidaysService = new HolidaysListService(year, countryCode);
  const holidaysData = await holidaysService.fetchHolidays();

  holidaysRenderer.render(holidaysData);
}

// =====================================================
// ------------------- EVENTS VIEW -------------------
// =====================================================

// ------------------- Header Updater ------------------- //
const eventsHeaderStatus = new HeaderStatusUpdater({
  flagId: "events-header-flag",
  nameId: "events-header-name",
  viewSelectionId: "events-selection",
  cityTextId: "events-header-city",
  cityBadgeId: "events-header-city-badge",
});

// ------------------- Event Model ------------------- //
import Event from "./models/Event.js";

// ------------------- Events Service ---------------- //
import EventsService from "./services/EventsService.js";

// ------------------- Events Renderer --------------- //
import EventsRenderer from "./components/EventsRenderer.js";

// ------------------- Instances + Loader ------------ //
const eventsRenderer = new EventsRenderer(
  "events-content",
  "empty-state-event",
  wireHeartButton,
);

const eventsService = new EventsService("yjWPvhAV1AYjFAIYX9mewojp9BxVFMWq");

async function loadEvents(cityName) {
  if (!cityName) return;

  const eventsData = await eventsService.fetchEvents(cityName);
  eventsRenderer.render(eventsData, cityName);
}

window.loadEvents = loadEvents;

// =====================================================
// ------------------- WEATHER VIEW -------------------
// =====================================================
import WeatherHeaderUpdater from "./components/WeatherHeaderUpdater.js";
import WeatherService from "./services/WeatherService.js";
import WeatherRenderer from "./components/WeatherRenderer.js";

const weatherHeaderStatus = new WeatherHeaderUpdater(
  "weather-header-flag",
  "weather-header-name",
  "weather-header-city",
  "weather-header-city-badge",
  "weather-selection",
);

const weatherRenderer = new WeatherRenderer(
  "weather-content",
  "empty-state-weather",
);

const weatherService = new WeatherService(
  "https://api.open-meteo.com/v1/forecast",
);

async function loadWeather(lat, lng, cityName) {
  if (!lat || !lng) return;

  const weatherData = await weatherService.fetchWeather(lat, lng, cityName);
  weatherRenderer.render(weatherData);
}

window.loadWeather = loadWeather;

// =====================================================
// ------------------- LONG WEEKENDS VIEW -------------------
// =====================================================
import LongWeekendHeaderUpdater from "./components/LongWeekendHeaderUpdater.js";
import LongWeekendRenderer from "./components/LongWeekendRenderer.js";
import LongWeekendListService from "./services/LongWeekendListService.js";
import {wireHeartButton} from "./utils/helpers.js";

const lwHeaderStatus = new LongWeekendHeaderUpdater(
  "lw-header-flag",
  "lw-header-name",
  "lw-header-year",
  "long-weekend-selection",
);

const longWeekendRenderer = new LongWeekendRenderer(
  "lw-content",
  "empty-state-lw",
  wireHeartButton,
);

async function loadLongWeekends(countryCode, year) {
  if (!countryCode || !year) return;

  const lwService = new LongWeekendListService(year, countryCode);
  const lwData = await lwService.fetchLongWeekends();

  longWeekendRenderer.render(lwData);
}

window.loadLongWeekends = loadLongWeekends;

// =====================================================
// ------------------- CURRENCY CONVERTER --------------
// =====================================================
import CurrencyService from "./services/CurrencyService.js";
import CurrencyConverter from "./components/CurrencyConverter.js";

const currencyService = new CurrencyService("aebdec43cdb4ed019f7a3443");

const currencyConverter = new CurrencyConverter({
  service: currencyService,
  amountInputId: "currency-amount",
  fromSelectId: "currency-from",
  toSelectId: "currency-to",
  swapBtnId: "swap-currencies-btn",
  convertBtnId: "convert-btn",
  resultContainerId: "currency-result",
  popularGridId: "popular-currencies",
});

currencyConverter.convert();

// =====================================================
// ----------- SUN TIMES HEADER UPDATER ---------------
// =====================================================
import SunTimesHeaderUpdater from "./components/SunTimesHeaderUpdater.js";

const sunTimesHeaderStatus = new SunTimesHeaderUpdater(
  "sunTimes-header-flag",
  "sunTimes-header-name",
  "sunTimes-header-city",
  "sunTimes-header-city-badge",
  "sunTimes-selection",
);

// =====================================================
// ----------- SUN TIMES RENDERER ----------------------
// =====================================================
class SunTimesRenderer {
  constructor() {
    this.viewSection = document.getElementById("sun-times-view");
    this.container = document.getElementById("sun-times-content");
    this.emptyState = this.viewSection?.querySelector(".empty-state");
    this.dashboardBtn = document.getElementById("go-Dashboard-SunTimes");

    this.headerCity = document.getElementById("sunTimes-header-city");
    this.headerFlag = document.getElementById("sunTimes-header-flag");
    this.headerName = document.getElementById("sunTimes-header-name");
    this.headerCityBadge = document.getElementById(
      "sunTimes-header-city-badge",
    );
    this.headerSelection = document.getElementById("sunTimes-selection");

    this.mainLocationTitle = this.container?.querySelector(".sun-location h2");
    this.displayDate = this.container?.querySelector(".sun-date-display .date");
    this.displayDay = this.container?.querySelector(".sun-date-display .day");

    this.cards = {
      dawn: this.container?.querySelector(".sun-time-card.dawn .time"),
      sunrise: this.container?.querySelector(".sun-time-card.sunrise .time"),
      noon: this.container?.querySelector(".sun-time-card.noon .time"),
      sunset: this.container?.querySelector(".sun-time-card.sunset .time"),
      dusk: this.container?.querySelector(".sun-time-card.dusk .time"),
      daylight: this.container?.querySelector(".sun-time-card.daylight .time"),
    };

    this.progressBarFill = this.container?.querySelector(".day-progress-fill");
    this.statDaylight = this.container?.querySelector(
      ".day-length-stats .day-stat:nth-child(1) .value",
    );
    this.statPercentage = this.container?.querySelector(
      ".day-length-stats .day-stat:nth-child(2) .value",
    );
    this.statDarkness = this.container?.querySelector(
      ".day-length-stats .day-stat:nth-child(3) .value",
    );

    this.initEvents();
  }

  initEvents() {
    this.dashboardBtn?.addEventListener("click", () => {
      const dashboardTab =
        document.querySelector('[data-view="dashboard"]') ||
        document.getElementById("dashboard-tab");
      dashboardTab?.click();
    });
  }

  updateView(sunData) {
    if (!sunData || Object.keys(sunData).length === 0) {
      this.showEmptyState(true);
      return;
    }

    this.showEmptyState(false);
    this.updateHeaderUI();
    this.render(sunData);
  }

  updateHeaderUI() {
    this.headerSelection?.classList.remove("hidden");

    const city = selectedCountryDetails?.capital || "--";
    const countryName = selectedCountryDetails?.commonName || "--";
    const countryCode = selectedCountryDetails?.code || "";

    if (this.headerCity) this.headerCity.textContent = city;
    if (this.headerName) this.headerName.textContent = countryName;
    if (this.headerCityBadge) this.headerCityBadge.textContent = `• ${city}`;

    if (this.headerFlag && countryCode) {
      this.headerFlag.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
      this.headerFlag.alt = countryName;
    }
  }

  render(sunData) {
    const city = selectedCountryDetails?.capital || "--";

    if (this.mainLocationTitle) {
      this.mainLocationTitle.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${city}`;
    }

    const today = new Date();
    if (this.displayDate) {
      this.displayDate.textContent = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (this.displayDay) {
      this.displayDay.textContent = today.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    if (this.cards.dawn)
      this.cards.dawn.textContent = sunData.dawn || "--:-- --";
    if (this.cards.sunrise)
      this.cards.sunrise.textContent = sunData.sunrise || "--:-- --";
    if (this.cards.noon)
      this.cards.noon.textContent = sunData.solarNoon || "--:-- --";
    if (this.cards.sunset)
      this.cards.sunset.textContent = sunData.sunset || "--:-- --";
    if (this.cards.dusk)
      this.cards.dusk.textContent = sunData.dusk || "--:-- --";
    if (this.cards.daylight)
      this.cards.daylight.textContent = sunData.dayLengthString || "--h --m";

    if (this.progressBarFill)
      this.progressBarFill.style.width = `${sunData.daylightPercentage}%`;
    if (this.statDaylight)
      this.statDaylight.textContent = sunData.dayLengthString || "--h --m";
    if (this.statPercentage)
      this.statPercentage.textContent = `${sunData.daylightPercentage}%`;
    if (this.statDarkness)
      this.statDarkness.textContent = sunData.darknessString || "--h --m";
  }

  showEmptyState(show) {
    if (show) {
      this.emptyState?.classList.remove("hidden");
      this.container?.classList.add("hidden");
      this.headerSelection?.classList.add("hidden");
    } else {
      this.emptyState?.classList.add("hidden");
      this.container?.classList.remove("hidden");
    }
  }
}

const sunTimesRenderer = new SunTimesRenderer();

// =====================================================
// ----------- SUN TIMES API LOADER --------------------
// =====================================================
async function loadSunTimes(lat, lng) {
  if (!lat || !lng) return;

  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=1`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.status !== "OK") {
      console.error("Sunrise-Sunset API error status:", result.status);
      sunTimesRenderer.showEmptyState(true);
      return;
    }

    const data = result.results;

    // day_length comes back as "HH:MM:SS"
    const [hoursStr, minutesStr] = data.day_length.split(":");
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;

    const totalDaylightMinutes = hours * 60 + minutes;
    const daylightPercentage = ((totalDaylightMinutes / 1440) * 100).toFixed(1);

    const totalDarknessMinutes = 1440 - totalDaylightMinutes;
    const darkHours = Math.floor(totalDarknessMinutes / 60);
    const darkMinutes = totalDarknessMinutes % 60;

    const sunData = {
      dawn: data.civil_twilight_begin,
      sunrise: data.sunrise,
      solarNoon: data.solar_noon,
      sunset: data.sunset,
      dusk: data.civil_twilight_end,
      dayLengthString: `${hours}h ${minutes}m`,
      daylightPercentage: daylightPercentage,
      darknessString: `${darkHours}h ${darkMinutes}m`,
    };

    sunTimesRenderer.updateView(sunData);
  } catch (error) {
    console.error("Error loading sun times data:", error);
    sunTimesRenderer.showEmptyState(true);
  }
}

// =====================================================
// ------------------- MY PLANS ------------------------
// =====================================================
import {updatePlansIndicators} from "./utils/helpers.js";
import MyPlansRenderer from "./components/MyPlansRenderer.js";
import plansStore from "./store/PlansStore.js";

const myPlansRenderer = new MyPlansRenderer("plans-content", appNavigation);
myPlansRenderer.render();

plansStore.onChange(() => {
  updatePlansIndicators();
  if (typeof myPlansRenderer !== "undefined") {
    myPlansRenderer.render();
  }
});

updatePlansIndicators();
