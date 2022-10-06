import { searchCommand } from "..";
import { Command, CommandOutputStatus } from "../../interface/interface";
import { commandDetail, commandList } from "./helpCommandOutput";


const helpCommand: Command = {
    name: 'help',
    desc: '查看命令帮助',
    params: [
        {
            key: 'command',
            desc: '命令名称',
            required: false
        }
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(commandMap)
        const { _ } = args;

        if (_.length < 1) {
            // 没有param参数, 直接输出command list
            return {
                constructor: commandList(),
                status: CommandOutputStatus.success
            }
        } else {
            let getCommand = searchCommand(_.join(' '));
            if (!getCommand) {
                return {
                    constructor: '没找到命令',
                    status: CommandOutputStatus.error
                }
            }
            return {
                constructor: commandDetail(getCommand),
                status: CommandOutputStatus.success
            }
        }
    }
}

export {
    helpCommand
}


