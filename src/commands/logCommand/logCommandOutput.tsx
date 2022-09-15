import { Badge, DatePicker, Form, Input, InputNumber, Popconfirm, Switch, Table, TimePicker, Typography } from "antd";
import React, { useMemo, useCallback, useState } from "react";
import { localStorageGetItem, localStorageSetItem } from "../../utils/localStorage";
import moment from 'moment'
import { ColumnType } from "antd/lib/table";
import { Rule } from "antd/lib/form";

type EditInputType = 'number' | 'text' | 'textarea' | 'date' | 'time' | 'switch'

interface LogDataDetail {
    content: string
    status: boolean
    date: string
    key: React.Key
}
interface LogData {
    [key: string]: LogDataDetail[]
}
/**
 * 设置是否可修改的 columns
 */
interface LogDataDetailColumns<T> extends ColumnType<T> {
    inputType?: EditInputType
    editable?: boolean
}
/**
 * 日志外层 columns
 */
interface LogDataOut {
    createDate: string
    key: string
}

interface LogDataDetailProps {
    dataIndex: string
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement>  {
    record: LogDataDetail
    dataIndex: string
    title: string
    inputType: EditInputType
    editing: boolean
    children: React.ReactNode;
}





// 考虑提升嵌套的表格
// 内表格和外表格结构相同, 使用 columns 控制列, 修改删除等操作通过传递 props onUpdate、onDelete 实现
// 是否可展开通过 columns 传一个属性再加上数据数组进去, 如 expendable、children, 当数组长度为0则显示 no data, 不可展开则设置属性不可展开

// 目前不能新增











/**
 * log 命令显示的日志表格
 */
const LogTable: React.FC = () => {
    // 修改状态,新增log,修改日期
    const [data, setLogData] = useState<LogData>(localStorageGetItem('log'));
    const [form] = Form.useForm();

    const [editingKey, setEditingKey] = useState<React.Key>('');
    const isEditing = useCallback((row: LogDataOut) => (row.key === editingKey), [editingKey]);


    const deleteColumns = (key: React.Key) => {
        // console.log(key)
        let newLogData = { ...data };
        delete newLogData[key]
        localStorageSetItem('log', newLogData);
        setLogData(localStorageGetItem('log'));
    }


    // 操作回调
    const editColumns = (record: LogDataOut) => {
        // console.log(record)
        form.setFieldsValue({ ...record, createDate: moment(record.createDate, 'YYYY-MM-DD') });
        setEditingKey(record.key);
    };
    const saveColumns = async (key: React.Key) => {
        try {
            console.log(key)
            const row = (await form.validateFields()) as LogDataOut;
            // console.log(row)
            const date = moment(row.createDate).format('YYYY-MM-DD');
            let newLogData = {
                ...data
            }
            let insideData = [...data[key]];
            delete newLogData[key];
            newLogData[date] = insideData;
            // 提交修改
            localStorageSetItem('log', newLogData);
            setLogData(localStorageGetItem('log'));
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }
    const cancealColumns = () => {
        setEditingKey('');
    };

    const columnsOut: LogDataDetailColumns<LogDataOut>[] = [
        { 
            title: '日期', 
            dataIndex: 'createDate', 
            key: 'createDate',
            editable: true,
            inputType: 'date',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 120,
            align: 'center',
            render: (_: any, record: LogDataOut) => {
              const editable = isEditing(record);
              return editable ? (
                <span onClick={(e) => e.stopPropagation()}>
                    <Typography.Link onClick={() => saveColumns(record.key)} style={{ marginRight: 8 }}>
                        保存
                    </Typography.Link>
                    <Popconfirm title="是否取消编辑?" okText='确认' cancelText='取消' onConfirm={cancealColumns}>
                        <a>取消</a>
                    </Popconfirm>
                </span>
              ) : (
                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}} onClick={(e) => e.stopPropagation()}>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => editColumns(record)} style={{ marginRight: 8 }}>
                        编辑
                    </Typography.Link>
                    <Popconfirm title="是否取消删除?" okText='确认' cancelText='取消' onConfirm={() => deleteColumns(record.key)}>
                        <a style={{color: '#1890ff'}}>删除</a>
                    </Popconfirm>
                </span>
              );
            }
        }
    ]
    const dataOut: LogDataOut[] = Object.keys(data).map(item => ({createDate: item, key: item}));
    // 根据日期由进致远排序
    dataOut.sort((a, b) => moment(b.createDate, 'YYYY-MM-DD').valueOf() - moment(a.createDate, 'YYYY-MM-DD').valueOf());

    const mergedColumns: any = columnsOut.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: LogDataOut) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.inputType,
                editing: isEditing(record),
            })
        }
    });

    const expandedRowRender = (record: LogDataOut) => {
        return (
            <LogDetailTable 
                dataIndex={record.createDate} 
            />
        )
    }
    
    return (
        <Form component={false} form={form}>
            <Table 
                columns={mergedColumns}
                expandable={{ 
                    expandedRowRender,
                    expandRowByClick: editingKey === '',
                }}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                dataSource={dataOut}
                pagination={{
                    pageSize: 10
                }}
            />
        </Form>
    )
}

