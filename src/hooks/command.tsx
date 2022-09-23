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
        // 空命令直接输出
        if (command === '') {
            setCommands(commands => {
                // console.log(commands)
                return [...commands, {
                    construct: <div className={style.command_txt}></div>,
                    key: `empty ${new Date().getTime()}`, 
                    isResult
                }]
            });
            return;
        }
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
            console.log(commands)
            return [...commands, {
                construct: <div className={className}>{command}</div>,
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
     * @param commands 除命令外的命令字符串数组
     * @param option 命令的 options 选项, 若有则按 option 中的key返回
     * @returns 解析完成后对象, _为输入参数
     */
    function paramParse(commands: string[], option?: CommandOption[]) {
        const params: CommandParamArgs = {
            _: [],
        };

        for (let i = 0; i < commands.length; i++) {
            if (commands[i] === '') continue;

            let nowParams = commands[i];
            if (!nowParams.startsWith('-')) {
                params._.push(nowParams);
            } else {
                const alias = nowParams.slice(1);
                // 传递了option, 根据option判断此参数是否有效
                let commandOption: CommandOption | undefined;
                if (option) {
                    commandOption = option.find(item => item.alias === alias);
                    // option参数不存在
                    if (!commandOption) {
                        continue;
                    }
                }
                // 若没有传递option传递, 直接根据输入参数记录param
                if (!commands[i + 1] || commands[i + 1].startsWith('-')) {
                    params[alias] = true;
                    commandOption && (params[commandOption.key] = true);
                } else {
                    params[alias] = commands[i + 1];
                    commandOption && (params[commandOption.key] = commands[i + 1]);
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
        if (command.trim() === '') {
            pushCommands(command, false);
            return;
        }

        const commandFragment = command.split(' ');
        const resultCommand = searchCommand(commandFragment[0]);
        
        pushCommands(command, false);
        pushHistoryCommands(command);
        let result: string | React.ReactElement;
        if (resultCommand) {
            // 子命令检测
            let actionCommand = resultCommand;      // 最终执行命令
            let commandParams: CommandParamArgs = paramParse(commandFragment.slice(1)); // 命令参数
            do {
                // 是否有子命令
                if (actionCommand.subCommands.length < 1) {
                    break;
                }
                // 若子命令输入正确, 则改变最终执行命令, 并删除参数第一位子命令 name
                // 若输入错误则执行原本命令
                let subCommand = actionCommand.subCommands.find(subCommand => subCommand.name === commandParams._[0]);
                if (subCommand) {
                    actionCommand = subCommand;
                    commandParams._.splice(0, 1);
                }
                else {
                    break;
                }
            } while(true)

            // console.log(commandParams)
            // console.log(actionCommand)
            
            // 根据执行命令的option中key保存params参数
            const options = actionCommand.options;
            const paramsObj = { ...commandParams }
            for (let option of options) {
                if (paramsObj[option.alias]) {
                    paramsObj[option.key] = paramsObj[option.alias]
                }
            }
            // 确认param的数量正确
            const paramsCount = actionCommand.params.reduce((count, param) => param.required ? ++count : count, 0);
            // console.log(paramsCount)
            if (paramsObj._.length < paramsCount) {
                // param参数必须,但未输入
                pushCommands('param参数缺少', true);
                return;
            }
            // option参数, 赋默认值
            for (let i = 0; i < options.length; i++) {
                const item = options[i];
                const getValue = paramsObj[item.alias];
                // console.log(item)
                // console.log(!getValue, item.defaultValue)
                // option存在默认值, 输入option值为true或没有输入option值, 赋默认值
                if (item.defaultValue !== undefined && ((getValue && typeof getValue === 'boolean') || !getValue)) {
                    paramsObj[item.alias] = item.defaultValue;
                    paramsObj[item.key] = item.defaultValue;
                }
                // console.log(item, paramsObj[item.alias])
                if (item.legalValue && paramsObj[item.alias]) {
                    if (!Object.keys(item.legalValue).includes(paramsObj[item.alias].toString())) {
                        
                        pushCommands('option参数错误', true);
                        return;
                    }
                }
            }
            // 执行
            // console.log(paramsObj)
            result = await actionCommand.action(paramsObj, commandHandle);
        } else {
            // 命令不存在
            result = '命令不存在';
        }
        pushCommands(result, true);
        // console.log(commands)
    }
    /**
     * 
     * 显示的提示文字
     * @param str 当前输入命令
     * @param commands 查看命令范围
     * @returns 提示文字
     */
    function setHint(str: string, commands = commandMap): string {

        str = str.trim();
        // 空字符返回
        if (str === '') {
            return '';
        }
        let inpArr = str.split(' ');
        // 主命令输入
        let mainCommand = inpArr[0];
        let resultCommand = commands.filter(command => {
            return command.name.startsWith(mainCommand);
        })[0];

        if (!resultCommand) {
            return '';
        }
        // 是否存在子命令
        let subCommands = resultCommand.subCommands;
        if (subCommands.length > 0 && inpArr.length > 1) {
            return `${mainCommand} ${setHint(inpArr.slice(1).join(' '), subCommands)}`
        }
        
        return commandUseFunc(resultCommand);
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