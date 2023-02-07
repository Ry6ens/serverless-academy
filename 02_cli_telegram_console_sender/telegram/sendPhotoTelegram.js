const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const sendPhotoTelegram = async path => {
  await bot.sendPhoto(TELEGRAM_CHAT_ID, path);
  process.exit();
};

module.exports = sendPhotoTelegram;
