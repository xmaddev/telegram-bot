const jobLocationsOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};
const applyJob = (text,url) => {
    return { reply_markup: JSON.stringify({inline_keyboard: [
        [{ text: text, web_app: {url: url}}]
    ]})}
};
const jobOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};

module.exports = { jobLocationsOptions,applyJob ,jobOptions };