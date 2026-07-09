// ------------------- COUNTRY DETAILS SERVICE -------------
import Country from "../models/Country.js";

export default class CountryDetailsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchCountryDetilis(countryName) {
    try {
      const url = `https://api.restcountries.com/countries/v5/names.common/${countryName}?pretty=1`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const result = await response.json();

      let name = result.data.objects[0].names.common;
      let langCode = result.data.objects[0].languages[0].iso639_3;
      let officialName =
        result.data.objects[0].names.native[langCode]?.official ||
        result.data.objects[0].names.common;
      let capital = result.data.objects[0].capitals[0].name;
      let region = result.data.objects[0].region;
      let subregion = result.data.objects[0].subregion;
      let code = result.data.objects[0].codes.alpha_2;
      let flag = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
      let area = result.data.objects[0].area.kilometers;
      let callingCode = result.data.objects[0].calling_codes[0];
      let drivingSide = result.data.objects[0].cars.driving_side;
      let startOfWeek = result.data.objects[0].date.start_of_week;
      let population = result.data.objects[0].population;
      let borders = result.data.objects[0].borders;
      let timezones = result.data.objects[0].timezones;
      let languages = result.data.objects[0].languages.map((lang) => lang.name);
      let currencies = result.data.objects[0].currencies[0].name;
      let symbol = result.data.objects[0].currencies[0].symbol;
      let googleMaps = result.data.objects[0].links.google_maps;
      let capitalLat = result.data.objects[0].capitals[0].coordinates.lat;
      let capitalLng = result.data.objects[0].capitals[0].coordinates.lng;

      const country = new Country(
        name,
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
      );

      console.log(country);
      return country;
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  }
}
