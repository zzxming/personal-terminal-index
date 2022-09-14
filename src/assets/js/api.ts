import originAxios from 'axios';
import { BiliPageInfo, BiliTypeVideo, BiliVideo, BiliVideoSearchInfo } from '../../interface/interface';

export const axios = originAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api': '/'
});

export interface AxiosResult<T> {
    data: {
        code: number
        data: T
    }
}

/**
 * 
 * @param {*} keywords 
 * @param {*} config from: 翻译前语言, to: 翻译后语言
 * @returns 
 */
interface FanyiConfig {
    keywords: string
    from: string
    to: string
}
export interface FanyiResResult {
    from: string
    to: string
    trans_result: [
        {
            /** 原语言 */
            src: string
            /** 翻译至语言 */
            dst: string
        }
    ]
}
export interface FanyiRejResult {
    error_code: number
    error_message: string
}
export const fanyiApi = async (config: FanyiConfig): Promise<AxiosResult<FanyiResResult | FanyiRejResult>> => await axios.post('/fanyi/translate', { config })


export interface MusicResult {
    name: string
    id: number
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = async (keywords: string): Promise<AxiosResult<MusicResult[]>> => await axios.post('/music/get', { keywords });
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (keywords: string): Promise<AxiosResult<MusicResult[]>> => await axios.post('/music/list', { keywords });

/**
 * 
 * @param {*} type 有效值为: ['meizi', 'dongman', 'fengjing', 'suiji'], 其他值则返回type为'meizi'
 * @returns imageurl
 */
export type ImageType = ['meizi', 'dongman', 'fengjing', 'suiji']
export const getBackgroundImageUrl = async (type: ImageType) => await axios.get('/background/random', { params: { type } });

/**
 * bilibili搜索
 * @param { keywords, page, pageSize } params 关键词, 请求页数, 一页数据量
 * @returns 
 */
interface BiliSearchParam {
    keywords: string
    page: number
    pageSize: number
}

export interface BiliSearchResult {
    pageinfo: {
        [key: string]: BiliPageInfo
    }
    result: {
        result_type: string
        data: BiliVideo[]
    }[]
}
export const getBiliSearchResult = async (params: BiliSearchParam): Promise<AxiosResult<BiliSearchResult>> => await axios.get('/bili/search', { params })
export const getBiliPic = async (pic: string) => await axios.get('/bili/pic', { params: { pic } })

/**
 * 
 * @param { keywords, page, pageSize, search_type }  关键词, 请求页数, 一页数据量, 搜索类型
 * @returns 
 */
interface BiliTypeSearchParam extends BiliSearchParam {
    search_type: string
}
// 根据类型搜索返回结果
export interface BiliTypeSearchResult extends BiliVideoSearchInfo {
    result: BiliTypeVideo[]
}
// 搜索结果的信息
export const getBiliSearchTypeResult = async (params: BiliTypeSearchParam): Promise<AxiosResult<BiliTypeSearchResult>> => await axios.get('/bili/searchtype', { params })

