// ------------------- NAVIGATION -------------------
import Navigation from "./components/Navigation.js";
const appNavigation = new Navigation();

// =====================================================
// ------------------- COUNTRY MODEL -------------------
// =====================================================

class Country {
  constructor(
    commonName,
    officialName,
    capital,
    region,
    subregion,
    code,
    flag,
    area,
    callingCode,
    drivingSide,
    startOfWeek,
    languages,
    currencies,
    googleMaps,
    symbol,
    borders,
    timezones,
    population,
    capitalLat,
    capitalLng,
  ) {
    this.commonName = commonName;
    this.officialName = officialName;
    this.capital = capital;
    this.region = region;
    this.subregion = subregion;
    this.code = code;
    this.flag = flag;
    this.area = area;
    this.callingCode = callingCode;
    this.drivingSide = drivingSide;
    this.startOfWeek = startOfWeek;
    this.languages = languages;
    this.currencies = currencies;
    this.symbol = symbol;
    this.googleMaps = googleMaps;
    this.borders = borders;
    this.timezones = timezones;
    this.population = population;
    this.capitalLat = capitalLat;
    this.capitalLng = capitalLng;
  }
}

// =====================================================
// ------------------- COUNTRY LIST SERVICE -------------------
// =====================================================
// Responsible for fetching the full list of countries (Nager.Date + FlagCDN)

class CountryListService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchCountries() {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.map((item) => ({
        code: item.countryCode,
        name: item.name,
        flag: `https://flagcdn.com/w40/${item.countryCode.toLowerCase()}.png`,
      }));
    } catch (error) {
      console.error("Error fetching countries list:", error);
      return [];
    }
  }
}
const listService = new CountryListService(
  "https://date.nager.at/api/v3/AvailableCountries",
);

// =====================================================
// ------------------- COUNTRY DETAILS SERVICE -------------------
// =====================================================
// Responsible for fetching full details of a single country (REST Countries)

class CountryDetailsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchCountryDetilis(countryName) {
    try {
      const url = `https://api.restcountries.com/countries/v5/names.common/${countryName}?pretty=1`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const result = await response.json();

      let name = result.data.objects[0].names.common;
      let langCode = result.data.objects[0].languages[0].iso639_3;
      let officialName =
        result.data.objects[0].names.native[langCode]?.official ||
        result.data.objects[0].names.common;
      let capital = result.data.objects[0].capitals[0].name;
      let region = result.data.objects[0].region;
      let subregion = result.data.objects[0].subregion;
      let code = result.data.objects[0].codes.alpha_2;
      let flag = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
      let area = result.data.objects[0].area.kilometers;
      let callingCode = result.data.objects[0].calling_codes[0];
      let drivingSide = result.data.objects[0].cars.driving_side;
      let startOfWeek = result.data.objects[0].date.start_of_week;
      let population = result.data.objects[0].population;
      let borders = result.data.objects[0].borders;
      let timezones = result.data.objects[0].timezones;
      let languages = result.data.objects[0].languages.map((lang) => lang.name);
      let currencies = result.data.objects[0].currencies[0].name;
      let symbol = result.data.objects[0].currencies[0].symbol;
      let googleMaps = result.data.objects[0].links.google_maps;
      let capitalLat = result.data.objects[0].capitals[0].coordinates.lat;
      let capitalLng = result.data.objects[0].capitals[0].coordinates.lng;

      const country = new Country(
        name,
        officialName,
        capital,
        region,
        subregion,
        code,
        flag,
        area,
        callingCode,
        drivingSide,
        startOfWeek,
        languages,
        currencies,
        googleMaps,
        symbol,
        borders,
        timezones,
        population,
        capitalLat,
        capitalLng,
      );

      console.log(country);
      return country;
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  }
}
let selectedCountryDetails = null;
const detailsService = new CountryDetailsService(
  "rc_live_8c918b0d4cdf41e9b945fb461d9fc49e",
);

// =====================================================
// ------------------- COUNTRY DROPDOWN -------------------
// =====================================================

let isCountrySelected = false;
console.log(isCountrySelected);

class CountryDropdown {
  constructor(
    triggerId,
    listId,
    selectedFlagId,
    selectedNameId,
    searchId,
    panelId,
    hiddenInputId,
    onSelect,
  ) {
    this.trigger = document.getElementById(triggerId);
    this.listEl = document.getElementById(listId);
    this.selectedFlagImg = document.getElementById(selectedFlagId);
    this.selectedNameEl = document.getElementById(selectedNameId);
    this.searchInput = document.getElementById(searchId);
    this.panel = document.getElementById(panelId);
    this.hiddenInput = document.getElementById(hiddenInputId);
    this.onSelect = onSelect;

    this.countries = [];
    this._bindEvents();
    this._renderList("");
  }

  _bindEvents() {
    this.trigger.addEventListener("click", () => {
      this._togglePanel();
    });
    this.searchInput.addEventListener("input", (e) => {
      this._renderList(e.target.value);
    });
    document.addEventListener("click", (e) => {
      if (!this.trigger.closest(".country-dropdown").contains(e.target)) {
        this._closePanel();
      }
    });
  }

  _closePanel() {
    this.panel.setAttribute("hidden", "");
  }

  _togglePanel() {
    const ishidden = this.panel.hidden;

    if (ishidden) {
      this.panel.removeAttribute("hidden");
      this.searchInput.value = "";
      this._renderList("");
      this.searchInput.focus();
    } else {
      this.panel.setAttribute("hidden", "");
    }
  }

  setCountries(countries) {
    this.countries = countries;
    this._renderList("");
  }

  // Special method => search by name
  _renderList(query = "") {
    const filtered = this.countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );

    this.listEl.innerHTML = "";

