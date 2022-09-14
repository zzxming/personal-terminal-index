
import { Command } from '../../interface/interface';

const command: Command = {
    name: 'clear',
    desc: '清屏',
    param:  null,
    option: [],
    action(args, commandHandle) {
        // console.log(commandHandle)
        commandHandle.clearCommand();
        return '';
    }
}

export {
    command
}