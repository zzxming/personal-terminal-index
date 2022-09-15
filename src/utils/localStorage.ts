// 重写 setItem , 使同页面能够监听到 localstorage 的变化
const originLocalStorageSetItem = localStorage.setItem;
const localStorageSetItem = (key: string, value: any) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    if (key === 'bgurl') {
        let setItem = new Event('setItem');
        originLocalStorageSetItem.call(localStorage, key, value);
        window.dispatchEvent(setItem);
        return;
    }
    originLocalStorageSetItem.call(localStorage, key, value);
}

const localStorageGetItem = (key: string) => {
    let result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
}

export {
    localStorageSetItem,
    localStorageGetItem
}
