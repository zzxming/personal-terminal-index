import { useRef, useLayoutEffect, useState, useEffect } from "react";
import useBackgroundImage from "../../hooks/backgroundImage";
import useCommand from "../../hooks/command";
import css from './index.module.css'
import { throttle } from 'lodash'
import { MarkList } from "../../commands/markCommand/markListOutput";
import { LOCALSTORAGEMARK, LOCALSTORAGEMARKEVENT } from "../../assets/js/const";
import { localStorageGetItem } from "../../utils/localStorage";
import { MarkData } from "../../interface/interface";

const Terminal: React.FC = () => {

    const { imgurl } = useBackgroundImage();
    const commandHandle = useCommand();
    const { commands, historyCommands, historyCommandsIndex, setHint, setHistoryCommandsIndex, excuteCommand } = commandHandle;
    const [hintTxt, setHintTxt] = useState('')
    const view = useRef<HTMLDivElement>(null);
    const inp = useRef<HTMLInputElement>(null);
    const [inputMargin, setInputMargin] = useState<number>(0);
    
    useEffect(() => {
        markChangedVisible();
        window.addEventListener(LOCALSTORAGEMARKEVENT, markChangedVisible)
        return () => {
            window.removeEventListener(LOCALSTORAGEMARKEVENT, markChangedVisible)
        }
    }, []);

    const markChangedVisible = () => {
        let mark = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        console.log(mark)
        setInputMargin((mark.show ? 58 : 0))
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
            updatedIndex = (historyCommandsIndex as unknown as number) - 1;
        } else {
            updatedIndex = (historyCommandsIndex as unknown as number) + 1;
        }


        
        setHistoryCommandsIndex((historyCommandsIndex as unknown as any));
        let txt = (historyCommands[updatedIndex] as any)?.txt;
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
                throttleKeyPressEvnet(e);
                break;
            }
            default: {
                break;
            }
        }
    }

    function keyPressEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        // console.log(e)
        if (!e || e.key === 'Enter') return;
        // console.log(inp.current)
        if (inp.current) {
            let commandStr = inp.current?.value.split(' ');
            // console.log(commandStr)
            let getCommand = setHint(commandStr[0]);
            // console.log(getCommand)
            setHintTxt(getCommand as any);
        }
    }
    const throttleKeyPressEvnet = throttle(keyPressEvent, 1000);

    return (
        <>
            <div className={css.terminal} onClick={focusInput} style={{backgroundImage: `url(${imgurl})`}}>
                <div className={css.terminal_mask} onClick={focusInput}>
                    <MarkList />
                    <div ref={view} className={css.terminal_command} style={{top: `${inputMargin}px`,height: `calc(100% - ${inputMargin}px)`}}>
                        {
                            commands && commands.map((item) => (
                                <div className={css.command_result} key={'local' + item.key}>
                                    {
                                        item.isResult ? '' : <span className={css.terminal_user}>[local]:</span>
                                    }
                                    { item.construct }
                                </div>
                            ))
                        }
                        <div className={css.terminal_input}>
                            <span className={css.terminal_user}>[local]:</span>
                            <input ref={inp} className={css.input_command} onKeyDown={keydownEvent} onKeyPress={throttleKeyPressEvnet} />
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

