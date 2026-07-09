export default class Event {
  constructor(
    name,
    date,
    time,
    venueName,
    cityName,
    imageUrl,
    category,
    ticketUrl,
  ) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.venueName = venueName;
    this.cityName = cityName;
    this.imageUrl = imageUrl;
    this.category = category;
    this.ticketUrl = ticketUrl;
  }
}
