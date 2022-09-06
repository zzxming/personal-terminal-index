import { getBackgroundImageUrl } from "../../assets/js/api"

const command = {
    name: 'bg',
    desc: '切换背景图片',
    param: {
        key: 'url',
        desc: '图片路径',
        required: false,
    },
    option: [
        {
            key: 'type',
            alias: 't',
            desc: '图片类型',
            defaultValue: 'suiji',
            valueNeeded: true
        }
    ],
    async action(args, commandHandle) {
        const { _, type } = args;

        if (_.length > 0) {
            // 输入了param,作为图片路径
            localStorage.setItem('bgurl', _[0]);
            return '更换成功';
        }

        const result = await getBackgroundImageUrl(type);
        if (result.data.data === '') {
            return '请求失败';
        }
        localStorage.setItem('bgurl', result.data.data);
        return '更换成功';
    }
}


// 重写 setItem , 使同页面能够监听到 localstorage 的变化
const originLocalStorageSetItem = localStorage.setItem;
localStorage.setItem = (key, value) => {
    let setItem = new Event('setItem');
    originLocalStorageSetItem.call(localStorage, key, value);
    window.dispatchEvent(setItem);
}

export {
    command
}

