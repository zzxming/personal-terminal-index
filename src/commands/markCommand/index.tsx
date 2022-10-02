import { Avatar, Card } from "antd";
import { GlobalOutlined } from '@ant-design/icons';
import { LOCALSTORAGECONFIG, LOCALSTORAGEMARK } from "../../assets/js/const";
import { CommandResultListOutput } from "../../components/commandListOutput";
import { Command, Mark, MarkData } from "../../interface/interface";
import { localStorageSetItem, localStorageGetItem } from "../../utils/localStorage";
import { addMark } from "./subCommand/addCommand";
import { delMark } from "./subCommand/delCommand";
import css from './index.module.css'
import { modifyMark } from "./subCommand/modifyCommand";


const markCommand: Command= {
    name: 'mark',
    desc: '书签收藏夹',
    params: [
        {
            key: 'subCommand',
            desc: '子命令',
            required: false
        }    
    ],
    options: [
        {
            key: 'show',
            alias: 's',
            desc: '始终显示书签',
            valueNeeded: true,
            legalValue: {
                'on': '开启',
                'off': '关闭'
            }
        }, {
            key: 'list',
            alias: 'l',
            desc: '列表形式展示所有书签',
            valueNeeded: false
        }
    ],
    subCommands: [
        addMark,
        delMark,
        modifyMark,
    ],
    action(args, commandHandle) {
        // console.log(args)

        const { _, show, list } = args;
        if (show) {
            localStorageSetItem(LOCALSTORAGECONFIG, { ...localStorageGetItem(LOCALSTORAGECONFIG), mark: show === 'on' ? true : false })
            return '配置成功'
        }
        if (list) {
            let { data } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
            
            return (
                <CommandResultListOutput<Mark> 
                    key={`mark result ${new Date().getTime()}`}
                    data={data} 
                    render={(item, index) => (
                        <li className={css.mark_list_item}>
                            <Card 
                                type="inner" 
                                title={
                                    <span>
                                        <Avatar className={css.mark_icon} icon={<GlobalOutlined />} src={item.icon} />
                                        {item.title}
                                    </span>
                                }
                            >
                                <span className={css.mark_list_item_title} title={item.url}>{item.url}</span>
                            </Card>
                        </li>
                    )} 
                />
            )
        }

        return '命令语法不正确'
    }
}

/**
 * 获取网址的域名
 * @param url 网址url
 * @returns 
 */
 const getURLDomain = (url: string): string => {
    // console.log(url)
    let link = url;

    // 保证网址存在http
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = `https://${link}`
    }
    // 除去http前缀寻找网址完整域名
    if (link.startsWith('http://')) {
        link = link.split('http://')[1];
    }
    else if (link.startsWith('https://')) {
        link = link.split('https://')[1];
    }
    let i = link.indexOf('/');
    if (i !== -1) {
        link = link.slice(0, i);
    }
    // console.log(link)

    return link
}

const initValLocalStorageMark = (): MarkData => {
    return {
        data: []
    }
}

export {
    markCommand,
    getURLDomain,
    initValLocalStorageMark
}

