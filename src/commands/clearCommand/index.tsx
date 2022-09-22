
import { Command } from '../../interface/interface';

const clearCommand: Command = {
    name: 'clear',
    desc: '清屏',
    params:  [],
    options: [],
    action(args, commandHandle) {
        // console.log(commandHandle)
        commandHandle.clearCommand();
        return '';
    }
}

export {
    clearCommand
}