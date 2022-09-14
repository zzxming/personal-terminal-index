# /fanyi/translate
    ```
    百度翻译 get
    参数：{
        config: {
            to: string, 翻译至语言
            from: string, 翻译原语言
        }
    }
    返回值：{
        code: number(0)
        data: {
            to: string, 翻译至语言
            from: string, 翻译原语言
            trans_result: [
                { 
                    src: string, 翻译原关键字
                    dst: string, 翻译至关键字
                }
            ]
        }
    }
    ```
# /music/get
    ```
    参数：{
        keywords: string, 搜索关键字
    }
    返回值：{
        code: number(0)
        data: [
            {
                name: string, 歌曲名称
                id: number, 歌曲id
            }
        ]
    }
    ```
# /music/list
    ```
    参数：{
        keywords: string, 搜索关键字
    }
    返回值：{
        code: number(0)
        data: [
            {
                name: string, 歌单名称
                id: number, 歌单id
            }
        ]
    }
    ```
# /background/random
    ```
    参数：{
        type: ['meizi', 'dongman', 'fengjing', 'suiji']
    }
    返回值：{
        code: number(0)
        data: string, 图片url
    }
    ```
# /bili/search
    ```
    参数：{
        keywords: string, 搜索关键字
        page: number, 结果当前页
        pageSize: number, 一页数据量
    }
    返回值：{
        code: number(0)
        data: [
            {
                result_type: string, 搜索结果类型
                data: {
                    pageinfo: [
                        {
                            numResults: string
                            total: string
                            pages: string
                        }
                    ]
                    result: [
                        {
                            author: string, 作者名称
                            pic: string, 视频封面
                            title: string, 视频标题
                            play: number, 播放量
                            danmaku: number, 弹幕数
                            duration: string, 视频时长, hh:mm:ss
                            bvid: string, bv号
                            mid: number, up主id
                        }
                    ]
                }
            }
        ]
    }
    ```
# /bili/pic
    ```
    参数：{
        pic: string, b站视频封面路径
    }
    返回值：{
        code: number(0)
        data: string, base64图片地址
    }
    ```
# /bili/searchtype
    ```
    参数：{
        keywords: string, 搜索关键字
        page: number, 结果当前页
        pageSize: number, 一页数据量
        search_type: string, 搜索类型
    }
    返回值：{
        code: number(0)
        data: [
            {
                page: number, 搜索页数
                pagesize: number, 返回数据量
                numResults: number, 总数据量
                numPages: number, 一页数据量
                result: [
                    {
                        type: string, 类型
                        author: string, 作者名称
                        pic: string, 视频封面
                        title: string, 视频标题
                        play: number, 播放量
                        danmaku: number, 弹幕数
                        duration: string, 视频时长, hh:mm:ss
                        bvid: string, bv号
                        mid: number, up主id
                    }
                ]
            }
        ]
    }
    ```