    filtered.forEach((country) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${country.flag}"  />
        <span>${country.name}</span>
        <span class="country-code">${country.code}</span>
      `;
      li.addEventListener("click", () => {
        this._selectCountry(country);
        this._closePanel();
      });
      this.listEl.appendChild(li);
    });
  }

  _selectCountry(country) {
    this.selectedFlagImg.src = country.flag;
    this.selectedFlagImg.style.display = "inline-block";
    this.selectedNameEl && (this.selectedNameEl.textContent = country.name);
    // Important for updates => callback
    if (typeof this.onSelect === "function") this.onSelect(country);
  }

  showPlaceholderAfterClose(text = "Select Country") {
    this.selectedNameEl.textContent = text;
    this.selectedFlagImg.src = "";
    this.selectedFlagImg.style.display = "none";
  }
}

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
    console.log(isCountrySelected);
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
      SunTimesHeaderStatus.updateHeader(details);
      loadSunTimes(details.capitalLat, details.capitalLng);
    }
  },
);

// =====================================================
// ------------------- CITY SELECT -------------------
// =====================================================

class CitySelectBuilder {
  constructor(selectElementId) {
    this.cityInput = document.getElementById(selectElementId);
  }
  setCity(capitalName) {
    this.cityInput.innerHTML = "";
    const option = document.createElement("option");
    option.value = capitalName;
    option.textContent = capitalName;
    this.cityInput.appendChild(option);
  }
}
const citySelect = new CitySelectBuilder("global-city");

// =====================================================
// ------------------- SELECTED DESTINATION CARD -------------------
// =====================================================

class SelectedDestinationCard {
  constructor(flagId, countryNameId, cityNameId) {
    this.flagImg = document.getElementById(flagId);
    this.countryNameEl = document.getElementById(countryNameId);
    this.cityNameEl = document.getElementById(cityNameId);
  }

  updateCountryDestination(country) {
    selectDestination.classList.remove("hidden");
    dashboardBeforeChoiseCountry.classList.add("hidden");

    this.flagImg.src = country.flag;
    this.countryNameEl.textContent = country.commonName;
    this.cityNameEl.textContent = `• ${country.capital}`;
  }
}
const countryFlagSelect = new SelectedDestinationCard(
  "selected-country-flag",
  "selected-country-name",
  "selected-city-name",
);

// =====================================================
// ------------------- CLEAR SELECTION -------------------
// =====================================================

let closeIcon = document.getElementById("clear-selection-btn");
let selectDestination = document.getElementById("selected-destination");
let dashboardCountryInfo = document.getElementById("dashboard-country-info");
let dashboardBeforeChoiseCountry = document.getElementById(
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
    const viewHeaderSelection = document.getElementById("holidays-selection");
    if (viewHeaderSelection) {
      viewHeaderSelection.classList.add("hidden");
    }

    eventsRenderer.render([]);
    const eventsHeaderSelection = document.getElementById("events-selection");
    if (eventsHeaderSelection) {
      eventsHeaderSelection.classList.add("hidden");
    }

    weatherRenderer.render(null);
    const weatherHeaderSelection = document.getElementById("weather-selection");
    if (weatherHeaderSelection) {
      weatherHeaderSelection.classList.add("hidden");
    }

    longWeekendRenderer.render([]);
    longWeekendRenderer.showEmptyState(true);
    const lwHeaderSelection = document.getElementById("long-weekend-selection");
    if (lwHeaderSelection) {
      lwHeaderSelection.classList.add("hidden");
    }
    sunTimesRenderer.render({});
    sunTimesRenderer.showEmptyState(true);
    document.getElementById("sunTimes-selection")?.setAttribute("hidden", "");

    countryDropdown.showPlaceholderAfterClose("Select Country");
  });
}
clearCountrySelection();

// =====================================================
// ------------------- DASHBOARD COUNTRY INFO -------------------
// =====================================================

class DashboardCountryInfoSection {
  constructor(dashboardCountryId) {
    this.dashboard = document.getElementById(dashboardCountryId);

    this.flagImg = this.dashboard?.querySelector('[data-field="flag"]');
    this.commonNameEl = this.dashboard?.querySelector('[data-field="name"]');
    this.officialNameEl = this.dashboard?.querySelector(
      '[data-field="official"]',
    );
    this.capitalEl = this.dashboard?.querySelector('[data-field="capital"]');
    this.regionEl = this.dashboard?.querySelector('[data-field="region"]');
    this.continentEl = this.dashboard?.querySelector(
      '[data-field="continent"]',
    );
    this.subregionEl = this.dashboard?.querySelector(
      '[data-field="subregion"]',
    );

    this.populationEl = this.dashboard?.querySelector(
      '[data-field="population"]',
    );
    this.areaEl = this.dashboard?.querySelector('[data-field="area"]');

    this.callingCodeEl = this.dashboard?.querySelector(
      '[data-field="calling-code"]',
    );
    this.drivingSideEl = this.dashboard?.querySelector(
      '[data-field="driving-side"]',
    );
    this.startOfWeekEl = this.dashboard?.querySelector(
      '[data-field="week-start"]',
    );
    this.languagesEl = this.dashboard?.querySelector(
      '[data-field="languages"]',
    );
    this.currenciesEl = this.dashboard?.querySelector(
      '[data-field="currency"]',
    );
    this.symbolEl = this.dashboard?.querySelector('[data-field="symbol"]');
    this.bordersEl = this.dashboard?.querySelector('[data-field="neighbors"]');
    this.timezonesEl = this.dashboard?.querySelector('[data-field="timezone"]');
    this.googleMapsLink = this.dashboard?.querySelector(
      '[data-field="maps-link"]',
    );
  }

  updateDashboard(country) {
    this.dashboard.classList.remove("hidden");

    this.flagImg &&
      ((this.flagImg.src = country.flag),
      (this.flagImg.alt = country.commonName));

    this.commonNameEl && (this.commonNameEl.textContent = country.commonName);
    this.officialNameEl &&
      (this.officialNameEl.textContent = country.officialName);
    this.capitalEl && (this.capitalEl.textContent = country.capital);
    this.regionEl && (this.regionEl.textContent = country.region);
    this.continentEl && (this.continentEl.textContent = country.region);
    this.subregionEl && (this.subregionEl.textContent = country.subregion);

    this.populationEl &&
      (this.populationEl.textContent = Number(
        country.population,
      ).toLocaleString());
    this.areaEl &&
      (this.areaEl.textContent = `${Number(country.area).toLocaleString()} km²`);

    this.callingCodeEl &&
      (this.callingCodeEl.textContent = `+${country.callingCode}`);
    this.drivingSideEl &&
      (this.drivingSideEl.textContent = country.drivingSide);
    this.startOfWeekEl &&
      (this.startOfWeekEl.textContent = country.startOfWeek);
    this.currenciesEl &&
      (this.currenciesEl.textContent = `${country.currencies} (${country.symbol})`);
    this.languagesEl &&
      (this.languagesEl.textContent = Array.isArray(country.languages)
        ? country.languages.join(", ")
        : country.languages);

    this.bordersEl &&
      (this.bordersEl.textContent =
        Array.isArray(country.borders) && country.borders.length
          ? country.borders.join(", ")
          : "No neighboring countries");

    this.timezonesEl &&
      (this.timezonesEl.textContent = (() => {
        if (
          !Array.isArray(country.timezones) ||
          country.timezones.length <= 2
        ) {
          return Array.isArray(country.timezones)
            ? country.timezones.join(", ")
            : country.timezones;
        }
        const firstTwo = country.timezones.slice(0, 2).join(", ");
        const remainingCount = country.timezones.length - 2;
        return `${firstTwo} (+${remainingCount})`;
      })());

    this.googleMapsLink &&
      country.googleMaps &&
      (this.googleMapsLink.href = country.googleMaps);
  }
}
const countryDetilies = new DashboardCountryInfoSection(
  "dashboard-country-info",
);

// =====================================================
// ------------------- YEAR / EXPLORE BUTTON -------------------
// =====================================================

const yearBtn = document.getElementById("global-search-btn");

yearBtn.addEventListener("click", () => {
  countryDetilies.updateDashboard(selectedCountryDetails);
  const yearElement = document.getElementById("global-year");
  const year = yearElement.value;
  loadHolidays(selectedCountryDetails.code, year);
  loadLongWeekends(selectedCountryDetails.code, year);
});

// =====================================================
// ------------------- INIT -------------------
// =====================================================

async function initCountryDropdown() {
  const countries = await listService.fetchCountries();
  countryDropdown.setCountries(countries);
}

initCountryDropdown();

// =====================================================
// ------------------- HOLIDAYS VIEW -------------------
// =====================================================

// ------------------- Header Status ------------------- //
class HeaderStatusUpdater {
  constructor(flagId, nameId, yearId, viewHeaderSelectionId) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.yearEl = document.getElementById(yearId);
    this.viewHeaderSelection = document.getElementById(viewHeaderSelectionId);
  }

  updateHeader(country, year) {
    if (this.yearEl && year) {
      this.yearEl.textContent = year;
    }
    this.viewHeaderSelection?.classList.remove("hidden");
    this.flagImg.src = country.flag;
    this.nameEl.textContent = country.commonName;
  }
}

const headerStatus = new HeaderStatusUpdater(
  "header-selection-flag",
  "header-selection-name",
  "header-selection-year",
  "holidays-selection",
);
const year = document.getElementById("global-year");
year.addEventListener("change", (e) => {
  if (isCountrySelected) {
    headerStatus.updateHeader(selectedCountryDetails, e.target.value);
    loadHolidays(selectedCountryDetails.code, e.target.value);
    lwHeaderStatus.updateHeader(selectedCountryDetails, e.target.value);
    loadLongWeekends(selectedCountryDetails.code, e.target.value);
  } else {
    headerStatus.yearEl.textContent = e.target.value;
  }
});

// ------------------- Holidays Model ------------------- //
class Holidays {
  constructor(date, localName, name, types) {
    this.date = date;
    this.localName = localName;
    this.name = name;
    this.types = types;
  }
}

// ------------------- Holidays List Service ------------------- //
class HolidaysListService {
  constructor(year, countryCode) {
    this.year = year;
    this.countryCode = countryCode;
  }

  async fetchHolidays() {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${this.year}/${this.countryCode}`,
      );
      const result = await response.json();
      return result.map(
        (item) =>
          new Holidays(item.date, item.localName, item.name, item.types),
      );
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  }
}

