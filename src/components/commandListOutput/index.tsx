import { List } from "antd"
import css from './index.module.css'
interface IResultList<T> {
    data: T[]
    render: (item: T, index: number) => React.ReactNode
}

function CommandResultListOutput<T>(props: IResultList<T>) {
    const { data, render } = props;

    return (
        <>
            {
                data.length < 1 ? 
                    <span className={css.txt}>无数据</span> :
                    <List
                        itemLayout="vertical"
                        dataSource={data}
                        renderItem={render}
                    />
            }
        </>
    )
}

export {
    CommandResultListOutput
}