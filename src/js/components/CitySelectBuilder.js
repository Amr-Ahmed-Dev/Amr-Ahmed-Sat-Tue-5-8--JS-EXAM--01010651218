// ------------------- CITY SELECT -------------------

export default class CitySelectBuilder {
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
