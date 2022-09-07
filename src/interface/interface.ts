
interface ICommandOption<T> {
    key: string             // 参数key
    alias: string           // 参数输入名
    desc: string            // 参数描述
    defaultValue: T         // 参数默认值
    valueNeeded: boolean    // 此参数是否需要值
    leagalValue: {
        any: any
    } | null   // 合法值数组, null为任何值
}

interface ICommandParam {
    key: string             // key值
    desc: string            // param描述
    required: boolean       // 是否必须传入
}