// ------------------- Holidays Renderer ------------------- //
class HolidaysRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
  }

  render(holidaysList) {
    this.container.innerHTML = "";

    this.showEmptyState(false);

    holidaysList.forEach((holiday) => {
      const holidayDate = new Date(holiday.date);
      const day = holidayDate.getDate();
      const month = holidayDate.toLocaleString("en-US", {month: "short"});
      const dayName = holidayDate.toLocaleString("en-US", {weekday: "long"});

      const holidayType =
        holiday.types && holiday.types.length > 0 ? holiday.types[0] : "Public";

      const card = document.createElement("div");
      card.className = "holiday-card";
      card.innerHTML = `
        <div class="holiday-card-header">
          <div class="holiday-date-box">
            <span class="day">${day}</span><span class="month">${month}</span>
          </div>
          <button class="holiday-action-btn">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <h3>${holiday.localName}</h3>
        <p class="holiday-name">${holiday.name}</p>
        <div class="holiday-card-footer">
          <span class="holiday-day-badge">
            <i class="fa-regular fa-calendar"></i> ${dayName}
          </span>
          <span class="holiday-type-badge">${holidayType}</span>
        </div>
      `;

      const heartBtn = card.querySelector(".holiday-action-btn");
      wireHeartButton({
        btn: heartBtn,
        cardEl: card,
        plan: {
          id: `holiday-${holiday.date}-${holiday.name}`,
          type: "holiday",
          title: holiday.localName,
          subtitle: holiday.name,
          date: `${dayName}, ${month} ${day}`,
        },
      });

      this.container.appendChild(card);
    });
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

// ------------------- Instances + Loader ------------------- //
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
class EventsHeaderUpdater {
  constructor(flagId, nameId, cityTextId, cityBadgeId, viewHeaderSelectionId) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.cityTextEl = document.getElementById(cityTextId);
    this.cityBadgeEl = document.getElementById(cityBadgeId);
    this.viewHeaderSelection = document.getElementById(viewHeaderSelectionId);
  }

  updateHeader(country) {
    this.viewHeaderSelection?.classList.remove("hidden");
    if (this.flagImg) this.flagImg.src = country.flag;
    if (this.nameEl) this.nameEl.textContent = country.commonName;
    if (this.cityTextEl) this.cityTextEl.textContent = country.capital;
    if (this.cityBadgeEl) this.cityBadgeEl.textContent = `• ${country.capital}`;
  }
}

