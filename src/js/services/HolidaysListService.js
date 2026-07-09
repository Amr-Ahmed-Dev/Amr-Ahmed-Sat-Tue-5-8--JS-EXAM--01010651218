import Holiday from "../models/Holiday.js";

export default class HolidaysListService {
  constructor(year, countryCode) {
    this.year = year;
    this.countryCode = countryCode;
  }

  async fetchHolidays() {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${this.year}/${this.countryCode}`,
      );
      const result = await response.json();
      return result.map(
        (item) => new Holiday(item.date, item.localName, item.name, item.types),
      );
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  }
}
