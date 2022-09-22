
import { Command } from "../../interface/interface";
import { GetLogTable } from "./logCommandOutput";



// 日期,内容.根据日期分类.
const logCommand: Command = {
    name: 'log',
    desc: '个人日志',
    params: [],
    options: [],
    action(args, commandHandle) {
        // console.log(args);
        
        return <GetLogTable key={`log result ${new Date().getTime()}`} />
    }
}

export {
    logCommand
};