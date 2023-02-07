const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const sendMessageTelegram = async message => {
  await bot.sendMessage(TELEGRAM_CHAT_ID, message);
  process.exit();
};

module.exports = sendMessageTelegram;
