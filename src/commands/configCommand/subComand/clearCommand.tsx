import { initValLocalStorageConfig } from "..";
import { LOCALSTORAGECONFIG } from "../../../assets/js/const";
import { Command, ConfigData } from "../../../interface/interface";
import { localStorageSetItem } from "../../../utils/localStorage";


const clearCommand: Command = {
    name: 'clear',
    desc: '重置配置项',
    params: [],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        localStorageSetItem(LOCALSTORAGECONFIG, initValLocalStorageConfig());
        return '配置项已重置'
    }
}

export {
    clearCommand
}
