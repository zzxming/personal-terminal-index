import { Command, ConfigData, openType } from "../../interface/interface";
import { clearCommand } from "./subComand/clearCommand";
import { colorCommand } from "./subComand/colorCommand";
import { openCommand } from "./subComand/openCommand";


const configCommand: Command = {
    name: 'config',
    desc: '配置选项',
    params: [
        {
            key: 'sub',
            desc: '配置选项',
            required: true
        }
    ],
    options: [
        {
            key: 'list',
            alias: 'l',
            desc: '列表形式展示所有配置属性',
            valueNeeded: false
        }
    ],
    subCommands: [
        openCommand,
        colorCommand,
        clearCommand,
    ],
    action(args, commandHandle) {
        console.log(args)
        const { list } = args;


        return ''
    }
}

const initValLocalStorageConfig = (): ConfigData => {
    return {
        open: openType.blank,
        style: {}
    }
}

export {
    configCommand,
    initValLocalStorageConfig
}
