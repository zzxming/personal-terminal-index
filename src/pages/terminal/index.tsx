import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { throttle } from 'lodash'
import useBackgroundImage from "../../hooks/backgroundImage";
import useCommand from "../../hooks/command";
import { MarkNav } from "../../commands/markCommand/markCommandOutput";
import { TimeCount } from "../../commands/timeCommand/timeCommandOutput";
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from "../../assets/js/const";
import { localStorageGetItem } from "../../utils/localStorage";
import { CommandOutputStatus, ConfigData } from "../../interface/interface";
import css from './index.module.css'

const Terminal: React.FC = () => {

    const { imgurl } = useBackgroundImage();
    const commandHandle = useCommand();
    const { commands, historyCommands, historyCommandsIndex, setCommandHint, setHistoryCommandsIndex, excuteCommand } = commandHandle;
    const [hintTxt, setHintTxt] = useState('');
    const view = useRef<HTMLDivElement>(null);
    const inp = useRef<HTMLInputElement>(null);
    const [inputMargin, setInputMargin] = useState<number>(0);
    const [outputStyle, setOuptputStyle] = useState<React.CSSProperties>({});
    
    // localstorage更新
    useEffect(() => {
        configChange();

        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], configChange);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], configChange);
        }
    }, []);

    // localstorage中config初始化及更新处理函数
    const configChange = () => {
        let { style, mark } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setOuptputStyle(style ? style : {});
        setInputMargin((mark ? 58 : 0))
    }
  
    // 保持输入会在屏幕内,最下方
    useLayoutEffect(() => {
        scrollScream();
    });

    // 更新一定要在父组件, 不如不能引起app的render, 导致不能从hook中获取最新的commands
    function commit() {
        excuteCommand(inp.current?.value.trim() || '', commandHandle);
        inp.current && (inp.current.value = '');
        setHintTxt('');
        scrollScream();
    }
    // 输入框聚焦
    function focusInput(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        inp.current?.focus();
    }
    /** 保持输入框在视口内 */
    function scrollScream() {
        view.current && (view.current.scrollTop = view.current?.scrollHeight);
    }

    /**
     * 历史命令
     * @param {*} isBack 是否向上浏览历史命令
     */
    function rollBackCommand(isBack: boolean) {
        // console.log(historyCommands)
        let updatedIndex ;
        if (isBack) {
            updatedIndex = historyCommandsIndex - 1;
        } else {
            updatedIndex = historyCommandsIndex + 1;
        }
        // 防止越界
        if (updatedIndex < 0) {
            updatedIndex = 0;
        }
        if (updatedIndex > historyCommands.length - 1) {
            // 到最后一次输入, 超出则变成输入状态
            updatedIndex = historyCommands.length;
            inp.current && (inp.current.value = '');
            return;
        }
        
        setHistoryCommandsIndex(updatedIndex);
        let txt = historyCommands[updatedIndex]?.txt;
        // console.log(historyCommands, updatedIndex, isBack)
        if (!txt) return;

        inp.current && (inp.current.value = txt);
        inp.current && inp.current.setSelectionRange(inp.current.value.length, inp.current.value.length);
    }

    function keydownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        // console.log(e);
        const keyCode = e.key;
        // 当输入法存在时按回车key值为'Process, keyCode值为229, 普通回车key值为'Enter', keyCode为13'
        switch(keyCode) {
            case 'Enter': {
                commit();
                break;
            }
            case 'ArrowUp': {
                // 取消默认效果,不进行此操作会导致光标在input最前面
                e.preventDefault();
                rollBackCommand(true);
                break;
            }
            case 'ArrowDown': {
                rollBackCommand(false);
                break;
            }
            case 'Backspace': {
                throttleKeyPressEvnet();
                break;
            }
            case 'Tab': {
                    e.preventDefault();
                    completeCommandInput();
                break;
            }
            default: {
                break;
            }
        }
    }
    /** 根据输入字显示提示文字 */
    function keyPressEvent() {
        // console.log(inp.current)
        if (inp.current) {
            let commandStr = inp.current.value;
            // console.log(commandStr)
            let getCommand = setCommandHint(commandStr);
            // console.log(getCommand)
            setHintTxt(getCommand as any);
        }
    }
    const throttleKeyPressEvnet = throttle(keyPressEvent, 1000);
    /** 命令输入补全 */
    function completeCommandInput() {
        if (inp.current) {
            let inpStr = inp.current.value;
            let completeCommandName = setCommandHint(inpStr, true);
            // 如果返回补全命令比输入命令短, 代表输入有参数, 不需要补全
            if (completeCommandName.length > inpStr.length) {
                inp.current.value = completeCommandName;
            }
        }
    }


    return (
        <>
            <div className={css.terminal} onClick={focusInput} style={{backgroundImage: `url(${imgurl})`}}>
                <div className={css.terminal_mask} onClick={focusInput} style={outputStyle}>
                    <MarkNav />
                    <TimeCount />
                    <div ref={view} className={css.terminal_command} style={{top: `${inputMargin}px`,height: `calc(100% - ${inputMargin}px)`}}>
                        {
                            commands && commands.map((item) => (
                                <div key={'local' + item.key} className={css.command_result}>
                                    {
                                        item.isResult ? '' : <span className={css.terminal_user}>[local]:</span>
                                    }
                                    { 
                                        item.isResult ? 
                                            item.status === CommandOutputStatus.success ?
                                                '' : 
                                                    <span className={`${css.command_result_status} ${item.status === CommandOutputStatus.error ? css.error : css.warn}`}>
                                                        {item.status}
                                                    </span>: 
                                                    ''
                                    } { item.construct }
                                </div>
                            ))
                        }
                        <div className={css.terminal_input}>
                            <span className={css.terminal_user}>[local]:</span>
                            {/* 多行输入 */}
                            <input ref={inp} className={css.input_command} onKeyDown={keydownEvent} onChange={throttleKeyPressEvnet} />
                        </div>
                        {
                            hintTxt ?
                                <div className={css.terminal_hint}>
                                    hint: {hintTxt}
                                </div> : ''
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Terminal;

