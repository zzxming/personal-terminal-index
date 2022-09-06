const { default: axios } = require("axios")


const biliSearch = async (keywords, page) => {

    // const cookie = `buvid3=5DAF93F9-CEDA-494C-A66D-4C848E9AC2C0148803infoc;`
    const cookie = await axios.get(`https://api.bilibili.com/x/frontend/finger/spi`)
    .then(data => `buvid3=${data.data.data.b_3};`);
    // console.log(keywords)
    return await axios.get(
        `http://api.bilibili.com/x/web-interface/search/all/v2?page=${page}&page_size=20&keyword=${encodeURI(keywords)}`,
        {
            headers: {
                cookie
            },
        }
    )
    .then(data => {
        // console.log(data)
        return {
            pageinfo: data.data.data.pageinfo ?? {},
            result: data.data.data.result ?? []
        }
    })

}

const biliPic = async (pic) => {
    return await axios.get(`${pic}`, {
        responseType: 'arraybuffer'
    })
    .then(data => `data:${data.headers['content-type']};base64,${new Buffer.from(data.data, 'binary').toString('base64')}`)
}

module.exports = {
    biliSearch,
    biliPic
}

