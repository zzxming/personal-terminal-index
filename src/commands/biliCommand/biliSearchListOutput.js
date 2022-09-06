import { Fragment, useEffect, useState } from "react";
import { getBiliPic, getBiliSearchResult } from "../../assets/js/api";
import { BiliVideoIframe } from "./biliVideoOutput";
import style from './index.module.css'
import { Pagination } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const biliSearchResultList = (keywords, typeStr, commandHandle) => {
    // console.log(data)
    

    return <BiliVideoList renderkey={typeStr} typeStr={typeStr} keywords={keywords} commandHandle={commandHandle} />
}

const BiliVideoList = (props) => {
    const { keywords, commandHandle, typeStr } = props;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataInfo, setDataInfo] = useState({});
    const [pageNum, setPageNum] = useState(1);

    useEffect(() => {
        getSearchResult(pageNum);
    }, [keywords]);

    const getSearchResult = async (page) => {
        setLoading(true)
        const result = await getBiliSearchResult(keywords, page)
        // console.log(result)
        const listData = result.data.data.result.find(item => item.result_type === typeStr)
        // console.log(listData)
        if (!listData) {
            setData([]);
        }
        else {
            setData(listData.data);
        }
        setLoading(false);
        setDataInfo(result.data.data.pageinfo[typeStr]);
    }

    const pageChange = (page) => {
        // console.log(page)
        setPageNum(page);
        getSearchResult(page)
    }

    return (
        <div className={style.video_list}>
            {
                loading ? <div style={{
                    position: 'absolute',
                    zIndex: '2',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <LoadingOutlined />
                </div> : ''
            }
            {
                document.getElementById('video_svg') ?
                    '' :
                    <svg id="video_svg" aria-hidden="true" 
                        style={{position: 'absolute',
                            width: '0px',
                            height: '0px',
                            overflow: 'hidden'
                        }}
                    >
                        <symbol id="widget-play-count" fill="none" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M3.833 2.667a2.5 2.5 0 0 0-2.5 2.5v5.666a2.5 2.5 0 0 0 2.5 2.5h8.334a2.5 2.5 0 0 0 2.5-2.5V5.167a2.5 2.5 0 0 0-2.5-2.5H3.833Zm-1.5 2.5a1.5 1.5 0 0 1 1.5-1.5h8.334a1.5 1.5 0 0 1 1.5 1.5v5.666a1.5 1.5 0 0 1-1.5 1.5H3.833a1.5 1.5 0 0 1-1.5-1.5V5.167Zm8.25 3.266a.5.5 0 0 0 0-.866l-3.5-2.02a.5.5 0 0 0-.75.432v4.042a.5.5 0 0 0 .75.433l3.5-2.021Z" fill="currentColor"></path></symbol>
                        <symbol id="widget-video-danmaku" fill="none" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8 3.25c-1.714 0-3.208.088-4.258.174A1.45 1.45 0 0 0 2.4 4.746C2.323 5.607 2.25 6.75 2.25 8s.073 2.393.15 3.254a1.45 1.45 0 0 0 1.342 1.322c1.05.086 2.544.174 4.258.174s3.208-.088 4.258-.174a1.45 1.45 0 0 0 1.341-1.321c.078-.862.151-2.004.151-3.255s-.073-2.393-.15-3.255a1.45 1.45 0 0 0-1.342-1.321A52.956 52.956 0 0 0 8 3.25Zm-4.34-.823A53.955 53.955 0 0 1 8 2.25c1.747 0 3.27.09 4.34.177a2.45 2.45 0 0 1 2.255 2.228c.08.883.155 2.057.155 3.345 0 1.288-.075 2.462-.155 3.345a2.45 2.45 0 0 1-2.255 2.228c-1.07.087-2.593.177-4.34.177-1.747 0-3.27-.09-4.34-.177a2.45 2.45 0 0 1-2.255-2.229A37.662 37.662 0 0 1 1.25 8c0-1.288.075-2.461.155-3.344A2.45 2.45 0 0 1 3.66 2.427ZM4 6.75a.5.5 0 0 1 .5-.5h.25a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1-.5-.5Zm2 0a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm-.5 2a.5.5 0 0 0 0 1h.25a.5.5 0 0 0 0-1H5.5Zm2 0a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Z" fill="currentColor"></path></symbol>
                        <symbol id="widget-up" viewBox="0 0 14 10.666"><path fillRule="evenodd" clipRule="evenodd" d="M0 2.5A2.5 2.5 0 0 1 2.5 0h8.334a2.5 2.5 0 0 1 2.5 2.5v5.666a2.5 2.5 0 0 1-2.5 2.5H2.5a2.5 2.5 0 0 1-2.5-2.5ZM2.5 1A1.5 1.5 0 0 0 1 2.5v5.666a1.5 1.5 0 0 0 1.5 1.5h8.334a1.5 1.5 0 0 0 1.5-1.5V2.5a1.5 1.5 0 0 0-1.5-1.5zM3 2.833a.5.5 0 0 1 .5.5v2.5a1 1 0 1 0 2 0v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-4 0v-2.5a.5.5 0 0 1 .5-.5Zm4.667 0a.5.5 0 0 0-.5.5v4a.5.5 0 1 0 1 0v-.667H9.25a1.917 1.917 0 1 0 0-3.833zM9.25 5.666H8.167V3.833H9.25a.917.917 0 1 1 0 1.833z" fill="currentColor" id="path48"></path></symbol>
                    </svg>
            }
            {
                data.map(item => {
                    return (
                        <BiliVideoItem key={`list${item.bvid}`} data={item} commandHandle={commandHandle} />
                    )
                })
            }
            {
                data.length > 0 && !loading ? 
                    <Pagination showSizeChanger={false} current={pageNum} onChange={pageChange} total={dataInfo.total} /> 
                    : loading ? 
                        '' 
                        : <p style={{margin: '0', marginRight: 'auto'}}>无搜索结果</p>
            }
            
        </div>
    )
}
// 视频列表项组件
const BiliVideoItem = (props) => {
    const {pic, bvid, play, id, danmaku, title, author, senddate, duration} = props.data;
    
    const [base64pic, setBase64Pic] = useState();
    useEffect(() => {
        getVideoPic();
    }, [pic])
    // 获取视频封面
    const getVideoPic = async () => {
        let result = await getBiliPic(pic);
        // console.log(result)
        setBase64Pic(result.data.data);
    }

    const openVideo = () => {
        // console.log(props.commandHandle)
        props.commandHandle.pushCommands(<BiliVideoIframe renderkey={`video${bvid}`}  bv={bvid} />);
    }

    return (
        <div className={style.video_list_item} key={id} onClick={openVideo}>
            <a className={style.video_pic_link}>
                <div className={style.video_pic_wrapper}>
                    <img className={style.video_pic} src={base64pic} />
                </div>
                <div className={style.video_mask}>
                    <div className={style.video_status}>
                        <div className={style.video_status_left}>
                            <span className={style.video_status_item}>
                                <svg className={style.video_status_icon}><use xlinkHref="#widget-play-count"></use></svg>
                                <span>{formatNumber(play)}</span>    
                            </span>
                            <span className={style.video_status_item}>
                                <svg className={style.video_status_icon}><use xlinkHref="#widget-video-danmaku"></use></svg>
                                <span>{formatNumber(danmaku)}</span>    
                            </span>
                        </div>
                        <span className={style.video_status_duration}>{formatDuration(duration)}</span>
                    </div>
                </div>
            </a>
            <div className={style.video_info}>
                <a className={style.video_info_title_link}>
                    <h3 className={style.video_info_title} title={keywordsFormatStr(title)}>{ keywordsFormat(title) }</h3>
                </a>
                <p className={style.video_info_sub}>
                    <a className={style.video_info_sub_link} title={author}>
                        <svg className={style.video_status_icon}><use xlinkHref="#widget-up"></use></svg>
                        <span className={style.video_info_author}>{author}</span>
                        <span className={style.video_info_date}>{new Date(senddate * 1000).toLocaleDateString().split('/').join('-')}</span>
                    </a>
                </p>
            </div>
        </div>
    )
}

// 格式化数字
function formatNumber(num) {
    if (num > 10000) {
        return `${(num / 10000).toFixed(1)}万`
    }
    return num
}
// 格式化时间
function formatDuration(duration) {
    let arr = duration.split(':')
    arr = arr.map(value => {
        if (value.length < 2 && !value.startsWith('0')) {
            return `0${value}`
        }
        return value
    })
    return arr.join(':')
}
// 将结果中的<em>标签去除
function keywordsFormatStr(str) {
    const reg = /(<em class="keyword">)(.+?)(<\/em>)/g;
    let result = str.replace(reg,  function(originStr, _, content) {
        return content
    });
    return result
}
// 将结果中的<em>标签作为jsx输出
function keywordsFormat(str) {
    const reg = /(<em class="keyword">)(.+?)(<\/em>)/g;
    const titleArr = [];
    // 找到关键字位置信息
    str.replace(reg,  function(originStr, $1, content, $2, index) {
        // console.log(arguments)
        // console.log(originStr)
        titleArr.push({index,len: originStr.length, content})
    });
    // 标题中没有关键字直接返回原字符串
    if (titleArr.length < 1) {
        return <Fragment key={str}>{str}</Fragment>
    }
    // 找到关键字,将关键字前的字符推入数组
    let result = titleArr.map((item, i) => {
        if (i < 1) {
            return str.slice(titleArr[i - 1] ? titleArr[i - 1].index + titleArr[i - 1].len : 0, item.index)
        }
        return str.slice(titleArr[i - 1].index + titleArr[i - 1].len, item.index)
    })
    // console.log(titleArr)
    // 最后一个关键字之后的所有字符
    result.push(str.slice(titleArr[titleArr.length - 1].index +  titleArr[titleArr.length - 1].len))
    // console.log(result)

    // 循环拼接,有关键字就使用span作jsx
    return (
        <>
            {
                result.map((item, i) => {
                    if (i === 0) {
                        return <Fragment key={item}>{item}</Fragment>
                    }
                    return (
                        <Fragment key={item}><span className={style.keyword}>{titleArr[i - 1].content}</span>{item}</Fragment>
                    )
                })
            }
        </>
    )
}

export {
    biliSearchResultList
}

