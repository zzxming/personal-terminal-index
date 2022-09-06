import originAxios from "axios";
import { useEffect, useState } from "react";
import { getTest } from "../../assets/js/api";
import { command } from "../../commands/backgroundCommand";
import useBackgroundImage from "../../hooks/backgroundImage";
const axios = originAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/bili': '/'
});

axios.defaults.withcredentials = true;

function Test() {
    
    useEffect(() => {

        getData()
       
    },[])

    async function getData() {

        // getTest()
        // .then(res => {
        //     console.log(res)
        // })        

        // await fetch('https://api.bilibili.com/x/frontend/finger/spi',
        // {  
        //     credentials: "include",
        //     withCredentials: true
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     // setCookie('buvid4', data.data.b_4)
        //     // setCookie('buvid3', data.data.b_3)
        //     document.cookie = `buvid4=${data.data.b_4}; secrue; samesite=None;`
        //     document.cookie = `buvid3=${data.data.b_3}; secrue; samesite=None;`
            
        // })



        // fetch(
        // 'http://api.bilibili.com/x/web-interface/search/all/v2?page=1&page_size=42&keyword=%E8%B6%81%E4%BA%BA%E4%B9%8B%E5%8D%B1',
        // {  
        //     credentials: "include",
        //     mode: 'no-cors',
        //     withCredentials: true,
        //     headers:{
        //         cookie: `buvid4=${data.data.b_4}; buvid3=${data.data.b_3};`
        //     } 
        // })
        // .then(res => res.json())
        // .then(data=>console.log(data))


    }


    return (
        <div>
            test
            <input onKeyDown={() => {
                console.log('wfwf')
            }} />
        </div>
    )
}

export default Test;