const eventsHeaderStatus = new EventsHeaderUpdater(
  "events-header-flag",
  "events-header-name",
  "events-header-city",
  "events-header-city-badge",
  "events-selection",
);

// ------------------- Event Model ------------------- //
class Event {
  constructor(
    name,
    date,
    time,
    venueName,
    cityName,
    imageUrl,
    category,
    ticketUrl,
  ) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.venueName = venueName;
    this.cityName = cityName;
    this.imageUrl = imageUrl;
    this.category = category;
    this.ticketUrl = ticketUrl;
  }
}

// ------------------- Events Service ------------------- //

class EventsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchEvents(cityName) {
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${this.apiKey}&city=${encodeURIComponent(cityName)}&size=8`;
      const response = await fetch(url);
      const result = await response.json();
      console.log("Ticketmaster raw response:", result);

      if (!result._embedded || !result._embedded.events) {
        return [];
      }

      return result._embedded.events.map((item) => {
        const venue = item._embedded?.venues?.[0];
        return new Event(
          item.name,
          item.dates?.start?.localDate || "",
          item.dates?.start?.localTime || "",
          venue?.name || "Unknown venue",
          venue?.city?.name || cityName,
          item.images?.[0]?.url || "",
          item.classifications?.[0]?.segment?.name || "Event",
          item.url || "#",
        );
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
}

// ------------------- Events Renderer ------------------- //
class EventsRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
    this.emptyStateTitle = document.getElementById("empty-state-event-title");
    this.emptyStateText = document.getElementById("empty-state-event-text");
  }

  render(eventsList, cityName = "") {
    this.container.replaceChildren();

    if (eventsList.length === 0) {
      if (cityName) {
        this._setEmptyMessage(
          "No Events Found",
          `We couldn't find any events in ${cityName} right now. Try another destination.`,
        );
      } else {
        this._setEmptyMessage(
          "No City Selected",
          "Select a country and city from the dashboard to discover events",
        );
      }
      this.showEmptyState(true);
    } else {
      this.showEmptyState(false);
      eventsList.forEach((event) => {
        const card = this._buildEventCard(event);
        this.container.appendChild(card);
      });
    }
  }

  _setEmptyMessage(title, text) {
    if (this.emptyStateTitle) this.emptyStateTitle.textContent = title;
    if (this.emptyStateText) this.emptyStateText.textContent = text;
  }

  _buildEventCard(event) {
    const card = document.createElement("div");
    card.className = "event-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "event-card-image";

    const img = document.createElement("img");
    img.src = event.imageUrl;
    img.alt = event.name;

    const categorySpan = document.createElement("span");
    categorySpan.className = "event-card-category";
    categorySpan.textContent = event.category;

    const saveBtn = document.createElement("button");
    saveBtn.className = "event-card-save";
    const heartIcon = document.createElement("i");
    heartIcon.className = "fa-regular fa-heart";
    saveBtn.appendChild(heartIcon);

    wireHeartButton({
      btn: saveBtn,
      cardEl: card,
      plan: {
        id: `event-${event.name}-${event.date}`,
        type: "event",
        title: event.name,
        subtitle: event.venueName || event.category,
        date: `${event.date} ${event.time ? "at " + event.time : ""}`,
      },
    });

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(categorySpan);
    imageWrapper.appendChild(saveBtn);

    // ---- content section (title + info + buttons) ----
    const body = document.createElement("div");
    body.className = "event-card-body";

    const title = document.createElement("h3");
    title.textContent = event.name;

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "event-card-info";

    const dateLine = document.createElement("div");
    const calendarIcon = document.createElement("i");
    calendarIcon.className = "fa-regular fa-calendar";
    dateLine.appendChild(calendarIcon);
    dateLine.appendChild(
      document.createTextNode(
        ` ${event.date} ${event.time ? "at " + event.time : ""}`,
      ),
    );

    const locationLine = document.createElement("div");
    const locationIcon = document.createElement("i");
    locationIcon.className = "fa-solid fa-location-dot";
    locationLine.appendChild(locationIcon);
    locationLine.appendChild(
      document.createTextNode(` ${event.venueName}, ${event.cityName}`),
    );

    infoWrapper.appendChild(dateLine);
    infoWrapper.appendChild(locationLine);

    const footer = document.createElement("div");
    footer.className = "event-card-footer";

    const saveTextBtn = document.createElement("button");
    saveTextBtn.className = "btn-event";
    const saveTextIcon = document.createElement("i");
    saveTextIcon.className = "fa-regular fa-heart";
    saveTextBtn.appendChild(saveTextIcon);
    saveTextBtn.appendChild(document.createTextNode(" Save"));

    // ربط زر النص أيضاً بنفس الدالة والبيانات ليعملا معاً بشكل متناسق
    wireHeartButton({
      btn: saveTextBtn,
      cardEl: card,
      plan: {
        id: `event-${event.name}-${event.date}`,
        type: "event",
        title: event.name,
        subtitle: event.venueName || event.category,
        date: `${event.date} ${event.time ? "at " + event.time : ""}`,
      },
    });

    const buyLink = document.createElement("a");
    buyLink.href = event.ticketUrl;
    buyLink.target = "_blank";
    buyLink.className = "btn-buy-ticket";
    const ticketIcon = document.createElement("i");
    ticketIcon.className = "fa-solid fa-ticket";
    buyLink.appendChild(ticketIcon);
    buyLink.appendChild(document.createTextNode(" Buy Tickets"));

    footer.appendChild(saveTextBtn);
    footer.appendChild(buyLink);

    body.appendChild(title);
    body.appendChild(infoWrapper);
    body.appendChild(footer);

    // ---- assemble the full card ----
    card.appendChild(imageWrapper);
    card.appendChild(body);

    return card;
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

// ------------------- Instances + Loader ------------------- //
const eventsRenderer = new EventsRenderer(
  "events-content",
  "empty-state-event",
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

// ------------------- Header Updater ------------------- //
class WeatherHeaderUpdater {
  constructor(flagId, nameId, cityTextId, cityBadgeId, viewHeaderSelectionId) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.cityTextEl = document.getElementById(cityTextId);
    this.cityBadgeEl = document.getElementById(cityBadgeId);
    this.viewHeaderSelection = document.getElementById(viewHeaderSelectionId);
  }

  updateHeader(country) {
    this.viewHeaderSelection?.classList.remove("hidden");
    if (this.flagImg) this.flagImg.src = country.flag;
    if (this.nameEl) this.nameEl.textContent = country.commonName;
    if (this.cityTextEl) this.cityTextEl.textContent = country.capital;
    if (this.cityBadgeEl) this.cityBadgeEl.textContent = `• ${country.capital}`;
  }
}

const weatherHeaderStatus = new WeatherHeaderUpdater(
  "weather-header-flag",
  "weather-header-name",
  "weather-header-city",
  "weather-header-city-badge",
  "weather-selection",
);

// ------------------- Weather Code Helper ------------------- //
// Maps Open-Meteo's WMO weather codes to a Font Awesome icon + a label
function getWeatherVisual(code) {
  if (code === 0) return {icon: "fa-sun", label: "Clear sky"};
  if ([1, 2, 3].includes(code))
    return {icon: "fa-cloud-sun", label: "Partly cloudy"};
  if ([45, 48].includes(code)) return {icon: "fa-smog", label: "Fog"};
  if ([51, 53, 55, 56, 57].includes(code))
    return {icon: "fa-cloud-drizzle", label: "Drizzle"};
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return {icon: "fa-cloud-rain", label: "Rain"};
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return {icon: "fa-snowflake", label: "Snow"};
  if ([95, 96, 99].includes(code))
    return {icon: "fa-cloud-bolt", label: "Thunderstorm"};
  return {icon: "fa-cloud", label: "Cloudy"};
}

// ------------------- Weather Models ------------------- //
class HourlyForecast {
  constructor(time, temperature, weatherCode) {
    this.time = time;
    this.temperature = temperature;
    this.weatherCode = weatherCode;
  }
}

class DailyForecast {
  constructor(date, tempMax, tempMin, weatherCode, precipitationProbability) {
    this.date = date;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.weatherCode = weatherCode;
    this.precipitationProbability = precipitationProbability;
  }
}

class Weather {
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

// ------------------- Weather Service ------------------- //
// Responsible for fetching the forecast from Open-Meteo for given coordinates
class WeatherService {
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

      // Build the next 8 hours starting from the current hour
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

// ------------------- Weather Renderer ------------------- //

class WeatherRenderer {
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

// ------------------- Instances + Loader ------------------- //
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

// ------------------- Header Status ------------------- //
class LongWeekendHeaderUpdater {
  constructor(flagId, nameId, yearId, viewHeaderSelectionId) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.yearEl = document.getElementById(yearId);
    this.viewHeaderSelection = document.getElementById(viewHeaderSelectionId);
  }

  updateHeader(country, year) {
    this.viewHeaderSelection?.classList.remove("hidden");
    if (this.yearEl && year) this.yearEl.textContent = year;
    if (this.flagImg) this.flagImg.src = country.flag;
    if (this.nameEl) this.nameEl.textContent = country.commonName;
  }
}

const lwHeaderStatus = new LongWeekendHeaderUpdater(
  "lw-header-flag",
  "lw-header-name",
  "lw-header-year",
  "long-weekend-selection",
);

// ------------------- Long Weekend Model ------------------- //
class LongWeekend {
  constructor(startDate, endDate, dayCount, needBridgeDay) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.dayCount = dayCount;
    this.needBridgeDay = needBridgeDay;
  }
}

// ------------------- Long Weekend List Service ------------------- //
// Nager.Date has a dedicated endpoint for this, no manual calculation needed
class LongWeekendListService {
  constructor(year, countryCode) {
    this.year = year;
    this.countryCode = countryCode;
  }

  async fetchLongWeekends() {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/LongWeekend/${this.year}/${this.countryCode}`,
      );
      const result = await response.json();
      return result.map(
        (item) =>
          new LongWeekend(
            item.startDate,
            item.endDate,
            item.dayCount,
            item.needBridgeDay,
          ),
      );
    } catch (error) {
      console.error("Error fetching long weekends:", error);
      return [];
    }
  }
}

// ------------------- Long Weekend Renderer ------------------- //
class LongWeekendRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
  }

  render(longWeekendsList) {
    this.container.innerHTML = "";

    if (longWeekendsList.length === 0) {
      this.showEmptyState(true);
      return;
    }

    this.showEmptyState(false);

    longWeekendsList.forEach((lw, index) => {
      const card = this._buildCard(lw, index);
      this.container.appendChild(card);
    });
  }

  _buildCard(lw, index) {
    const start = new Date(lw.startDate);
    const end = new Date(lw.endDate);

    const dateRangeLabel =
      `${start.toLocaleString("en-US", {month: "short", day: "numeric"})} - ` +
      `${end.toLocaleString("en-US", {month: "short", day: "numeric", year: "numeric"})}`;

    const infoBoxClass = lw.needBridgeDay ? "warning" : "success";
    const infoBoxIcon = lw.needBridgeDay ? "fa-info-circle" : "fa-check-circle";
    const infoBoxText = lw.needBridgeDay
      ? "Requires taking a bridge day off"
      : "No extra days off needed!";

    const days = this._buildDaysList(start, end);

    const card = document.createElement("div");
    card.className = "lw-card";
    card.innerHTML = `
      <div class="lw-card-header">
        <span class="lw-badge">
          <i class="fa-solid fa-calendar-days"></i> ${lw.dayCount} Days
        </span>
        <button class="holiday-action-btn">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <h3>Long Weekend #${index + 1}</h3>
      <div class="lw-dates">
        <i class="fa-regular fa-calendar"></i> ${dateRangeLabel}
      </div>
      <div class="lw-info-box ${infoBoxClass}">
        <i class="fa-solid ${infoBoxIcon}"></i> ${infoBoxText}
      </div>
      <div class="lw-days-visual">
        ${days
          .map(
            (day) => `
          <div class="lw-day ${day.isWeekend ? "weekend" : ""}">
            <span class="name">${day.name}</span>
            <span class="num">${day.num}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    const heartBtn = card.querySelector(".holiday-action-btn");

    wireHeartButton({
      btn: heartBtn,
      cardEl: card,
      plan: {
        id: `lw-${lw.startDate}-${lw.endDate}`,
        type: "long-weekends",
        title: `Long Weekend #${index + 1}`,
        subtitle: infoBoxText,
        date: dateRangeLabel,
      },
    });

    return card;
  }

  _buildDaysList(start, end) {
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      days.push({
        name: current.toLocaleString("en-US", {weekday: "short"}),
        num: current.getDate(),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
      current.setDate(current.getDate() + 1);
    }

    return days;
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

// ------------------- Instances + Loader ------------------- //
const longWeekendRenderer = new LongWeekendRenderer(
  "lw-content",
  "empty-state-lw",
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

// ------------------- Currency Service ------------------- //
class CurrencyService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchRates(baseCurrency) {
    try {
      const url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${baseCurrency}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.result !== "success") {
        console.error("Exchange rate API returned an error:", result);
        return null;
      }

      return result.conversion_rates;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return null;
    }
  }
}

// ------------------- Currency Converter ------------------- //

class CurrencyConverter {
  constructor({
    service,
    amountInputId,
    fromSelectId,
    toSelectId,
    swapBtnId,
    convertBtnId,
    resultContainerId,
    popularGridId,
  }) {
    this.service = service;

    this.amountInput = document.getElementById(amountInputId);
    this.fromSelect = document.getElementById(fromSelectId);
    this.toSelect = document.getElementById(toSelectId);
    this.swapBtn = document.getElementById(swapBtnId);
    this.convertBtn = document.getElementById(convertBtnId);
    this.resultContainer = document.getElementById(resultContainerId);
    this.popularGrid = document.getElementById(popularGridId);

    this.fromAmountEl = this.resultContainer.querySelector(
      ".conversion-from .amount",
    );
    this.fromCodeEl = this.resultContainer.querySelector(
      ".conversion-from .currency-code",
    );
    this.toAmountEl = this.resultContainer.querySelector(
      ".conversion-to .amount",
    );
    this.toCodeEl = this.resultContainer.querySelector(
      ".conversion-to .currency-code",
    );
    this.rateInfoP = this.resultContainer.querySelector(
      ".exchange-rate-info p",
    );
    this.rateInfoSmall = this.resultContainer.querySelector(
      ".exchange-rate-info small",
    );

    this._bindEvents();
  }

  _bindEvents() {
    this.convertBtn.addEventListener("click", () => this.convert());
    this.swapBtn.addEventListener("click", () => this._swap());
  }

  _swap() {
    const temp = this.fromSelect.value;
    this.fromSelect.value = this.toSelect.value;
    this.toSelect.value = temp;
    this.convert();
  }

  async convert() {
    const amount = parseFloat(this.amountInput.value) || 0;
    const from = this.fromSelect.value;
    const to = this.toSelect.value;

    const rates = await this.service.fetchRates(from);
    if (!rates || rates[to] === undefined) return;

    const rate = rates[to];
    const converted = amount * rate;

    this.fromAmountEl.textContent = amount.toFixed(2);
    this.fromCodeEl.textContent = from;
    this.toAmountEl.textContent = converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.toCodeEl.textContent = to;

    this.rateInfoP.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    this.rateInfoSmall.textContent = `Last updated: ${new Date().toLocaleDateString(
      "en-US",
      {year: "numeric", month: "long", day: "numeric"},
    )}`;

    this._updatePopularCurrencies(rates);
  }

  _updatePopularCurrencies(rates) {
    const cards = this.popularGrid.querySelectorAll(".popular-currency-card");
    cards.forEach((card) => {
      const codeEl = card.querySelector(".code");
      const rateEl = card.querySelector(".rate");
      if (!codeEl || !rateEl) return;

      const code = codeEl.textContent.trim();
      if (rates[code] !== undefined) {
        rateEl.textContent = rates[code].toFixed(4);
      }
    });
  }
}

// ------------------- Instance + Init ------------------- //

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
class SunTimesHeaderUpdater {
  constructor(flagId, nameId, cityTextId, cityBadgeId, viewHeaderSelectionId) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.cityTextEl = document.getElementById(cityTextId);
    this.cityBadgeEl = document.getElementById(cityBadgeId);
    this.viewHeaderSelection = document.getElementById(viewHeaderSelectionId);
  }

  updateHeader(country) {
    if (this.viewHeaderSelection)
      this.viewHeaderSelection.removeAttribute("hidden");
    if (this.flagImg) this.flagImg.src = country.flag;
    if (this.nameEl) this.nameEl.textContent = country.commonName;
    if (this.cityTextEl) this.cityTextEl.textContent = country.capital;
    if (this.cityBadgeEl) this.cityBadgeEl.textContent = `• ${country.capital}`;
  }
}

const SunTimesHeaderStatus = new SunTimesHeaderUpdater(
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
    if (this.headerSelection) {
      this.headerSelection.classList.remove("hidden");
    }

    let city = "--";
    let countryName = "--";
    let countryCode = "";

    if (
      typeof selectedCountryDetails !== "undefined" &&
      selectedCountryDetails
    ) {
      city = selectedCountryDetails.capital || "--";
      countryName = selectedCountryDetails.commonName || "--";
      countryCode = selectedCountryDetails.code || "";
    } else if (typeof appState !== "undefined" && appState) {
      city = appState.currentCity || "--";
      countryName = appState.currentCountryName || "--";
      countryCode = appState.currentCountryCode || "";
    }

    if (this.headerCity) this.headerCity.textContent = city;
    if (this.headerName) this.headerName.textContent = countryName;
    if (this.headerCityBadge) this.headerCityBadge.textContent = `• ${city}`;

    if (this.headerFlag && countryCode) {
      this.headerFlag.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
      this.headerFlag.alt = countryName;
    }
  }

  render(sunData) {
    let city = "--";
    if (
      typeof selectedCountryDetails !== "undefined" &&
      selectedCountryDetails
    ) {
      city = selectedCountryDetails.capital || "--";
    } else if (typeof appState !== "undefined" && appState) {
      city = appState.currentCity || "--";
    }

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

      if (this.headerSelection) {
        this.headerSelection.classList.add("hidden");
      }
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

    const lengthParts = data.day_length.split(":");
    const hours = parseInt(lengthParts[0], 10) || 0;
    const minutes = parseInt(lengthParts[1], 10) || 0;

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
// ------------------- TOAST NOTIFICATIONS --------------
// =====================================================
class ToastManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  show(message, type = "success", duration = 2500) {
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = document.createElement("i");
    icon.className =
      type === "success"
        ? "fa-solid fa-circle-check"
        : type === "error"
          ? "fa-solid fa-circle-xmark"
          : "fa-solid fa-circle-info";

    const text = document.createElement("span");
    text.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    const closeIcon = document.createElement("i");
    closeIcon.className = "fa-solid fa-xmark";
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener("click", () => this._remove(toast));

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(closeBtn);

    this.container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => this._remove(toast), duration);
  }

  _remove(toast) {
    if (!toast.isConnected) return;
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }
}

const toast = new ToastManager("toast-container");

// =====================================================
// ------------------- PLANS STORE -----------------------
// =====================================================

class PlansStore {
  constructor(storageKey = "wanderlust_saved_plans") {
    this.storageKey = storageKey;
    this.plans = this._load();
    this.listeners = [];
  }

  _load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Error loading saved plans:", error);
      return [];
    }
  }

  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.plans));
    } catch (error) {
      console.error("Error saving plans:", error);
    }
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  _notify() {
    this.listeners.forEach((cb) => cb(this.plans));
  }

  isSaved(id) {
    return this.plans.some((p) => p.id === id);
  }

  add(plan) {
    if (this.isSaved(plan.id)) return;
    this.plans.unshift({...plan, savedAt: new Date().toISOString()});
    this._save();
    this._notify();
  }

  remove(id) {
    this.plans = this.plans.filter((p) => p.id !== id);
    this._save();
    this._notify();
  }

  toggle(plan) {
    if (this.isSaved(plan.id)) {
      this.remove(plan.id);
      return false;
    }
    this.add(plan);
    return true;
  }

  clearAll() {
    this.plans = [];
    this._save();
    this._notify();
  }

  getByType(type) {
    if (!type || type === "all") return this.plans;
    return this.plans.filter((p) => p.type === type);
  }

  count(type = "all") {
    return this.getByType(type).length;
  }
}

