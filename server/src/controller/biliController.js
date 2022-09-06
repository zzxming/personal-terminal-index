const { default: axios } = require("axios");
const { biliSearch, biliPic } = require("../thirdpart/bilibiliApi");

const fs = require('fs');

const getBiliSearchResultApi = async (event, req, res) => {
    const { keywords, page } = event;
    let result = await biliSearch(keywords, page);
    return result;
}

const getBiliPic = async (event, req, res) => {
    let { pic } = event;
    // console.log(pic)
    // 因为b站图片请求如果在页面中发起请求携带referer请求头则会导致403禁止, 而在后端或直接浏览器中获取不会
    // 获取图片后将其转为base64格式
    if (!pic.startsWith('http')) {
        pic = `http:${pic}`;
    }
    return await biliPic(pic);
}

module.exports = {
    getBiliSearchResultApi,
    getBiliPic
}
