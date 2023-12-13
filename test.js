require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");


const {TELEGRAM_API_TOKEN, PORT} = process.env;

const bot = new TelegramBot(TELEGRAM_API_TOKEN);

const app = express();
app.use(express.json());

// We are receiving updates at the route below!
app.post('/webhook', async (req, res) => {
  const webhook = req.body;
  const from = webhook[0].from;
  const to = webhook[0].to;
  const token_id = Number.parseInt(webhook[0].logs[0].topics[3],16);

  console.log(webhook)
  res.sendStatus(200);

  const chatId = 416552987;

  // Sends text to the above chatID
  bot.sendMessage(chatId,
    `🔔Bomber Man # ${token_id} transferred🔔\n\n From: ${from}\n\n To: ${to}\n
    https://polygonscan.com/tx/${webhook[0].logs[0].transactionHash}`
 );

});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Express server is listening`);
});

// https://api.telegram.org/bot6662880620:AAEAg9XGibc1G8wB7FPpZkYHgGxxaW0O9dU/setWebhook?url=https://casta.md/bots/webhook-tg-13142314.php