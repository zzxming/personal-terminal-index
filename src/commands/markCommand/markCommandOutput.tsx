import { Avatar, List } from "antd"
import { GlobalOutlined } from '@ant-design/icons';
import { Mark, MarkData  } from "../../interface/interface"
import css from './index.module.css'
import { useEffect, useState } from "react";
import { localStorageGetItem, localStorageSetItem } from "../../utils/localStorage";
import { LOCALSTORAGEEVENTMAP, LOCALSTORAGEMARK } from "../../assets/js/const";

const MarkNav: React.FC = () => {

    const [show, setShow] = useState(false);
    const [marks, setMarks] = useState<Mark[]>([]);

    // 监听事件, 使mark同步
    useEffect(() => {
        getMark();
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEMARK], getMark);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEMARK], getMark);
        }
    }, []);
    /** 获取最新mark */
    const getMark = () => {
        let data = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        // console.log(data)
        if (!data) {
            // 初始化localstorage的mark
            localStorageSetItem(LOCALSTORAGEMARK, {show: true, data: []});
            setShow(true);
            setMarks([]);
            return;
        }
        setShow(data.show);
        setMarks(data.data);
    }

    return (
        <>
            {
                show && marks.length > 0 ? 
                    <div className={css.mark_nav}>
                        <List
                            dataSource={marks}
                            split={false}
                            renderItem={item => (
                                <List.Item title={`${item.title}${'\n'}${item.url}`}>
                                    <a className={css.mark_nav_item} href={item.url}>
                                        <Avatar className={css.mark_icon} icon={<GlobalOutlined />} src={item.icon} />
                                        <span className={css.mark_link}>{item.title}</span>
                                    </a>
                                </List.Item>
                            )}
                        />
                    </div> : 
                    ''
            }
        </>
    )
}

export {
    MarkNav
}