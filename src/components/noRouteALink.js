

// interface IALink {
//     href: string
// }


const ALink = (props) => {
    // console.log(props)
    const clickHandle = (e) => {
        e.preventDefault();
    }

    return (
        <a {...props} onClick={clickHandle}>
            {props.children}
        </a>
    )
}

export default ALink
