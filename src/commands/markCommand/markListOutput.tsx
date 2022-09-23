import { Avatar, List } from "antd"
import { GlobalOutlined } from '@ant-design/icons';
import { Mark, MarkData  } from "../../interface/interface"
import css from './index.module.css'
import { useEffect, useState } from "react";
import { localStorageGetItem } from "../../utils/localStorage";
import { LOCALSTORAGEMARK, LOCALSTORAGEMARKEVENT } from "../../assets/js/const";

const MarkList: React.FC = () => {

    const [show, setShow] = useState(false);
    const [marks, setMarks] = useState<Mark[]>([]);

    // 监听事件, 使mark同步
    useEffect(() => {
        getMark();
        window.addEventListener(LOCALSTORAGEMARKEVENT, getMark);
        return () => {
            window.removeEventListener(LOCALSTORAGEMARKEVENT, getMark);
        }
    }, []);
    /** 获取最新mark */
    const getMark = () => {
        let data = localStorageGetItem(LOCALSTORAGEMARK) as MarkData
        setShow(data.show);
        setMarks(data.data);
    }

    return (
        <>
            {
                show ? 
                    <div className={css.mark_list}>
                        <List
                            dataSource={marks}
                            split={false}
                            renderItem={item => (
                                <List.Item>
                                    <a className={css.mark_list_item} href={item.url}>
                                        <Avatar className={css.mark_icon} src={item.icon} size={26} icon={<GlobalOutlined />} />
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
    MarkList
}