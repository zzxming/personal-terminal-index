import { getBackgroundImageUrl, ImageType } from "../../assets/js/api"
import { LOCALSTORAGEBGURL, LOCALSTORAGECONFIG } from "../../assets/js/const";
import { Command, ConfigData } from "../../interface/interface";
import { localStorageGetItem, localStorageSetItem } from "../../utils/localStorage";

const backgroundCommand: Command = {
    name: 'bg',
    desc: '切换背景图片',
    params: [
        {
            key: 'url',
            desc: '图片路径',
            required: false,
        }
    ],
    options: [
        {
            key: 'type',
            alias: 't',
            desc: '图片类型',
            defaultValue: 'suiji',
            valueNeeded: true,
            legalValue: {
                meizi: '妹子',
                dongman: '动漫',
                fengjing: '风景',
                suiji: '随机'
            }
        }
    ],
    subCommands: [],
    async action(args, commandHandle) {
        const { _, type } = args;

        if (_.length > 0) {
            // 输入了param,作为图片路径
            localStorageSetItem(LOCALSTORAGECONFIG, { ...localStorageGetItem(LOCALSTORAGECONFIG), bgurl: _[0]});
            return '更换成功';
        }
        commandHandle.pushCommands('等待加载...', true);
        const [err, result] = await getBackgroundImageUrl(type as ImageType);
        if (err) {
            // console.log(err)
            return err.response?.statusText || err.message
        }
        if (result.data.code !== 0) {
            return '网络错误';
        }
        localStorageSetItem(LOCALSTORAGECONFIG, { ...localStorageGetItem(LOCALSTORAGECONFIG), bgurl: result.data.data});
        return '更换成功';
    }
}

export {
    backgroundCommand
}

