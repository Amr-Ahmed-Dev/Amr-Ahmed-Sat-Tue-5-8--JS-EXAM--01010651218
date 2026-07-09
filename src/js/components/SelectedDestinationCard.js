// components/SelectedDestinationCard.js
export default class SelectedDestinationCard {
  constructor(
    flagId,
    countryNameId,
    cityNameId,
    selectDestinationId = "selected-destination",
    beforeChoiceId = "dashboard-before-choise-country",
  ) {
    this.flagImg = document.getElementById(flagId);
    this.countryNameEl = document.getElementById(countryNameId);
    this.cityNameEl = document.getElementById(cityNameId);
    this.selectDestination = document.getElementById(selectDestinationId);
    this.dashboardBeforeChoiseCountry = document.getElementById(beforeChoiceId);
  }

  updateCountryDestination(country) {
    this.selectDestination?.classList.remove("hidden");
    this.dashboardBeforeChoiseCountry?.classList.add("hidden");

    this.flagImg.src = country.flag;
    this.countryNameEl.textContent = country.commonName;
    this.cityNameEl.textContent = `• ${country.capital}`;
  }
}
