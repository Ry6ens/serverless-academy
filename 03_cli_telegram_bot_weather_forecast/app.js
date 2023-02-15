const TelegramBot = require('node-telegram-bot-api');

process.env.TELEGRAM_TOKEN = '6014358760:AAHMtB-lQ1ZNmqpt8_b8RYr5zBlHpxnE4V8';
process.env.OPEN_WEATHER = '801fbe5ddd768aadd0ca100e8701df2f';

const { TELEGRAM_TOKEN } = process.env;

const { getWeather } = require('./api');

const { weatherHtmlTemplate, weatherTitleHTMLTemplate } = require('./templates');

// Create a bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Create commands for a bot
bot.setMyCommands([{ command: 'start', description: 'show menu' }]);

// Listener (handler) for telegram's /start event
bot.onText(/\/start|↩️ Back to Menu/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>BotWeatherForecast</b>
          
      Available commands:
      
      /start - show menu
        `,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: [[{ text: '🌎 City' }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    }
  );
});

bot.onText(/🌎 City/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Write the name of the city that I can show you the weather:', {
    parse_mode: 'HTML',
  });
});

let cityData;

bot.onText(
  /^(?!\/start|🌎 City|↩️ Back to Menu|at intervals of 3 hours|at intervals of 6 hours)/,
  async msg => {
    const chatId = msg.chat.id;

    const data = await getWeather(msg.text);

    if (!data.hasOwnProperty('city')) {
      bot.sendMessage(chatId, data, {
        parse_mode: 'HTML',
      });
      return;
    }

    cityData = data;

    bot.sendMessage(chatId, 'Choose intervals:', {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: 'at intervals of 3 hours' }, { text: 'at intervals of 6 hours' }],
          [{ text: '↩️ Back to Menu' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    });
  }
);

bot.onText(/at intervals of 3 hours/, msg => {
  const chatId = msg.chat.id;

  const array = [];

  cityData.list.reduce((previousValue, currentValue) => {
    if (previousValue.slice(0, 10) !== currentValue.dt_txt.slice(0, 10)) {
      array.push(weatherTitleHTMLTemplate(currentValue));
    }

    array.push(weatherHtmlTemplate(currentValue));

    return (previousValue = currentValue.dt_txt);
  }, cityData.list[0].dt_txt);

  const text = array.join('\n');

  bot.sendMessage(
    chatId,
    `<b>The weather in ${cityData.city.name} every 3 hours:</b> \n \n` + text,
    {
      parse_mode: 'HTML',
    }
  );
});

bot.onText(/at intervals of 6 hours/, msg => {
  const chatId = msg.chat.id;

  const filterData = cityData.list.filter((el, index) => index % 2 === 0);

  const array = [];

  filterData.reduce((previousValue, currentValue) => {
    if (previousValue.slice(0, 10) !== currentValue.dt_txt.slice(0, 10)) {
      array.push(weatherTitleHTMLTemplate(currentValue));
    }

    array.push(weatherHtmlTemplate(currentValue));

    return (previousValue = currentValue.dt_txt);
  }, filterData[0].dt_txt);

  const text = array.join('\n');

  bot.sendMessage(
    chatId,
    `<b>The weather in ${cityData.city.name} every 6 hours:</b> \n \n` + text,
    {
      parse_mode: 'HTML',
    }
  );
});
