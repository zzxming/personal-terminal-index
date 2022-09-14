import { Command } from "../interface/interface";
import { commandMap } from "./registerCommand";

function searchCommand(command: string) {
    return commandMap.find(existCommand => command === existCommand.name) || null;
}

function commandUseFunc(command: Command): string {
    if (!command) return '';
    function isRequired(required: boolean, desc: string) {
        return required ? `<${desc}>` : `[${desc}]`;
    }
    
    const name = command.name;
    let param = '';
    if (command.param && Object.keys(command.param).length > 0) {
        param = isRequired(command.param.required, command.param.desc);
    }
    let option = '';
    command.option.forEach(item => {
        option += ' ' + isRequired(false, `-${item.alias} ${item.desc}`);
    });
    return `${name} ${param} ${option}`;
}

export {
    commandMap,
    searchCommand,
    commandUseFunc
}
