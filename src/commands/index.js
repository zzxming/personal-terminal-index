import { commandMap } from "./registerCommand";

function searchCommand(command) {
    return commandMap.find(existCommand => command === existCommand.name) || null;
}

function commandUseFunc(command) {
    if (!command) return;
    function isRequired(required, desc) {
        return required ? `<${desc}>` : `[${desc}]`;
    }
    
    const name = command.name;
    let param = '';
    if (command.param) {
        param = isRequired(command.param.required, command.param.desc);
    }
    let option = '';
    command.option.forEach(item => {
        option += ' ' + isRequired(item.required, `-${item.alias} ${item.desc}`);
    });

    return `${name} ${param} ${option}`;
}

export {
    commandMap,
    searchCommand,
    commandUseFunc
}
