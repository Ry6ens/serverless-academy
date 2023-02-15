const axios = require('axios');

const { OPEN_WEATHER } = process.env;

const getWeather = async city => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPEN_WEATHER}`
    );
    return data;
  } catch (error) {
    const errorMsg = error.response.data.message;
    return errorMsg;
  }
};

module.exports = getWeather;
