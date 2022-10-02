import { LOCALSTORAGECONFIG } from "../../assets/js/const";
import { CommandResultListOutput } from "../../components/commandListOutput";
import { Command, ConfigData, openType } from "../../interface/interface";
import { localStorageGetItem } from "../../utils/localStorage";
import { clearCommand } from "./subComand/clearCommand";
import { colorCommand } from "./subComand/colorCommand";
import { openCommand } from "./subComand/openCommand";
import css from './index.module.css'

const configCommand: Command = {
    name: 'config',
    desc: '配置选项',
    params: [
        {
            key: 'sub',
            desc: '配置选项',
            required: false
        }
    ],
    options: [
        {
            key: 'list',
            alias: 'l',
            desc: '列表形式展示所有配置属性',
            valueNeeded: false
        }
    ],
    subCommands: [
        openCommand,
        colorCommand,
        clearCommand,
    ],
    action(args, commandHandle) {
        // console.log(args)
        const { list } = args;

        if (list) {
            let config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
            if (!config) {
                return ''
            }
            let configList = (Object.keys(config) as (keyof ConfigData)[]).map(key => {
                return {
                    key,
                    value: config[key]
                }
            })
            // console.log(configList)
            return (
                <div
                    key={`config list result ${new Date().getTime()}`}
                >
                    <CommandResultListOutput<typeof configList[0]> 
                        data={configList} 
                        render={(item, index) => {
                            let { key, value } = item;
                            let valueDom: typeof value | React.ReactElement;
                            if (typeof value === 'object') {
                                let data = Object.keys(value).map(key => ({
                                    key,
                                    value: (value as {[key: string]: string})[key]
                                }))
                                valueDom = <CommandResultListOutput<typeof data[0]> 
                                    data={data} 
                                    render={(item) => (
                                        <li>
                                            <span>{item.key} - {item.value}</span>
                                        </li>
                                    )}
                                />
                            }
                            else {
                                valueDom = value;
                            }
                            return (
                                <li className={css.config_list_item}>
                                    <span className={`${css.config_list_item_value} ${css.key}`}>{key}</span>
                                    -
                                    <span className={`${css.config_list_item_value} ${css.value}`}>{valueDom}</span>
                                </li>
                            )
                        }}
                    />
                </div>
            )
        }
        return '';
    }
}

const initValLocalStorageConfig = (): ConfigData => {
    return {
        open: openType.blank,
        style: {},
        mark: true,
        bgurl: '',
        time: false,
    }
}

export {
    configCommand,
    initValLocalStorageConfig
}
