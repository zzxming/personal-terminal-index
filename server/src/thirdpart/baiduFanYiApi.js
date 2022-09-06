const axios = require('axios');
const md5 = require('md5-node');
const { baiduFanYiConfig } = require('../config/config')


const translate = async (keywords, config) => {
    const from = config?.from ?? 'auto';
    const to = config?.to ?? 'auto';
    const salt = new Date().getTime();
    const { appid, key } = baiduFanYiConfig;
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
    }).then(res => res.data);
}

module.exports = {
    translate
}

