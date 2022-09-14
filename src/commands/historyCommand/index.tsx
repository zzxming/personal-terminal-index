import { List } from 'antd';
import { Command } from '../../interface/interface';
import style from './index.module.css'

const command: Command = {
    name: 'history',
    desc: '查看历史命令',
    param: {
        key: 'num',
        desc: '显示历史条数',
        required: false
    },
    option: [],
    async action(args, commandHandle) {
        // console.log(args)
        const { _ } = args;
        const num = Number(_.join(' '));
        if (isNaN(num) || num < 0) {
            return '请输入合法数字参数';
        }
        const { historyCommands } = commandHandle;
        const showHistoryCommands = num === 0 ? historyCommands : historyCommands.slice(0, num);

        // console.log(showHistoryCommands)

        return (
            <div key={new Date().getTime() + 'history'} className={style.history}>
                <List
                    itemLayout="vertical"
                    dataSource={showHistoryCommands}
                    renderItem={(item, index) => (
                        <li className={style.history_item}>
                            {index} {item.txt}
                        </li>
                    )}
                />
            </div>
        )
    }
}


export {
    command
}


    