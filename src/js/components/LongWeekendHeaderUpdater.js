export default class LongWeekendHeaderUpdater {
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
