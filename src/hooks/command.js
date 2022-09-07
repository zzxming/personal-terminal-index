import { useEffect, useState } from "react";
import { commandUseFunc, searchCommand } from '../commands/index'
import { commandMap } from '../commands/registerCommand'
import style from '../assets/css/command.module.css'

function useCommand() {
    // commands内存jsx或者文本命令,history内存string(命令原文本)
    const [commands, setCommands] = useState([]);
    const [historyCommands, setHistoryCommands] = useState([]);
    const [historyCommandsIndex, setHistoryCommandsIndex] = useState(historyCommands);

    useEffect(() => {
        setHistoryCommandsIndex(historyCommands.length);
    }, [historyCommands]);

    function pushCommands(command) {
        if (command === '') return;
        let key = new Date().getTime() + command;
        // 当命令不是字符串时,元素需要key值不正确
        // console.log(command)
        if (typeof command !== 'string' && !command.props?.renderkey) {
            console.log(command)
            throw new Error('参数错误, 元素key值不存在');
        }
        else if (typeof command !== 'string') {
            key = command.props.renderkey;
        }

        let className = style.command_iframe;
        if (typeof command === 'string') {
            className = style.command_txt;
        }
        // console.log(typeof command)
        setCommands(commands => {
            // console.log(command)
            return [...commands, {
                construct: <div className={className}>{command}</div>,
                key 
            }]
        });
    }

    function pushHistoryCommands(command) {
        setHistoryCommands(commands => {
            return [...commands, { txt: command }]
        });
    }

    function clearCommand() {
        setCommands([]);
    }

    /**
     * 解析参数和选项
     * @param {*} commands 除命令外的命令字符串数组
     * @returns 解析完成后对象, _为输入参数
     */
    function paramParse(commands, option) {
        const params = {
            _: [],
        };

        for (let i = 0; i < commands.length; i++) {
            let nowParams = commands[i];
            if (!nowParams.startsWith('-')) {
                params._.push(nowParams);
            } else {
                const alias = nowParams.slice(1);
                const commandOption = option.find(item => item.alias === alias);
                if (!commands[i + 1] || commands[i + 1].startsWith('-')) {
                    params[alias] = true;
                    params[commandOption.key] = true;
                } else {
                    params[alias] = commands[i + 1];
                    params[commandOption.key] = commands[i + 1];
                    i += 1;
                }
            }
        }

        // console.log(commands)
        // console.log(params)
        return params
    }

    async function excuteCommand(command, commandHandle) {
        console.log('excute', command)
        pushCommands(command);
        if (command.trim() === '') return;
        pushHistoryCommands(command);

        const commandFragment = command.split(' ');
        const resultCommand = searchCommand(commandFragment[0]);


        let result;
        if (resultCommand) {
            // params参数检测
            // console.log(commandParams)
            // console.log(resultCommand)
            const option = resultCommand.option;
            const paramsObj = paramParse(commandFragment.slice(1), option);
            if (resultCommand.param.required && paramsObj._.length < 1) {
                // param参数必须,但未输入
                pushCommands('param参数缺少');
                return;
            }
            // option参数, 赋默认值
            for (let i = 0; i < option.length; i++) {
                const item = option[i];
                const getValue = paramsObj[item.alias];
                // console.log(item)
                // console.log(!getValue, item.defaultValue)
                if (!getValue && item.defaultValue !== undefined) {
                    paramsObj[item.alias] = item.defaultValue;
                    paramsObj[item.key] = item.defaultValue;
                }
            }
            
            // console.log(paramsObj)
            result = await resultCommand.action.call(resultCommand, paramsObj, commandHandle);
















            // const param = resultCommand.param;
            // const option = resultCommand.option;
            // let commandFragmentObj = {};
            // // params参数检测
            // let commandParams = commandFragment[1];
            // let commandOption = commandFragment.slice(1) ?? [];
            // if (param.required && !commandParams) {
            //     // param参数必须,但未输入
            //     pushCommands('param参数缺少');
            //     return;
            // } else if (commandParams && !commandParams.startsWith('-')) {
            //     // 输入了param参数,option从下标2开始
            //     commandFragmentObj.param = commandParams;
            //     commandOption = commandFragment.slice(2) ?? [];
            // } else {
            //     // param参数没输入
            //     commandFragmentObj.param = undefined;
            // }
            // // option参数
            // // console.log(commandOption)
            // for (let i = 0; i < option.length; i++) {
            //     const item = option[i];
            //     let value = item.defaultValue;
            //     let index = commandOption.findIndex(i => i === `-${item.alias}`);
            //     if (index !== -1) {
            //         if (!item.valueNeeded) {
            //             value = true;
            //         }
            //         console.log(commandOption, index)
            //         value = commandOption[index + 1];
            //         commandOption.splice(index, 2);
            //         if (!value) {
            //             // value = item.defaultValue ?? true;
            //             pushCommands('option选项缺少');
            //             return;
            //         }
            //     }
            //     // console.log(value)
               
            //     commandFragmentObj[item.key] = value;
            // }

            // for (let i = 0; i < commandOption.length; i++) {
            //     let optionItem = option.find(item => commandOption[i] === `-${item.alias}`);
            //     // console.log(optionItem)
            //     if (!optionItem) {
            //         continue;
            //     }
            //     commandFragmentObj[optionItem.key] = commandOption[i + 1];
            // }
            // // console.log(commandFragmentObj)

            // result = await resultCommand.action.call(resultCommand, commandFragmentObj, option);
        } else {
            // 命令不存在
            result = '命令不存在';
        }
        pushCommands(result);
        // console.log(commands)
        // return result;
    }

    function setHint(str) {
        if (str.trim().length < 1) {
            return '';
        }
        let resultCommand = commandMap.filter(command => {
            return command.name.startsWith(str);
        });
        
        // console.log(resultCommand[0])
        return commandUseFunc(resultCommand[0]);
    }


    return {
        commands,
        historyCommands,
        historyCommandsIndex,
        clearCommand,
        setHistoryCommandsIndex,
        excuteCommand,
        setHint,
        pushCommands
    }
}


export default useCommand;
