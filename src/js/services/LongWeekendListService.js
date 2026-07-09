import LongWeekend from "../models/LongWeekend.js";

export default class LongWeekendListService {
  constructor(year, countryCode) {
    this.year = year;
    this.countryCode = countryCode;
  }

  async fetchLongWeekends() {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/LongWeekend/${this.year}/${this.countryCode}`,
      );
      const result = await response.json();
      return result.map(
        (item) =>
          new LongWeekend(
            item.startDate,
            item.endDate,
            item.dayCount,
            item.needBridgeDay,
          ),
      );
    } catch (error) {
      console.error("Error fetching long weekends:", error);
      return [];
    }
  }
}
