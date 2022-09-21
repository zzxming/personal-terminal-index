import css from './index.module.css'
import { commandMap } from '../registerCommand'
import { commandUseFunc } from '..'
import { Table, TableColumnsType } from 'antd'
import { Command, CommandOption, legalValueType } from '../../interface/interface'

interface LegalValueTable {
    key: string
    value: any
}

const commandList = () => (
    <div className={css.command_list} key={new Date().getTime() + 'help'}>
        <p className={css.command_list_txt}>命令列表:</p>
        {
            commandMap.map(item => {
                return (
                    <div className={css.command_item} key={item.name}>
                        <div className={css.command_command}>{item.name}</div>
                        <div className={css.command_desc}>{item.desc}</div>
                    </div>
                )
            })
        }
    </div>
)

const commandDetail = (command: Command) => {
    if (!command) {
        return '命令不存在';
    }
    
    const { name, desc, param, option } = command;

    // 考虑一行展示两个参数, 即 '参数 描述 参数 描述'
    const legalTable = (legalValue: legalValueType<CommandOption<any>, 'legalValue'>) => {
        if (!legalValue) return ('');
        const columns: TableColumnsType<LegalValueTable> = [
            { title: '参数', dataIndex: 'key' },
            { title: '描述', dataIndex: 'value' },
        ];
        const dataSource: LegalValueTable[] = []

        for (let item in legalValue) {
            dataSource.push({
                key: item,
                value: legalValue[item]
            });
        }
        // console.log(dataSource)
        // console.log(columns)
        return (<Table pagination={false} dataSource={dataSource} columns={columns} scroll={{ y: 240 }} style={{overflowY: 'auto'}} />)
    }
    
    return (
        <div key={`command help ${name} result ${new Date().getTime()}`}>
            <p className={css.command_list_txt}>命令: {desc}</p>
            <p className={css.command_list_txt}>用法: {commandUseFunc(command)}</p>
            {
                param ? 
                    <div>
                        <p className={css.command_list_txt}>参数: </p>
                        <ul className={css.command_option_list}>
                            <li>{param.key} {param.required ? '必填' : '可选'} {param.desc}</li>
                        </ul>
                    </div> : 
                    ''
            }
            
            {
                option.length > 0 ? 
                    <div>
                        <p className={css.command_list_txt}>选项: </p>
                        <ul className={css.command_option_list}>
                            {
                                option.map(item => (
                                    <li key={item.key}>
                                        -{item.alias},{item.key} {'可选'} {item.desc} {item.valueNeeded ? `默认值: ${item.defaultValue}` : ''} 
                                        {legalTable(item.legalValue)}
                                    </li>
                                ))
                            }
                        </ul>
                    </div> :
                    ''
            }
        </div>
    )
}


export {
    commandList,
    commandDetail
}
