import { List } from "antd"

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
                    '' :
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