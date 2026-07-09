// src/js/services/CurrencyService.js

export default class CurrencyService {
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
