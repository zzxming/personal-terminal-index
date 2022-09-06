const { default: axios } = require("axios");


const backgroundImageUrl = async (type) => {
    const types = ['meizi', 'dongman', 'fengjing', 'suiji'];
    let typeIndex = 0;
    if (!type || !types.includes(type)) {
        console.log('bg type参数错误, 传递默认type值');
        type = types[typeIndex];
    }
    // console.log(type)
    const imageApiUrl = `https://api.btstu.cn/sjbz/api.php?lx=${type}&format=json`;

    try {
        return axios.get(imageApiUrl).then(res => res.data.imgurl)
    }
    catch(e) {
        console.log(e);
        return '';
    }
    // return axios.get(imageApiUrl).then(res => res.data.imgurl);
}

module.exports = {
    backgroundImageUrl
}

