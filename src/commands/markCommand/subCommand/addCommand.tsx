import { getURLDomain } from "..";
import { LOCALSTORAGEMARK, LOCALSTORAGEMARKEVENT } from "../../../assets/js/const";
import { Command, MarkData } from "../../../interface/interface";
import { localStorageGetItem, localStorageSetItem } from "../../../utils/localStorage";

const addMark: Command = {
    name: 'add',
    desc: '添加书签',
    params: [
        {
            key: 'name',
            desc: '书签名称',
            required: true,
            
        }, {
            key: 'url',
            desc: '书签网址',
            required: true,
        }
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _ } = args;

        const paramVal: { [key: string]: string } = {}
        paramVal['url'] = _[_.length - 1];
        paramVal['name'] = _.slice(0, _.length - 1).join(' ')
        // console.log(paramVal)

        let preMark = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        if (!preMark) {
            preMark = {
                show: true,
                data: []
            };
        } 
        if (preMark.data.find(mark => mark.key === paramVal.name)) {
            return `书签 ${paramVal.name} 已存在`;
        }
        // 获取目标页面的图标
        // console.log(paramVal)
        let url = paramVal.url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`
        }
        let iconUrl = `https://${getURLDomain(url)}/favicon.ico`;
        // console.log(iconUrl)
        let data = [...preMark.data, {
            key: paramVal.name,
            title: paramVal.name,
            url,
            icon: iconUrl
        }]
        localStorageSetItem(LOCALSTORAGEMARK, { ...preMark, data }, LOCALSTORAGEMARKEVENT)
        
        return '添加成功'
    }
}





export {
    addMark
}