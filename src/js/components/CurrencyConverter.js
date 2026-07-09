// src/js/components/CurrencyConverter.js

export default class CurrencyConverter {
  constructor(config) {
    this.service = config.service;
    this.amountInput = document.getElementById(config.amountInputId);
    this.fromSelect = document.getElementById(config.fromSelectId);
    this.toSelect = document.getElementById(config.toSelectId);
    this.swapBtn = document.getElementById(config.swapBtnId);
    this.convertBtn = document.getElementById(config.convertBtnId);
    this.resultContainer = document.getElementById(config.resultContainerId);
    this.popularGrid = document.getElementById(config.popularGridId);

    this.init();
  }

  init() {
    this.convertBtn?.addEventListener("click", () => this.convert());
    this.swapBtn?.addEventListener("click", () => this.swap());
  }

  async convert() {
    const amount = this.amountInput.value;
    const from = this.fromSelect.value;
    const to = this.toSelect.value;

    const rates = await this.service.fetchRates(from);
    if (rates && rates[to]) {
      const result = (amount * rates[to]).toFixed(2);
      this.resultContainer.textContent = `${amount} ${from} = ${result} ${to}`;
    }
  }

  swap() {
    [this.fromSelect.value, this.toSelect.value] = [
      this.toSelect.value,
      this.fromSelect.value,
    ];
    this.convert();
  }
}
