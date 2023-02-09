const axios = require('axios');

const getCurrencyMonobank = async () => {
  try {
    const { data } = await axios.get('https://api.monobank.ua/bank/currency');
    return data;
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);
  }
};

module.exports = getCurrencyMonobank;
