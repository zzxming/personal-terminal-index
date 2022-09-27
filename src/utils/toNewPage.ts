import { LOCALSTORAGECONFIG } from "../assets/js/const"
import { openType } from "../interface/interface";
import { localStorageGetItem } from "./localStorage"


/**
 * 打开或跳转至路径
 * @param url 跳转路径
 * @param type 指定打开方式
 */
const toNewPage = (url: string, type?: openType) => {
    let { open } = localStorageGetItem(LOCALSTORAGECONFIG);
    if (type) {
        open = type
    }

    if (open === openType.self) {
        window.location.href = url;
    }
    else if (open === openType.blank) {
        window.open(url);
    }
}

export {
    toNewPage
}

