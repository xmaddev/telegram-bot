const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const dotenv = require("dotenv").config()
const {jobLocationsOptions, applyJob, jobOptions} = require('./options')
const {UserTg , Job ,JobCategories, JobLocations} = require('./models');

const token =  dotenv.parsed.TELEGRAM_API_TOKEN

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const start = async () => {
   
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Ошибка подключения к БД', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'старт'},
        {command: '/contacts', description: 'Наше местоположение'},
        {command: '/cv', description: 'Отправить CV'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        let messageOutput = "";
        try {
            if (text === '/start') {

                const [user, created] = await UserTg.findOrCreate({
                    where: { chatId: chatId }
                });

                if (!created) {
                    await bot.sendMessage(chatId,`Рады тебя снова видеть, ${msg.from.first_name} 😄`)
                }
                
                const jobLocations = await JobLocations.findAll({raw: true})
                const jobLocationsBtns = new Array();

                jobLocations.forEach((item) => {
                   jobLocationsBtns.push({ text: item.location, callback_data: item.id });
                })

                const chunkSize = 3;
                const chunks = [];

                for (let i = 0; i < jobLocationsBtns.length; i += chunkSize) {
                const chunk = jobLocationsBtns.slice(i, i + chunkSize);
                chunks.push(chunk);
                }

                return await bot.sendMessage(chatId,  'Выберите локацию:', jobLocationsOptions(chunks))

            }
            if (text === '/contacts') {
                await bot.sendLocation(chatId, '46.841767', '29.620788')
                return bot.sendMessage(chatId,  `Вы можете нас найти по адресу`);
            }
            if (text === '/cv') {
                return await bot.sendMessage(chatId, '✅🚀 Отправить CV', applyJob())
            }

            return bot.sendMessage(chatId, 'Такой команды не существует!');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-то ошибка!');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const jobsByLocation = await Job.findAll({ where: {status:'active' ,location_id: data} ,raw: true})
        const jobs = new Array();

        jobsByLocation.forEach((item) => {
            jobs.push('✅ '+ item.title);
        })

        await bot.sendMessage(chatId,  '<b><i>🔥Актуальные вакансии:</i></b>\n\n' + jobs.join('\n\n'),{parse_mode:'HTML'})
        return await bot.sendMessage(chatId, '🚀 Отправьте CV и мы с вами обязательно свяжемся',applyJob())
        // const user = await UserTg.findOne({chatId})
    
        // user.wrong += 1;

        // await user.save();
    })
}

start()