/**
 * 嵌套表格组件
 */
const LogDetailTable: React.FC<LogDataDetailProps> = ({dataIndex}) => {
    const [logData, setLogData] = useState<LogData>(localStorageGetItem('log'));
    const data = useMemo(() => logData[dataIndex], [dataIndex, logData])
    const [form] = Form.useForm()
    
    // 正在进行修改的行key值
    const [editingKey, setEditingKey] = useState<React.Key>('');
    // 是否可以进行修改
    const isEditing = useCallback((row: LogDataDetail) => (row.key === editingKey), [editingKey]);

    // 操作回调
    const saveColumns = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as LogDataDetail;
            // console.log(row)
            const inputDate = row.date;
            const date = moment(inputDate).format('YYYY-MM-DD');
            const time = moment(inputDate).format('HH:mm:ss');
            // console.log(date, time)
            let newLogData = {
                ...logData
            }
            const newData = {
                key: time,
                date: time,
                content: row.content,
                status: row.status,
            }
            // 提交数据是否已存在
            if (newLogData[date]) {
                let logDetailData = newLogData[date];
                let getSameDataIndex = logDetailData.findIndex(log => log.key === time);
                // 存在相同时间(key)进行覆盖
                if (getSameDataIndex !== -1) {
                    logDetailData[getSameDataIndex] = newData;
                }
                // 没有相同时间(key)进行新增
                else {
                    logDetailData.push(newData)
                }
            }
            // 提交数据不存在
            else {
                newLogData[`${date}`] = [
                    ...logData[date], 
                    newData
                ]
            }
            // 数据更新
            // console.log(newLogData)
            localStorageSetItem('log', newLogData);
            // console.log(localStorageGetItem('log'))
            setLogData(localStorageGetItem('log'))
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }
    const editColumns = (recordDetail: LogDataDetail) => {
        // console.log(recordDetail)
        form.setFieldsValue({ ...recordDetail, date: moment(`${dataIndex} ${recordDetail.date}`) });
        setEditingKey(recordDetail.key);
    };
    const cancealColumns = () => {
        setEditingKey('');
    };
    const deleteColumns = (key: React.Key) => {
        const newLogData = { ...logData }
        const delIndex = newLogData[dataIndex].findIndex(log => log.key === key);
        if (delIndex !== -1) {
            newLogData[dataIndex].splice(delIndex, 1);
        }
        // console.log(delIndex, newLogData)
        localStorageSetItem('log', newLogData);
        setLogData(localStorageGetItem('log'));
    };

    // 嵌套内表格columns, editable标注是否可编辑, inputType标注编辑框为什么类型input
    const columnsDetail: LogDataDetailColumns<LogDataDetail>[] = [
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
            render: (_: any, recordDetail: LogDataDetail) => {
              const editable = isEditing(recordDetail);
              return editable ? (
                <span>
                    <Typography.Link onClick={() => saveColumns(recordDetail.key)} style={{ marginRight: 8 }}>
                        保存
                    </Typography.Link>
                    <Popconfirm title="是否取消编辑?" okText='确认' cancelText='取消' onConfirm={cancealColumns}>
                        <a>取消</a>
                    </Popconfirm>
                </span>
              ) : (
                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => editColumns(recordDetail)} style={{ marginRight: 8 }}>
                        编辑
                    </Typography.Link>
                    <Typography.Link onClick={() => deleteColumns(recordDetail.key)}>
                        删除
                    </Typography.Link>
                </span>
              );
            },
        },
    ];
    // 与 form 编辑 columns 合并, onCell 中返回的对象为 EditableCell 中接收的 props
    // 不使用 any 会导致 table 的 columns 属性报错
    const mergedColumns: any = columnsDetail.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: LogDataDetail) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.inputType,
                editing: isEditing(record),
            })
        }
    })

    return (
        <Form component={false} form={form}>
            <Table 
                dataSource={data} 
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                columns={mergedColumns} 
                pagination={{
                    pageSize: 6
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
    LogTable,
    LogDetailTable
}
