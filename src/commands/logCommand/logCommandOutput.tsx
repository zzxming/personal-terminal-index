import { Badge, DatePicker, Form, Input, InputNumber, Popconfirm, Switch, Table, TimePicker, Typography } from "antd";
import React, { useEffect, useMemo, useCallback, useState, Fragment } from "react";
import { localStorageGetItem, localStorageSetItem } from "../../utils/localStorage";
import moment from 'moment'
import { ColumnType } from "antd/lib/table";
import { Rule } from "antd/lib/form";
import css from './index.module.css'




// 目前不能新增

/**
 * 可修改的输入框类型
 */
type EditInputType = 'number' | 'text' | 'textarea' | 'date' | 'time' | 'switch'
/**
 * 日志的内结果属性
 */
interface LogDataDetail<T = any> extends TableData, Expandable<T> {
    content: string
    status: boolean
}
/**
 * 日志的数据结构
 */
interface LogData {
    [key: string]: LogDataDetail[]
}
/**
 * 日志外层 columns
 */
interface LogDataOut<T = any> extends TableData, Expandable<T> {
    
}
/**
 * ExpandableTable 中数据一定要包含的属性
 */
interface TableData {
    date: string
    key: React.Key
}
/**
 * ExpandableTable 的可展开表格生成组件的 props
 */
interface EditableCellProps extends React.HTMLAttributes<HTMLElement>  {
    record: LogDataDetail
    dataIndex: string
    title: string
    inputType: EditInputType
    editing: boolean
    childrenTable: React.ReactNode;
}
/**
 * ExpandableTable 的 props
 */
interface TableProps<T> {
    data: T[]
    columns: TableColumns<T>[]
    expendable?: boolean
}
/**
 * ExpandableTable 表格列属性
 */
interface TableColumns<T> extends ColumnType<T> {
    inputType?: EditInputType
    editable?: boolean
    columnsOperate?: TableOperate<T>[]
}
/**
 * ExpandableTable 的 operate 属性参数
 */
interface TableOperate<T> {
    tip: string
    edit?: boolean
    doubleCheck?: boolean
    /**
     * @param {string} text 为当前行content
     * @param record 为当前行数据
     */
    onConfirm?: TableOperateConfirm<T>
}
/**
 * ExpandableTable 中, operate 里按钮成功的回调函数
 */
type TableOperateConfirm<T> = (record: T, key: React.Key) => void
/**
 * 可展开表格数据的展开项相关数据
 */
interface Expandable<T> {
    childrenTableData?: {
        columns: TableColumns<T>[]
        data: T[]
    }
}

/**
 * 获取日志数据生成表格
 */
