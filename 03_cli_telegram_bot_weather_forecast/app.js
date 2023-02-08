const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const { OPEN_WEATHER, TELEGRAM_TOKEN } = process.env;

// OpenWeatherMap endpoint for getting weather by city name
const weatherEndpoint = city =>
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${OPEN_WEATHER}`;

// URL that provides icon according to the weather
const weatherIcon = icon => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
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

// Function that gets the weather by the city name
const getWeatherByCity = async (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  try {
    const { data } = await axios.get(endpoint);

    const { name, main, weather, wind, clouds, sys } = data;

    await bot.sendPhoto(chatId, weatherIcon(weather[0].icon));
    await bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds, sys),
      {
        parse_mode: 'HTML',
      }
    );
    await bot.sendMessage(chatId, 'Subscribe forecast', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: `Subscribe`,
              callback_data: 'sub',
            },
          ],
        ],
      }),
    });
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, `${error.response.data.message}`, {
      parse_mode: 'HTML',
    });
  }
};

// Create a bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Create commands for a bot
bot.setMyCommands([
  { command: 'start', description: 'show menu' },
  { command: 'city', description: 'get the weather at selected city' },
]);

// Listener (handler) for telegram's /start event
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>BotWeatherForecast</b>
        
    Available commands:
    
    /start - show menu
    /city <b>city</b> - shows weather for selected <b>city</b>
      `,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: '🌆 Choose a city' }],
          [{ text: '📍 Share Location', request_location: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    }
  );
});

// Listener (handler) for telegram's /weather event
bot.onText(/\/city/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(chatId, `Please provide city name next format: \n/city city_name`);
    return;
  }

  getWeatherByCity(chatId, city);
});

// Listener (handler) for telegram's /weather event
bot.onText(/\🌆 Choose a city/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Please provide city name next format: \n/city city_name`);
});

// Callback
bot.on('callback_query', query => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  bot.deleteMessage(chatId, messageId);

  if (query.data === 'sub') {
    bot.sendMessage(chatId, 'Choose intervals to return a forecast:', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'at intervals of 3 hours',
              callback_data: '3',
            },
            {
              text: 'at intervals of 6 hours',
              callback_data: '6',
            },
          ],
          [
            {
              text: 'back',
              callback_data: 'start',
            },
          ],
        ],
      }),
    });
  }

  if (query.data === '3') {
    console.log(city);
    bot.sendMessage(chatId, `You subscribed weather forecast at intervals of 3 hours`);

    // send weather every 3 hours
    setInterval(() => {
      getWeatherByCity(chatId, city);
    }, 1.08e7);
  }

  if (query.data === '6') {
    bot.sendMessage(chatId, `You subscribed weather forecast at intervals of 6 hours`);

    // send weather every 6 hours
    setInterval(() => {
      getWeatherByCity(chatId, city);
    }, 2.16e7);
  }

  if (query.data === 'start') {
    bot.sendMessage(chatId, 'Subscribe', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: `Subscribe forecast`,
              callback_data: 'sub',
            },
          ],
        ],
      }),
    });
  }
});
