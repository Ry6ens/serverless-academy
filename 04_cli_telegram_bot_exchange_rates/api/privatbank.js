const axios = require('axios');

const getCurrencyPrivatbank = async () => {
  try {
    const { data } = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'
    );
    return data;
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);
  }
};

module.exports = getCurrencyPrivatbank;
