import { getBackgroundImageUrl, ImageType } from "../../assets/js/api"
import { Command } from "../../interface/interface";
import { localStorageSetItem } from "../../utils/localStorage";

const command: Command = {
    name: 'bg',
    desc: '切换背景图片',
    param: {
        key: 'url',
        desc: '图片路径',
        required: false,
    },
    option: [
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
    async action(args, commandHandle) {
        const { _, type } = args;

        if (_.length > 0) {
            // 输入了param,作为图片路径
            localStorageSetItem('bgurl', _[0]);
            return '更换成功';
        }

        const result = await getBackgroundImageUrl(type as ImageType);
        if (result.data.data === '') {
            return '请求失败';
        }
        localStorageSetItem('bgurl', result.data.data);
        return '更换成功';
    }
}

export {
    command
}

