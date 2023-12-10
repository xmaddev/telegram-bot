const jobLocationsOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};
const applyJob = () => {
    return { reply_markup: JSON.stringify({inline_keyboard: [
        [{ text: "Отправить CV", web_app: {url: 'https://job.hi-tech.md/job/nichego-ne-podoshlo-pridnestrove/apply'} }]
    ]})}
};
const jobOptions = (props) => {
    return { reply_markup: JSON.stringify({inline_keyboard: props })}
};

module.exports = { jobLocationsOptions,applyJob ,jobOptions };