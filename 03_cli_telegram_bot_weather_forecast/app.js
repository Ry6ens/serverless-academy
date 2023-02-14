const TelegramBot = require('node-telegram-bot-api');

process.env.TELEGRAM_TOKEN = '6014358760:AAHMtB-lQ1ZNmqpt8_b8RYr5zBlHpxnE4V8';
process.env.OPEN_WEATHER = '801fbe5ddd768aadd0ca100e8701df2f';

const { TELEGRAM_TOKEN } = process.env;

const { getWeather } = require('./api');

const { weatherHtmlTemplate } = require('./templates');

// Create a bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Create commands for a bot
bot.setMyCommands([
  { command: 'start', description: 'show menu' },
  { command: 'city', description: 'get the weather at selected city' },
]);

// Function that gets the weather by the city name
const getWeatherByCity = async (chatId, city) => {
  const data = await getWeather(city);

  // const { name, main, weather, wind, clouds, sys } = data;
  const { list } = data;

  list.map(el => console.log(el.dt_txt));

  // Weather icon
  // const weatherIcon = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

  // await bot.sendPhoto(chatId, weatherIcon);
  // await bot.sendMessage(
  //   chatId,
  //   weatherHtmlTemplate(name, main, weather[0], wind, clouds, sys),
  //   {
  //     parse_mode: 'HTML',
  //   }
  // );
  // await bot.sendMessage(chatId, 'Subscribe forecast', {
  //   reply_markup: JSON.stringify({
  //     inline_keyboard: [
  //       [
  //         {
  //           text: `Subscribe`,
  //           callback_data: 'sub',
  //         },
  //       ],
  //     ],
  //   }),
  // });
};

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
