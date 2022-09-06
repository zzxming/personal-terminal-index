import { useCallback, useEffect, useState } from "react"


function useBackgroundImage() {

    const [imgurl, setImgurl] = useState('');

    const setbackgroundImage = useCallback((imgurl) => {
        // console.log(imgurl)
        localStorage.setItem('bgurl', imgurl);
        setImgurl(imgurl);
        return '更换成功';
    }, []);
    
    useEffect(() => {
        // 要监听到localstorage的变化
        setbackgroundImage(localStorage.getItem('bgurl'));
        function updateBg() {
            // console.log(localStorage.getItem('bgurl'))
            setImgurl(localStorage.getItem('bgurl'));
        }
        window.addEventListener('setItem', updateBg);
        return () => {
            window.removeEventListener('setItem', updateBg);
        }
    }, [])


    return {
        imgurl,
        setbackgroundImage
    }
}

export default useBackgroundImage


