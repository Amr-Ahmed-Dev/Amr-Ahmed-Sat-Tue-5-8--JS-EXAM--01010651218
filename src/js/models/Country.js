// ------------------- COUNTRY MODEL -------------------
export default class Country {
  constructor(
    commonName,
    officialName,
    capital,
    region,
    subregion,
    code,
    flag,
    area,
    callingCode,
    drivingSide,
    startOfWeek,
    languages,
    currencies,
    googleMaps,
    symbol,
    borders,
    timezones,
    population,
    capitalLat,
    capitalLng,
  ) {
    this.commonName = commonName;
    this.officialName = officialName;
    this.capital = capital;
    this.region = region;
    this.subregion = subregion;
    this.code = code;
    this.flag = flag;
    this.area = area;
    this.callingCode = callingCode;
    this.drivingSide = drivingSide;
    this.startOfWeek = startOfWeek;
    this.languages = languages;
    this.currencies = currencies;
    this.symbol = symbol;
    this.googleMaps = googleMaps;
    this.borders = borders;
    this.timezones = timezones;
    this.population = population;
    this.capitalLat = capitalLat;
    this.capitalLng = capitalLng;
  }
}
