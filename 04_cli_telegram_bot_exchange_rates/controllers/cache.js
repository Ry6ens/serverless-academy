const NodeCache = require('node-cache');

const getExchangeRates = require('../api/monobank');

// Create cache
const myCache = new NodeCache();

const getCache = () => {
  const data = myCache.get('monobank');
  return data;
};

const setCache = data => {
  myCache.set('monobank', data, 310);
};

module.exports = { getCache, setCache };
