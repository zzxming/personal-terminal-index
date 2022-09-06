const { translate } = require("../thirdpart/baiduFanYiApi");

const getTranslateApi = async (event, req, res) => {
    const { config } = event;
    const { keywords } = config;
    // console.log(keywords, config)
    if (!keywords || !config) {
        throw new Error ('fannyi Params error 参数错误');
    }
    const result = await translate(keywords, config);
    if (!result) {
        throw new Error('fanyi Third part service error');
    }
    console.log('get translate')
    return result;
}

module.exports = {
    getTranslateApi
}