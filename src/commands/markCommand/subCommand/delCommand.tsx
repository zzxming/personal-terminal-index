import { LOCALSTORAGEMARK, LOCALSTORAGEMARKEVENT } from "../../../assets/js/const";
import { Command, MarkData } from "../../../interface/interface";
import { localStorageGetItem, localStorageSetItem } from "../../../utils/localStorage";

const delMark: Command = {
    name: 'del',
    desc: '添加书签',
    params: [
        {
            key: 'name',
            desc: '书签名称',
            required: true,
            
        }
    ],
    options: [],
    subCommand: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _ } = args;
        const name = _.join(' ');
        // console.log(paramVal)

        let preMark = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        if (preMark && preMark.data) {
            let data = [...preMark.data];
            let i = data.findIndex(mark => mark.key === name);
            if (i !== -1) {
                data.splice(i ,1);
            }
            localStorageSetItem(LOCALSTORAGEMARK, { ...preMark, data }, LOCALSTORAGEMARKEVENT)
        }
        
        return '删除成功'
    }
}

export {
    delMark
}