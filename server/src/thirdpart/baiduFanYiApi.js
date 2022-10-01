const axios = require('axios');
const md5 = require('md5-node');
const { baiduFanYiConfig } = require('../config/config')


const translate = async (keywords, config) => {
    const from = config?.from ?? 'auto';
    const to = config?.to ?? 'auto';
    const salt = new Date().getTime();
    const { appid, key } = baiduFanYiConfig;
    if (!appid || !key) {
        return {
            error_code: 50000,
            error_message: '请配置百度翻译appid和key'
        }
    }
    const sign = md5(appid + keywords + salt + key);
    // 两个都行
    // const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
    // console.log(keywords)
    return await axios.get(url, {
        params: {
            q: keywords,
            from, to, appid, salt, sign
        }
    })
    .then(res => res.data)
    .catch(e => {
        throw e;
    });
}

module.exports = {
    translate
}

