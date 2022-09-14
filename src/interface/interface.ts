import React from "react"
import { CommandParamArgs, UseCommandHook } from "../hooks/command"

// command 接口 start
export interface Command {
    name: string
    desc: string
    param: CommandParam | null
    option: CommandOption<any>[]
    action: ((args: CommandParamArgs, commandHandle: UseCommandHook) => string | React.ReactElement) | 
            ((args: CommandParamArgs, commandHandle: UseCommandHook) => Promise<string | React.ReactElement>)
}

export interface CommandOption<T> {
    key: string             // 参数key
    alias: string           // 参数输入名
    desc: string            // 参数描述
    defaultValue: string | number | boolean      // 参数默认值
    valueNeeded: boolean    // 此参数是否需要值
    legalValue: {
        [key: string | number]: any
    }   // 合法值数组, null为任何值
}
// 获取command中option的legalValue的类型
export type legalValueType<T extends object, K extends keyof T> = T[K];
export interface CommandParam {
    key: string             // key值
    desc: string            // param描述
    required: boolean       // 是否必须传入
}
// command 接口 end


// bili api 接口 start
// 视频信息
export type BiliVideo = {
    pic: string
    bvid: string
    play: number
    id : number
    danmaku: number
    title: string 
    author: string 
    senddate: number
    duration: string
    arcurl: string 
    mid: number
}
// 搜索结果分类信息
export interface BiliPageInfo {
    numResults: number
    total: number
    pages: number
}
// 根据类型返回的视频信息
export interface BiliTypeVideo extends BiliVideo { 
    type: string
}
// 搜索页信息
export interface BiliVideoSearchInfo {
    page: number
    pagesize: number
    numResults: number
    numPages: number
}
// bili api 接口 end
