import { Command } from "../../interface/interface";
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
    options: [],
    subCommands: [
        openCommand
    ],
    action(args, commandHandle) {
        // 不会进入
        console.log(args)

        return ''
    }
}

export {
    configCommand
}
