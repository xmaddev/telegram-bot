const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
require("dotenv").config()
const {jobLocationsOptions, applyJob, jobOptions} = require('./options')
const {UserTg , Job ,JobCategories, JobLocations} = require('./models');
const {TELEGRAM_API_TOKEN} = process.env;
const token =  TELEGRAM_API_TOKEN

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const url = "https://job.hi-tech.md/job/";

const start = async () => {
   
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Ошибка подключения к БД', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Старт'},
        {command: '/info', description: 'Чего тебе?'},
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
                return await bot.sendMessage(chatId, '✅🚀 Отправить CV', applyJob('✅🚀 Отправить CV','https://job.hi-tech.md/job/nichego-ne-podoshlo-pridnestrove'))
            }

            return await bot.sendMessage(chatId, 'Такой команды не существует!');
        } catch (e) {   
            return bot.sendMessage(chatId, 'Произошла какая-то ошибка!');
        }
    })

    bot.on('callback_query', async msg => {
        const data = JSON.parse(msg.data);
        const chatId = msg.message.chat.id;
        const dateText = msg.message.date.text;
        const msgId = msg.message.message_id;
        if(data.callback === 'jobLocation'){

            // const jobCategories = await JobCategories.findAll({ include: [{
            //     model: Job,
            //     where: {location_id: id}
            //    }],raw: true })
            const [jobCategories,metadata] = await sequelize.query(
                "SELECT DISTINCT jc.id,jc.name,jc.created_at,jc.updated_at FROM `job_categories` AS jc WHERE jc.id IN (SELECT j.category_id FROM `jobs` as j WHERE j.location_id = " + data.item_id + " and status = 'active')"); 
            const jobCategoriesBtns = new Array();
           
            jobCategories.forEach((item) => {
                jobCategoriesBtns.push({ text: item.name, callback_data: JSON.stringify({category_id:item.id,callback:'jobCategory'})});
            })

            const chunkSize = 2;
            const chunks = [];

            for (let i = 0; i < jobCategoriesBtns.length; i += chunkSize) {
                const chunk = jobCategoriesBtns.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            await bot.deleteMessage(chatId, msgId)
            return await bot.sendMessage(chatId,  '🔥Актуальные вакансии:\n\n', jobOptions(chunks) )
        }
        
        if(data.callback === 'jobCategory'){
            const [ jobs,metadata ] = await sequelize.query(
                "SELECT DISTINCT j.id,j.title,j.slug FROM `jobs` as j WHERE j.category_id = " + data.category_id + " AND status = 'active'"); 
            const jobsBtns = new Array();
           
            jobs.forEach((item) => {
                jobsBtns.push([{ text: item.title, web_app: {url : (url + item.slug)}}]);
            })
            await bot.deleteMessage(chatId, msgId)
            return await bot.sendMessage(chatId,  '✅🚀🔥Выберите вакансию:\n\n', jobOptions(jobsBtns));
        }

        // const user = await UserTg.findOne({chatId})
    
        // user.wrong += 1;

        // await user.save();
        return true;
    })
}

start()
