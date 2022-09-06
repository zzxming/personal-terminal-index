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


export const getBiliSearchResult = async (keywords, page) => await axios.get('/bili/search', { params: { keywords, page } })
export const getBiliPic = async (pic) => await axios.get('/bili/pic', { params: { pic } })
