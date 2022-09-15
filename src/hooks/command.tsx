import React, { useEffect, useState } from "react";
import { commandUseFunc, searchCommand } from '../commands/index'
import { commandMap } from '../commands/registerCommand'
import style from '../assets/css/command.module.css'
import { CommandOption } from "../interface/interface";

interface Command {
    key: string
    construct: React.ReactElement
    isResult: boolean
}
interface HistoryCommand {
    txt: string
}
export interface CommandParamArgs {
    [x: string]: string | boolean | number | string[],
    _: string[]
}
export interface UseCommandHook {
    commands: Command[]
    historyCommands: HistoryCommand[]
    historyCommandsIndex: number
    clearCommand: () => void
    setHistoryCommandsIndex: React.Dispatch<React.SetStateAction<number>>
    excuteCommand: (command: string, commandHandle: UseCommandHook) => void
    setHint: (str: string) => string
    pushCommands: (command: React.ReactElement | string, isResult: boolean) => void
}
const useCommand = (): UseCommandHook => {
    // commands内存jsx或者文本命令,history内存string(命令原文本)
    const [commands, setCommands] = useState<Command[]>([]);
    // 历史命令
    const [historyCommands, setHistoryCommands] = useState<HistoryCommand[]>([]);
    // 当前显示历史命令下标
    const [historyCommandsIndex, setHistoryCommandsIndex] = useState(historyCommands.length);


    // 更新 historyCommand 的下标
    useEffect(() => {
        setHistoryCommandsIndex(historyCommands.length);
    }, [historyCommands]);

    function pushCommands(command: React.ReactElement | string, isResult: boolean) {
        if (command === '') return;
        // 当命令不是字符串时,元素需要key值不正确
        if (typeof command !== 'string' && !command.key) {
            // console.log(command)
            throw new Error('参数错误, 元素key值不存在');
        }
        
        let key: string;
        if (typeof command === 'string') {
            key = `input ${command} ${new Date().getTime()}`;
        }
        else {
            key = command.key?.toString() ?? new Date().getTime().toString();
        }
        // console.log(command)

        let className = style.command_iframe;
        if (typeof command === 'string') {
            className = style.command_txt;
        }
        // console.log(typeof command)
        setCommands(commands => {
            // console.log(commands)
            return [...commands, {
                construct: <div className={className} onClick={(e) => e.stopPropagation()}>{command}</div>,
                key, isResult
            }]
        });
    }
    /**
     * 新增历史命令
     * @param {*} command 命令字符串
     */
    function pushHistoryCommands(command: string) {
        setHistoryCommands(commands => {
            return [...commands, { txt: command }]
        });
    }
    /**
     * 清屏
     */
    function clearCommand() {
        setCommands([]);
    }

    /**
     * 解析参数和选项
     * @param {*} commands 除命令外的命令字符串数组
     * @returns 解析完成后对象, _为输入参数
     */
    function paramParse(commands: string[], option: CommandOption<any>[]) {
        const params: CommandParamArgs = {
            _: [],
        };

        for (let i = 0; i < commands.length; i++) {
            let nowParams = commands[i];
            if (!nowParams.startsWith('-')) {
                params._.push(nowParams);
            } else {
                const alias = nowParams.slice(1);
                const commandOption = option.find(item => item.alias === alias);
                // option参数不存在
                if (!commandOption) {
                    continue;
                }
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
    /**
     * 执行字符串命令
     * @param command 命令字符串
     * @param commandHandle command hook
     */
    async function excuteCommand(command: string, commandHandle: UseCommandHook) {
        console.log('excute', command)
        pushCommands(command, false);
        if (command.trim() === '') return;
        pushHistoryCommands(command);

        const commandFragment = command.split(' ');
        const resultCommand = searchCommand(commandFragment[0]);

        let result: string | React.ReactElement;
        if (resultCommand) {
            // params参数检测
            // console.log(commandParams)
            // console.log(resultCommand)
            const option = resultCommand.option;
            const paramsObj = paramParse(commandFragment.slice(1), option);
            if (resultCommand.param?.required && paramsObj._.length < 1) {
                // param参数必须,但未输入
                pushCommands('param参数缺少', true);
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
            result = await resultCommand.action(paramsObj, commandHandle);
        } else {
            // 命令不存在
            result = '命令不存在';
        }
        pushCommands(result, true);
        // console.log(commands)
        // return result;
    }
    /**
     * 显示的提示文字
     * @param str 当前输入命令
     * @returns 提示文字
     */
    function setHint(str: string): string {
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