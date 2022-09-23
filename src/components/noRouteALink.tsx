

interface IALinkProps {
    href: string
    children?: React.ReactElement | React.ReactElement[]
    className?: string
    title?: string
}


const ALink: React.FC<IALinkProps> = (props) => {
    // console.log(props)
    const clickHandle = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    }

    return (
        <a {...props} onClick={clickHandle}>
            {props.children}
        </a>
    )
}

export default ALink
