import { LOCALSTORAGEMARK, LOCALSTORAGEMARKEVENT } from "../../assets/js/const";
import { Command } from "../../interface/interface";
import { localStorageSetItem, localStorageGetItem } from "../../utils/localStorage";
import { addMark } from "./subCommand/addCommand";
import { delMark } from "./subCommand/delCommand";


const markCommand: Command= {
    name: 'mark',
    desc: '书签收藏夹',
    params: [
        {
            key: 'subCommand',
            desc: '子命令',
            required: false
        }    
    ],
    options: [
        {
            key: 'show',
            alias: 's',
            desc: '显示所有书签',
            valueNeeded: true,
            legalValue: {
                'on': true,
                'off': false
            }
        }
    ],
    subCommands: [
        addMark,
        delMark
    ],
    action(args, commandHandle) {
        console.log(args)

        const { _, show } = args;
        if (show) {
            localStorageSetItem(LOCALSTORAGEMARK, {...localStorageGetItem(LOCALSTORAGEMARK), show: show === 'on' ? true : false}, LOCALSTORAGEMARKEVENT)
            return '配置成功'
        }

        return '命令语法不正确'
    }
}

export {
    markCommand
}

