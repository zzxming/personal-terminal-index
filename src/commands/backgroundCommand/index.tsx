import { getBackgroundImageUrl, ImageType } from "../../assets/js/api"
import { LOCALSTORAGEBGURL } from "../../assets/js/const";
import { Command } from "../../interface/interface";
import { localStorageSetItem } from "../../utils/localStorage";

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
    subCommand: [],
    async action(args, commandHandle) {
        const { _, type } = args;

        if (_.length > 0) {
            // 输入了param,作为图片路径
            localStorageSetItem(LOCALSTORAGEBGURL, _[0]);
            return '更换成功';
        }

        const [err, result] = await getBackgroundImageUrl(type as ImageType);
        if (err) {
            // console.log(err)
            return err.response?.statusText || err.message
        }
        if (result.data.data === '') {
            return '请求失败';
        }
        localStorageSetItem(LOCALSTORAGEBGURL, result.data.data);
        return '更换成功';
    }
}

export {
    backgroundCommand
}

