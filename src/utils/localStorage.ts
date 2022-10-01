import { LOCALSTORAGEEVENTMAP } from "../assets/js/const";

// 重写 setItem , 使同页面能够监听到 localstorage 的变化
const originLocalStorageSetItem = localStorage.setItem;
const localStorageSetItem = (key: string, value: any) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    // 同步背景图片的更新
    let eventName = LOCALSTORAGEEVENTMAP[key];
    if (eventName) {
        let setItem = new Event(eventName);
        originLocalStorageSetItem.call(localStorage, key, value);
        window.dispatchEvent(setItem);
        return;
    }
    originLocalStorageSetItem.call(localStorage, key, value);
}

const localStorageGetItem = (key: string) => {
    let result = localStorage.getItem(key);
    try {
        // 非json格式字符串会报错
        return result ? JSON.parse(result) : null;
    }
    catch (e) {
        return result
    }
}

export {
    localStorageSetItem,
    localStorageGetItem
}
