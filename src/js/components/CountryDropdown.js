// js/components/CountryDropdown.js

export default class CountryDropdown {
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
    if (typeof this.onSelect === "function") this.onSelect(country);
  }

  showPlaceholderAfterClose(text = "Select Country") {
    this.selectedNameEl.textContent = text;
    this.selectedFlagImg.src = "";
    this.selectedFlagImg.style.display = "none";
  }
}
