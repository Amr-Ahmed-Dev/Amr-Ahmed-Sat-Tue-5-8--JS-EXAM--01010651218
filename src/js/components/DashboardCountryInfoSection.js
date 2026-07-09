// ------------------- DASHBOARD COUNTRY INFO -----------//

export default class DashboardCountryInfoSection {
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