const plansStore = new PlansStore();

// =====================================================
// ------------------- HEART BUTTON HELPER ---------------
// =====================================================

function wireHeartButton({btn, iconSelector = "i", plan, cardEl}) {
  const icon = btn.querySelector(iconSelector) || btn;

  // ظبط الحالة الابتدائية لو العنصر ده كان محفوظ بالفعل
  const applyState = (saved) => {
    icon.classList.toggle("fa-regular", !saved);
    icon.classList.toggle("fa-solid", saved);
    icon.classList.toggle("favorited", saved);
    btn.classList.toggle("saved", saved);
  };

  applyState(plansStore.isSaved(plan.id));

  if (cardEl) cardEl.dataset.planId = plan.id;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const added = plansStore.toggle(plan);
    applyState(added);

    // تأثير "نبضة" بسيطة على القلب لحظة التنوير
    if (added) {
      icon.classList.remove("heart-pop");
      void icon.offsetWidth; // إعادة تشغيل الأنيميشن
      icon.classList.add("heart-pop");
    }

    toast.show(
      added ? "Saved to My Plans!" : "Removed from My Plans",
      added ? "success" : "info",
    );
  });
}

// =====================================================
// ------------------- INDICATORS (Badge / Stat) ---------
// =====================================================
function updatePlansIndicators() {
  const badge = document.getElementById("plans-count");
  const statSaved = document.getElementById("stat-saved");
  const total = plansStore.count("all");

  if (badge) {
    badge.textContent = total;
    badge.classList.toggle("hidden", total === 0);
  }
  if (statSaved) statSaved.textContent = total;

  const filterAll = document.getElementById("filter-all-count");
  const filterHoliday = document.getElementById("filter-holiday-count");
  const filterEvent = document.getElementById("filter-event-count");
  const filterLw = document.getElementById("filter-lw-count");

  if (filterAll) filterAll.textContent = plansStore.count("all");
  if (filterHoliday) filterHoliday.textContent = plansStore.count("holiday");
  if (filterEvent) filterEvent.textContent = plansStore.count("event");
  if (filterLw) filterLw.textContent = plansStore.count("longweekend");
}

