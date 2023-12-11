const jobLocationsOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};
const applyJob = (url) => {
    return { reply_markup: JSON.stringify({inline_keyboard: [
        [{ text: "Отправить CV", web_app: {url: url} ,callback_data: JSON.stringify({callback:'jobApply'})}]
    ]})}
};
const jobOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};

module.exports = { jobLocationsOptions,applyJob ,jobOptions };