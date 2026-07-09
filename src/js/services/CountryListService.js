// ------------------- COUNTRY LIST SERVICE ------------

export default class CountryListService {
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
