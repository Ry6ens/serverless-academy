const weatherHtmlTemplate = (name, main, weather, wind, clouds, sys) => {
  const getLocalTime = timestamp => {
    const getDate = new Date(timestamp * 1000);
    return getDate.toLocaleTimeString(sys.country);
  };

  return `The weather in <b>${name}</b>:
  🪧 <b>${weather.description}</b>
  🌡 Temperature: <b>${main.temp} °C</b>
  ⏳ Pressure: <b>${main.pressure} hPa</b>
  💧 Humidity: <b>${main.humidity} %</b>
  💨 Wind: <b>${wind.speed} meter/sec</b>
  ☁️ Clouds: <b>${clouds.all} %</b>
  🌅 Sunrise: <b>${getLocalTime(sys.sunrise)}</b>
  🌇 Sunset: <b>${getLocalTime(sys.sunset)}</b>
  `;
};

module.exports = weatherHtmlTemplate;
