const axios = require('axios');

const { OPEN_WEATHER } = process.env;

const getWeather = async city => {
  try {
    const { data } = await axios.get(
      // `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${OPEN_WEATHER}`
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER}`
    );
    return data;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

module.exports = getWeather;

// https://api.openweathermap.org/data/2.5/forecast?appid=
