const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

const { TELEGRAM_TOKEN } = process.env;

const { getCurrencyPrivatbank, getCurrencyMonobank } = require('./api');

const { getCache, setCache } = require('./controllers/cache');

const { usdHtmlTemplate, euroHtmlTemplate } = require('./templates');

// Create a bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Create commands for a bot
bot.setMyCommands([{ command: 'start', description: 'show menu' }]);

// Listener (handler) for telegram's /start event
bot.onText(/\/start|↩️ Back to Menu/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>BotExchangeRate</b>
          
      Available commands:
      
      /start - show menu
        `,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: [[{ text: 'Exchange Rates' }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    }
  );
});

bot.onText(/Exchange Rates|↩️ Back to Currency/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here is a list of exchange rates:', {
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      keyboard: [[{ text: 'USD' }, { text: 'EURO' }], [{ text: '↩️ Back to Menu' }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  });
});

bot.onText(/USD/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here is a list of exchange rates:', {
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Privatbank 🇺🇸' }, { text: 'Monobank 🇺🇸' }],
        [{ text: 'Show all banks 🇺🇸' }],
        [{ text: '↩️ Back to Currency' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  });
});

bot.onText(/EURO/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here is a list of exchange rates:', {
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Privatbank 🇪🇺' }, { text: 'Monobank 🇪🇺' }],
        [{ text: 'Show all banks 🇪🇺' }],
        [{ text: '↩️ Back to Currency' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  });
});

// Monobank
bot.onText(/Monobank 🇺🇸|Show all banks 🇺🇸/, async msg => {
  const chatId = msg.chat.id;
  const data = getCache();

  if (!data) {
    const data = await getCurrencyMonobank();
    setCache(data);
    const result = data.find(el => el.currencyCodeA === 840);
    await bot.sendMessage(
      chatId,
      usdHtmlTemplate('Monobank', result.rateBuy, result.rateSell),
      {
        parse_mode: 'HTML',
      }
    );
    return;
  }

  const result = data.find(el => el.currencyCodeA === 840);
  await bot.sendMessage(
    chatId,
    usdHtmlTemplate('Monobank', result.rateBuy, result.rateSell),
    {
      parse_mode: 'HTML',
    }
  );
});

bot.onText(/Monobank 🇪🇺|Show all banks 🇪🇺/, async msg => {
  const chatId = msg.chat.id;
  const data = getCache();

  if (!data) {
    const data = await getCurrencyMonobank();
    setCache(data);
    const result = data.find(el => el.currencyCodeA === 978);
    bot.sendMessage(
      chatId,
      euroHtmlTemplate('Monobank', result.rateBuy, result.rateSell),
      {
        parse_mode: 'HTML',
      }
    );
    return;
  }

  const result = data.find(el => el.currencyCodeA === 978);
  bot.sendMessage(chatId, euroHtmlTemplate('Monobank', result.rateBuy, result.rateSell), {
    parse_mode: 'HTML',
  });
});

// Privatbank
bot.onText(/Privatbank 🇺🇸|Show all banks 🇺🇸/, async msg => {
  const chatId = msg.chat.id;
  const data = await getCurrencyPrivatbank();
  const result = data.find(el => el.ccy === 'USD');
  bot.sendMessage(chatId, usdHtmlTemplate('Privatbank', result.buy, result.sale), {
    parse_mode: 'HTML',
  });
});

bot.onText(/Privatbank 🇪🇺|Show all banks 🇪🇺/, async msg => {
  const chatId = msg.chat.id;
  const data = await getCurrencyPrivatbank();
  const result = data.find(el => el.ccy === 'EUR');
  bot.sendMessage(chatId, usdHtmlTemplate('Privatbank', result.buy, result.sale), {
    parse_mode: 'HTML',
  });
});
