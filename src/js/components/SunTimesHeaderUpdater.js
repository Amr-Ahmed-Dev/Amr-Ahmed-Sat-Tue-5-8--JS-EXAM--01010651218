export default class SunTimesHeaderUpdater {
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
