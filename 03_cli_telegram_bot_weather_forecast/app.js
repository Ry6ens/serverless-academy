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
const weatherHtmlTemplate = (name, main, weather, wind, clouds) =>
  `The weather in <b>${name}</b>:
  ...<b>${weather.main}</b>
  Temperature: <b>${main.temp} °C</b>
  Pressure: <b>${main.pressure} hPa</b>
  Humidity: <b>${main.humidity} %</b>
  Wind: <b>${wind.speed} meter/sec</b>
  Clouds: <b>${clouds.all} %</b>
  `;

// Function that gets the weather by the city name
const getWeatherByCity = async (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  try {
    const { data } = await axios.get(endpoint);

    const { name, main, weather, wind, clouds } = data;

    await bot.sendPhoto(chatId, weatherIcon(weather[0].icon), {
      height: 10,
      width: 10,
    });
    await bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds),
      {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: `Subscribe forecast in ${name}`,
                callback_data: '1',
              },
            ],
          ],
        }),
      }
    );

    bot.on('callback_query', query => {
      if (query.data === '1') {
        bot.sendMessage(chatId, 'Choose intervals to return a forecast:', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {
                  text: 'at intervals of 3 hours',
                  callback_data: '3',
                },
              ],
              [
                {
                  text: 'at intervals of 6 hours',
                  callback_data: '6',
                },
              ],
            ],
          }),
        });
      }

      if (query.data === '3') {
        bot.sendMessage(
          chatId,
          `You subscribed forecast in ${name} at intervals of 3 hours`
        );

        // send weather every 3 hours
        setInterval(() => {
          const subscribeCity = name;

          getWeatherByCity(chatId, subscribeCity);
        }, 10800);
      }

      if (query.data === '6') {
        bot.sendMessage(
          chatId,
          `You subscribed forecast in ${name} at intervals of 6 hours`
        );

        // send weather every 6 hours
        setInterval(() => {
          const subscribeCity = name;

          getWeatherByCity(chatId, subscribeCity);
        }, 21600);
      }
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
  { command: 'start', description: 'start the bot weather' },
  { command: 'weather', description: 'get the weather at selected city' },
]);

// Listener (handler) for telegram's /start event
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>BotWeatherForecast</b>
        
    Available commands:
    
    /start - start using the bot
    /weather <b>city</b> - shows weather for selected <b>city</b>
      `,
    {
      parse_mode: 'HTML',
    }
  );
});

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(chatId, `Please provide city name`);
    return;
  }

  getWeatherByCity(chatId, city);
});
