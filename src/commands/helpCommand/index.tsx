import { searchCommand } from "..";
import { Command } from "../../interface/interface";
import { commandDetail, commandList } from "./helpCommandOutput";


const command: Command = {
    name: 'help',
    desc: '查看命令帮助',
    param: {
        key: 'command',
        desc: '命令名称',
        required: false
    },
    option: [],
    action(args, commandHandle) {
        // console.log(commandMap)
        const { _ } = args;

        if (_.length < 1) {
            // 没有param参数, 直接输出command list
            return commandList()
        } else {
            let getCommand = searchCommand(_.join(' '));
            if (!getCommand) return '没找到命令'
            return commandDetail(getCommand);
        }
    }
}

export {
    command
}


