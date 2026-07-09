export function getWeatherVisual(code) {
  if (code === 0) return {icon: "fa-sun", label: "Clear sky"};
  if ([1, 2, 3].includes(code))
    return {icon: "fa-cloud-sun", label: "Partly cloudy"};
  if ([45, 48].includes(code)) return {icon: "fa-smog", label: "Fog"};
  if ([51, 53, 55, 56, 57].includes(code))
    return {icon: "fa-cloud-drizzle", label: "Drizzle"};
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return {icon: "fa-cloud-rain", label: "Rain"};
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return {icon: "fa-snowflake", label: "Snow"};
  if ([95, 96, 99].includes(code))
    return {icon: "fa-cloud-bolt", label: "Thunderstorm"};
  return {icon: "fa-cloud", label: "Cloudy"};
}
