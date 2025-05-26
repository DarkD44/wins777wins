const TelegramBot = require('node-telegram-bot-api');

const token = 'ВАШ_ТОКЕН_ТЕЛЕГРАМ'; // вставьте ваш токен

const bot=new TelegramBot(token,{polling:true});

bot.onText(/\/start/, (msg) => {
  const chatId= msg.chat.id;

  bot.sendMessage(chatId,'Добро пожаловать! Перейдите по ссылке чтобы играть:',{
      reply_markup:{
          inline_keyboard:[
              [{text:'Играть в игры', url:'http://ваш_сервер/']}] // замените на ваш URL
          ]
      }
  });
});
``
