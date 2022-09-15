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
        const sortHistoryCommands = [...historyCommands].reverse();
        const showHistoryCommands = num === 0 ? sortHistoryCommands : sortHistoryCommands.slice(0, num);

        // console.log(sortHistoryCommands)

        return (
            <div key={`history result ${new Date().getTime()}`} className={style.history}>
                <List
                    itemLayout="vertical"
                    dataSource={showHistoryCommands}
                    renderItem={(item, index) => (
                        <li className={style.history_item}>
                            {index + 1} {item.txt}
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


    