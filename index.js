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
        const url = "https://job.hi-tech.md/";
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
                   jobLocationsBtns.push({ text: item.location, callback_data: JSON.stringify({item_id:item.id,callback:'jobLocation'}) });
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
                return await bot.sendMessage(chatId, '✅🚀 Отправить CV', applyJob(url))
            }

            return bot.sendMessage(chatId, 'Такой команды не существует!');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-то ошибка!');
        }
    })

    bot.on('callback_query', async msg => {
        const data = JSON.parse(msg.data);
        const chatId = msg.message.chat.id;
        const dateText = msg.message.date.text;
        
        if(data.callback === 'jobLocation'){

            const jobCategories = await JobCategories.findAll( {where:{ id: data.item_id },include: Job,raw: true })
            const jobCategoriesBtns = new Array();
            console.log(jobCategories)
            jobCategories.forEach((item) => {
                jobCategoriesBtns.push({ text: item.name, callback_data: JSON.stringify({item_id:item.id,callback:'jobCategories'})});
            })

            const chunkSize = 2;
            const chunks = [];

            for (let i = 0; i < jobCategoriesBtns.length; i += chunkSize) {
                const chunk = jobCategoriesBtns.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            
            return await bot.sendMessage(chatId,  '🔥Актуальные вакансии:\n\n', jobOptions(chunks) )
        }
        if(data.callback === 'jobCategories'){
            const jobApply = await Job.findAll({raw: true})
            const jobApplyBtns = new Array();

            jobApply.forEach((item) => {
                jobApplyBtns.push({ text: item.name, callback_data: JSON.stringify({item_id:item.id,callback:'jobCategories'})});
            })

            const chunkSize = 2;
            const chunks = [];

            for (let i = 0; i < jobCategoriesBtns.length; i += chunkSize) {
                const chunk = jobCategoriesBtns.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            
            return await bot.sendMessage(chatId,  '🔥Актуальные вакансии:\n\n', jobOptions(chunks) )
        }

        if(data.callback === 'jobApply'){

            jobLocations.forEach((item) => {
                jobLocationsBtns.push({ text: item.location, callback_data: JSON.stringify({item_id:item.id,callback:'jobLocation'}) });
            })

            const chunkSize = 3;
            const chunks = [];

            for (let i = 0; i < jobLocationsBtns.length; i += chunkSize) {
                const chunk = jobLocationsBtns.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            return await bot.sendMessage(chatId,  'Выберите локацию:', jobLocationsOptions(chunks))
        }
        
        // const user = await UserTg.findOne({chatId})
    
        // user.wrong += 1;

        // await user.save();
    })
}

start()
