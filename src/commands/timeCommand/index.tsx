import { LOCALSTORAGECONFIG } from "../../assets/js/const";
import { Command, ConfigData } from "../../interface/interface";
import { localStorageGetItem, localStorageSetItem } from "../../utils/localStorage";

const timeCommand: Command = {
    name: 'time',
    desc: '显示当前时间',
    params: [],
    options: [
        {
            key: 'show',
            desc: '始终显示当前时间',
            alias: 's',
            valueNeeded: false,
            legalValue: {
                'on': '开启',
                'off': '关闭'
            }
        }
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _, show } = args;

        if (show) {
            localStorageSetItem(LOCALSTORAGECONFIG, { ...localStorageGetItem(LOCALSTORAGECONFIG), time: show === 'on' ? true : false });
            return '配置成功';
        }
        if (_.length < 1) {
            let nowDate = new Date();
            return `${nowDate.toLocaleDateString()} ${nowDate.toLocaleTimeString()}`
        }

        return '参数错误';
    }
}

export {
    timeCommand
}

