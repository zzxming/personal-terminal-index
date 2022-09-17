const { default: axios } = require("axios")


const biliSearch = async ({keywords, page, pageSize = 42}) => {

    const cookie = await axios.get(`https://api.bilibili.com/x/frontend/finger/spi`)
    .then(data => `buvid3=${data.data.data.b_3};`);
    // console.log(keywords)
    // 搜索所有类型
    return await axios.get(
        `http://api.bilibili.com/x/web-interface/search/all/v2?page=${page}&page_size=${pageSize}&keyword=${encodeURI(keywords)}`,
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
    .catch(e => e.code)
}

// b站搜索登录用户和未登录用户搜索结果是不同的, 登录用户会传递 cookie 中的 SESSDATA, 此 cookie 控制搜索结果
const biliSearchType = async ({keywords, page, pageSize = 42, search_type}) => {
    
    const cookie = await axios.get(`https://api.bilibili.com/x/frontend/finger/spi`)
    .then(data => `buvid3=${data.data.data.b_3};`);

    return await axios.get(
        `https://api.bilibili.com/x/web-interface/search/type?page=${page}&page_size=${pageSize}&keyword=${encodeURI(keywords)}&search_type=${search_type}&dynamic_offset=30`,
        {
            headers: {
                cookie
            },
        }
    )
    .then(data => {
        // console.log(data)
        const { page, pagesize, numPages, numResults, result} = data.data.data;
        return {
            page,
            pagesize,
            numResults,
            numPages,
            result: result ?? []
        }
    })
    .catch(e => e.code)
}

const biliPic = async (pic) => {
    return await axios.get(`${pic}`, {
        responseType: 'arraybuffer'
    })
    .then(data => `data:${data.headers['content-type']};base64,${new Buffer.from(data.data, 'binary').toString('base64')}`)
    .catch(e => e.code)
}

module.exports = {
    biliSearch,
    biliPic,
    biliSearchType
}

