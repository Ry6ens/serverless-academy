const { program } = require('commander');
const process = require('node:process');

const sendMessageTelegram = require('./telegram/sendMessageTelegram');
const sendPhotoTelegram = require('./telegram/sendPhotoTelegram');

program
  .name('Telegram_console_sender')
  .description('Send message or photo to Telegram Bot')
  .version('0.0.1');

program
  .command('send-message')
  .description('Send message to Telegram Bot')
  .argument('<message>', 'string')
  .action(str => {
    sendMessageTelegram(str);
  });

program
  .command('send-photo')
  .description('Send photo to Telegram Bot')
  .argument('<path>', 'string')
  .action(path => {
    sendPhotoTelegram(path);
  });

program.parse(process.argv);
