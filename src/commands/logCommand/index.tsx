
import { Command } from "../../interface/interface";
import { LogTable } from "./logCommandOutput";



// 日期,内容.根据日期分类.
const command: Command = {
    name: 'log',
    desc: '个人日志',
    param: null,
    option: [],
    action(args, commandHandle) {
        // console.log(args);
        
        return <LogTable key={`log result ${new Date().getTime()}`} />
    }
}

export {
    command
};