const GetLogTable: React.FC = () => {
    const [data, setData] = useState<LogDataOut<LogDataDetail>[]>([]);

    useEffect(() => {
        getLog()
    }, []);

    const getLog = () => {
        let data = localStorageGetItem('log') as LogData;
        const result: LogDataOut<LogDataDetail>[] = Object.keys(data).map(item => {
            let childrenData = [...data[item]]
            childrenData.sort((a, b) => moment(a.date, 'HH-mm-ss').valueOf() - moment(b.date, 'HH-mm-ss').valueOf())
            return {
                date: item, 
                key: item,
                childrenTableData: {
                    columns: [
                        { 
                            title: '时间',
                            dataIndex: 'date',
                            key: 'date',
                            width: 140,
                            editable: true,
                            inputType: 'time',
                        }, { 
                            title: '内容',
                            dataIndex: 'content',
                            key: 'content',
                            editable: true,
                            inputType: 'textarea',
                        }, { 
                            title: '状态', 
                            dataIndex: 'status', 
                            key: 'status', 
                            width: 140, 
                            editable: true,
                            inputType: 'switch',
                            render: (_: any, recordDetail: LogDataDetail) => (
                                <span><Badge status={recordDetail.status ? 'success' : 'warning'} />{recordDetail.status ? 'Finished' : 'To do'}</span>
                            ) 
                        }, {
                            title: '操作',
                            dataIndex: 'operation',
                            key: 'operation',
                            align: 'center',
                            width: 120,
                            columnsOperate: [
                                {
                                    tip: '编辑',
                                    edit: true,
                                    onConfirm(record, key) {
                                        // console.log(record, key, '编辑', item)
                                        let data = localStorageGetItem('log') as LogData;
                                        let i = data[item].findIndex(log => log.key === key);
                                        if (i === -1) return;
                                        let result = { ...data };
                                        let preLog = result[item].splice(i, 1);
                                        let newDate = moment(record.date).format('HH:mm:ss');
                                        let newLog = { ...record, date: newDate, key: newDate }
                                        result[item].push(newLog)
                                        
                                        // console.log(result)
                                        localStorageSetItem('log', result);
                                        getLog();
                                    }
                                }, {
                                    tip: '删除',
                                    doubleCheck: true,
                                    onConfirm(record, key) {
                                        // console.log(record, key, '删除', item)
                                        let data = localStorageGetItem('log') as LogData;
                                        let i = data[item].findIndex(log => log.key === key);
                                        if (i === -1) return;
                                        let result = { ...data };
                                        // 删除
                                        let preLog = result[item].splice(i, 1);
                                        
                                        localStorageSetItem('log', result);
                                        getLog();
                                    }
                                }
                            ]
                        },
                    ],
                    data: childrenData
                }
            }
        });
        // 根据日期由进致远排序
        result.sort((a, b) => moment(b.date, 'YYYY-MM-DD').valueOf() - moment(a.date, 'YYYY-MM-DD').valueOf());
        setData(result);
        return result
    }

    const columns: TableColumns<LogDataOut<LogDataDetail>>[] = [
        { 
            title: '日期', 
            dataIndex: 'date', 
            key: 'date',
            editable: true,
            inputType: 'date',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 120,
            align: 'center',
            columnsOperate: [
                {
                    tip: '编辑',
                    edit: true,
                    onConfirm(record, key) {
                        // console.log(record, key, '编辑')
                        let data = localStorageGetItem('log');
                        let value = data[key];
                        let result = { ...data }
                        delete result[key]
                        result[moment(record.date).format('YYYY-MM-DD')] = value;
                        // console.log(result)
                        localStorageSetItem('log', result);
                        getLog();
                    }
                }, {
                    tip: '删除',
                    doubleCheck: true,
                    onConfirm(record, key) {
                        // console.log(record, key, '删除')
                        let data = localStorageGetItem('log');
                        let result = { ...data }
                        delete result[key]
                        localStorageSetItem('log', result);
                        getLog();
                    }
                }
            ]
        }
    ]

    const expandableTableProps = {
        data,
        columns,
        expendable: true
    }
    return <ExpandableTable<LogDataOut<LogDataDetail>> {...expandableTableProps} />
}
// 不知道怎么在 React.FC 中使用泛型
/**
 * 可展开的表格
 */
