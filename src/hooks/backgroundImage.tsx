import { useCallback, useEffect, useState } from "react"
import { LOCALSTORAGEBGURL, LOCALSTORAGEBGURLEVENT } from "../assets/js/const";
import { localStorageGetItem, localStorageSetItem } from "../utils/localStorage";


const useBackgroundImage = () => {

    const [imgurl, setImgurl] = useState<string>('');

    const setbackgroundImage = useCallback((imgurl: string) => {
        // console.log(imgurl)
        localStorageSetItem(LOCALSTORAGEBGURL, imgurl, LOCALSTORAGEBGURLEVENT);
        setImgurl(imgurl);
        return '更换成功';
    }, []);
    
    useEffect(() => {
        // 要监听到localstorage的变化
        setbackgroundImage(localStorageGetItem(LOCALSTORAGEBGURL) || '');
        function updateBg() {
            // console.log(localStorage.getItem(LOCALSTORAGEBGURL))
            setImgurl(localStorageGetItem(LOCALSTORAGEBGURL) || '');
        }
        window.addEventListener(LOCALSTORAGEBGURLEVENT, updateBg);
        return () => {
            window.removeEventListener(LOCALSTORAGEBGURLEVENT, updateBg);
        }
    }, [])


    return {
        imgurl,
        setbackgroundImage
    }
}

export default useBackgroundImage