// =====================================================
// ------------------- MY PLANS RENDERER ------------------
// =====================================================
class MyPlansRenderer {
  constructor(contentId) {
    this.container = document.getElementById(contentId);
    this.currentFilter = "all";
    this.filterButtons = document.querySelectorAll(".plan-filter");

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    const clearBtn = document.getElementById("clear-all-plans-btn");
    clearBtn?.addEventListener("click", () => {
      if (plansStore.count("all") === 0) return;

      const doClear = () => {
        plansStore.clearAll();
        toast.show("All plans cleared", "info");
      };

      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "Clear all saved plans?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, clear all",
          confirmButtonColor: "#ef4444",
        }).then((result) => {
          if (result.isConfirmed) doClear();
        });
      } else if (confirm("Clear all saved plans?")) {
        doClear();
      }
    });

    document
      .getElementById("start-exploring-btn")
      ?.addEventListener("click", () => appNavigation.showDashboard());

    plansStore.onChange(() => {
      updatePlansIndicators();
      this.render();
    });
  }

  render() {
    if (!this.container) return;
    const plans = plansStore.getByType(this.currentFilter);
    this.container.innerHTML = "";

    if (plans.length === 0) {
      this.container.appendChild(this._buildEmptyState());
      return;
    }

    plans.forEach((plan) => this.container.appendChild(this._buildCard(plan)));
  }

  _buildEmptyState() {
    const wrapper = document.createElement("div");
    wrapper.className = "empty-state";

    const noneForFilter = this.currentFilter !== "all";
    wrapper.innerHTML = `
      <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
      <h3>${noneForFilter ? "Nothing Here Yet" : "No Saved Plans Yet"}</h3>
      <p>${
        noneForFilter
          ? "You haven't saved anything in this category yet."
          : "Start exploring and save holidays, events, or long weekends you like!"
      }</p>
      <button class="btn-primary" id="start-exploring-btn-inner">
        <i class="fa-solid fa-compass"></i> Start Exploring
      </button>
    `;
    wrapper
      .querySelector("#start-exploring-btn-inner")
      .addEventListener("click", () => appNavigation.showDashboard());
    return wrapper;
  }

  _typeMeta(type) {
    if (type === "holiday")
      return {label: "Holiday", icon: "fa-calendar-check"};
    if (type === "event") return {label: "Event", icon: "fa-ticket"};
    return {label: "Long Weekend", icon: "fa-umbrella-beach"};
  }

  _buildCard(plan) {
    const meta = this._typeMeta(plan.type);

    const card = document.createElement("div");
    card.className = "plan-card";
    card.dataset.planId = plan.id;

    card.innerHTML = `
      <div class="plan-card-header">
        <span class="plan-type-badge ${plan.type}">
          <i class="fa-solid ${meta.icon}"></i> ${meta.label}
        </span>
        <button class="plan-remove-btn" title="Remove">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <h3>${plan.title}</h3>
      <p class="plan-subtitle">${plan.subtitle || ""}</p>
      <div class="plan-card-footer">
        <span><i class="fa-regular fa-calendar"></i> ${plan.date || ""}</span>
        ${plan.location ? `<span><i class="fa-solid fa-location-dot"></i> ${plan.location}</span>` : ""}
      </div>
    `;

    card.querySelector(".plan-remove-btn").addEventListener("click", () => {
      plansStore.remove(plan.id);
      toast.show("Removed from My Plans", "info");

      // نطفي أي قلب مضيء لنفس العنصر لو لسه ظاهر في شاشة تانية
      document.querySelectorAll(`[data-plan-id="${plan.id}"]`).forEach((el) => {
        const icon = el.querySelector(".fa-heart");
        if (icon) {
          icon.classList.remove("fa-solid", "favorited");
          icon.classList.add("fa-regular");
        }
      });
    });

    return card;
  }
}

const myPlansRenderer = new MyPlansRenderer("plans-content");

updatePlansIndicators();
myPlansRenderer.render();
