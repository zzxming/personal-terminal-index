import { CommandResultListOutput } from '../../components/commandListOutput';
import { HistoryCommand } from '../../hooks/command';
import { Command } from '../../interface/interface';

const historyCommand: Command = {
    name: 'history',
    desc: '查看历史命令',
    params: [
        {
            key: 'num',
            desc: '显示历史条数',
            required: false
        }
    ],
    options: [],
    subCommands: [],
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
        showHistoryCommands.reverse();

        // console.log(sortHistoryCommands)

        return (
            <CommandResultListOutput<HistoryCommand> 
                key={`history result ${new Date().getTime()}`}
                data={showHistoryCommands} 
                render={(item, index) => (
                    <li>
                        {index + 1} {item.txt}
                    </li>
                )} 
            />
        )
    }
}


export {
    historyCommand
}


    