export default class HeaderStatusUpdater {
  constructor({
    flagId,
    nameId,
    viewSelectionId,
    yearId = null,
    cityTextId = null,
    cityBadgeId = null,
  }) {
    this.flagImg = document.getElementById(flagId);
    this.nameEl = document.getElementById(nameId);
    this.viewHeaderSelection = document.getElementById(viewSelectionId);
    this.yearEl = yearId ? document.getElementById(yearId) : null;
    this.cityTextEl = cityTextId ? document.getElementById(cityTextId) : null;
    this.cityBadgeEl = cityBadgeId
      ? document.getElementById(cityBadgeId)
      : null;
  }

  updateHeader(country, year) {
    this.viewHeaderSelection?.classList.remove("hidden");

    if (this.flagImg) this.flagImg.src = country.flag;
    if (this.nameEl) this.nameEl.textContent = country.commonName;
    if (this.yearEl && year) this.yearEl.textContent = year;
    if (this.cityTextEl) this.cityTextEl.textContent = country.capital;
    if (this.cityBadgeEl) this.cityBadgeEl.textContent = `• ${country.capital}`;
  }
}
