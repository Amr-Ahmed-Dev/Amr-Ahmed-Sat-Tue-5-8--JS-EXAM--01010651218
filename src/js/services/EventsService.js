import Event from "../models/Event.js";

export default class EventsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchEvents(cityName) {
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${this.apiKey}&city=${encodeURIComponent(cityName)}&size=8`;
      const response = await fetch(url);
      const result = await response.json();
      console.log("Ticketmaster raw response:", result);

      if (!result._embedded || !result._embedded.events) {
        return [];
      }

      return result._embedded.events.map((item) => {
        const venue = item._embedded?.venues?.[0];
        return new Event(
          item.name,
          item.dates?.start?.localDate || "",
          item.dates?.start?.localTime || "",
          venue?.name || "Unknown venue",
          venue?.city?.name || cityName,
          item.images?.[0]?.url || "",
          item.classifications?.[0]?.segment?.name || "Event",
          item.url || "#",
        );
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
}