function ExpandableTable <T extends object & TableData,>(props: TableProps<T>)  {
    // console.log(props)
    const { columns, data } = props;
    const expendable = props.expendable ?? false;
    // // 修改状态,新增log,修改日期
    const [form] = Form.useForm();

    const [editingKey, setEditingKey] = useState<React.Key>('');
    const isEditing = useCallback((row: T) => (row.key === editingKey), [editingKey]);
    // doublecheck 的按钮需要在第二次确认再执行, 在第一次点击时保存最终的修改回调
    // 因为 useState 保存函数时会自动执行一次, 所以将回调把保存在对象中
    const [update, setUpdate] = useState<{callback?: TableOperateConfirm<T>}>();

    // 操作回调
    const editColumns = (record: T, callback?: TableOperateConfirm<T>) => {
        // console.log(record)
        form.setFieldsValue({ ...record, date: moment(record.date, record.date.length > 8 ? 'YYYY-MM-DD' : 'HH-mm-ss') });
        setEditingKey(record.key);
        setUpdate({callback});
    };
    const saveColumns = async (record: T) => {
        try {
            // console.log(record, 't')
            const row = (await form.validateFields()) as T;
            // console.log(row)
            update?.callback && update.callback(row, record.key);
            setUpdate(undefined);
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }
    const cancealColumns = () => {
        setEditingKey('');
    };
    // 生成表格列 columns
    const tableColumns = columns.map(column => {
        // console.log(column)
        let newColumn = { ...column };
        // 有操作数组则进行 render 生成
        let operateArr = column.columnsOperate
        if (operateArr) {
            let render = (_:any, record: T) => {
                // 根据属性生成操作的按钮
                const editable = isEditing(record);
                return (
                    <span onClick={(e) => e.stopPropagation()} style={{userSelect: 'none'}}>
                            {
                                editable ? (
                                    <>
                                        <Typography.Link onClick={() => saveColumns(record)} style={{ marginRight: 8 }}>
                                            保存
                                        </Typography.Link>
                                        <Popconfirm title="是否取消编辑?" okText='确认' cancelText='取消' onConfirm={cancealColumns}>
                                            <a>取消</a>
                                        </Popconfirm>
                                    </>
                                ) : (
                                    column.columnsOperate && column.columnsOperate.map(item => {
                                        return (
                                            <Fragment key={item.tip}>
                                                {
                                                    item.doubleCheck ? 
                                                        <Popconfirm overlayStyle={{minWidth: '140px'}} title={`是否${item.tip}?`} okText='确认' cancelText='取消' onConfirm={() => item.onConfirm && item.onConfirm(record, record.key)}>
                                                            <a style={{color: '#1890ff'}}>{item.tip}</a>
                                                        </Popconfirm> :
                                                        item.edit ?
                                                            <Typography.Link disabled={editingKey !== ''} onClick={() => editColumns(record, item.onConfirm)} style={{ marginRight: 8 }}>
                                                                {item.tip}
                                                            </Typography.Link> :
                                                            <Typography.Link onClick={() => item.onConfirm && item.onConfirm(record, record.key)} style={{ marginRight: 8 }}>
                                                                {item.tip}
                                                            </Typography.Link>
                                                }
                                            </Fragment>
                                        )
                                    })
                                )
                            }
                    </span>
                )
            }
            newColumn.render = render;
        }
        
        return { ...newColumn }
    })
    // 合并表格列, 使可以进行修改
    const mergedColumns: any = tableColumns.map(col => {
        if (!col.render) {
            col.render = (text) => (<div className={css.table_row}>{text}</div>)
        }
        if (!col.editable) {
            // console.log(col)
            return col;
        }
        return {
            ...col,
            onCell: (record: T) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.inputType,
                editing: isEditing(record),
            })
        }
    });

    // 根据可展开元素 table 数据生成 table
    const expandedRowRender = (record: T & Expandable<T>) => {
        // console.log(record)
        if (record.childrenTableData) {
            return <ExpandableTable<T> {...record.childrenTableData} />
        }
        return (
            <></>
        )
    }
    
    return (
        <Form component={false} form={form}>
            <Table 
                columns={mergedColumns}
                expandable={expendable ? { 
                    expandedRowRender,
                    expandRowByClick: editingKey === '',
                } : undefined}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                dataSource={data}
                pagination={{
                    pageSize: 10
                }}
            />
        </Form>
    )
}
/**
 * 表格点击编辑后出现的 form
 */
 const EditableCell: React.FC<EditableCellProps> = (props) => {
    const {
        record,
        dataIndex,
        title,
        inputType,
        editing,
        children,
        ...resPorps
    } = props;
    // 表单属性限制
    const rules: Rule[] = [{
        required: true,
        message: `请输入${title}!`
    }];
    // 根据 inputType 显示对应的 input 标签 
    const { result, valuePropName } = useMemo(() => {
        let result = <></>;
        let valuePropName: string = 'value';
        switch(inputType) {
            case 'number':
                result = <InputNumber />;
                break;
            case 'text': 
                result = <Input />;
                rules.push({
                    message: `超出200字符!`,
                    max: 200
                });
                break;
            case 'textarea':
                result = <Input.TextArea />;
                rules.push({
                    message: `超出200字符!`,
                    max: 200
                });
                break;
            case 'date':
                result = <DatePicker allowClear={false} />;
                break;
            case 'time':
                result = <TimePicker format={'HH:mm:ss'} allowClear={false} />;
                break;
            case 'switch':
                result = <Switch checkedChildren="完成" unCheckedChildren="待做" />;
                valuePropName = 'checked';
                break;
        }
        return {
            result, 
            valuePropName
        };
    }, [inputType]);

    // console.log(valuePropName)
    // console.log(props)
    return (
        // colSpan 保持当日期下没有时间 log 时, 显示的 no data 能够居中显示
        <td {...resPorps}>
            {
                editing ? 
                (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={rules}
                        valuePropName={valuePropName}
                        
                    >
                        { result }
                    </Form.Item>
                ) : (children)
            }
        </td>
    )
}



export {
    GetLogTable,
    ExpandableTable
}
