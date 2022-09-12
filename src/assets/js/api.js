import originAxios from 'axios';

export const axios = originAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api': '/'
});

/**
 * 
 * @param {*} keywords 
 * @param {*} config from: 翻译前语言, to: 翻译后语言
 * @returns 
 */
export const fanyiApi = async (config) => await axios.post('/fanyi/translate', { config })

/** 关键词搜索单曲 */
export const getNeteaseMusic = async (keywords) => await axios.post('/music/get', { keywords });
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (keywords) => await axios.post('/music/list', { keywords });

/**
 * 
 * @param {*} type 有效值为: ['meizi', 'dongman', 'fengjing', 'suiji'], 其他值则返回type为'meizi'
 * @returns imageurl
 */
export const getBackgroundImageUrl = async (type) => await axios.get('/background/random', { params: { type } });

/**
 * bilibili搜索
 * @param { keywords, page, pageSize } params 关键词, 请求页数, 一页数据量
 * @returns 
 */
export const getBiliSearchResult = async (params) => await axios.get('/bili/search', { params })
export const getBiliPic = async (pic) => await axios.get('/bili/pic', { params: { pic } })

/**
 * 
 * @param { keywords, page, pageSize, search_type }  关键词, 请求页数, 一页数据量, 搜索类型
 * @returns 
 */
export const getBiliSearchTypeResult = async (params) => await axios.get('/bili/searchtype', { params })

