import { useState } from "react";


function useTest() {
    const [friend, setF] = useState([1,2,3]);

    function pushF(v) {
        setF(item => {
            console.log(item)
            item.push(v)
            return [...item]
        })
    }
    return {
        friend,
        pushF
    }
}

export default useTest;

