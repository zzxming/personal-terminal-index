import {
    getNeteaseMusic,
    getNeteaseMusicList,
} from '../../assets/js/api'

const command = {
    name: 'music',
    desc: '网易云音乐',
    param: {
        key: 'name',
        desc: '获取关键词',
        required: true
    },
    option: [
        {
            key: 'type',
            alias: 't',
            desc: '获取类型',
            defaultValue: 2,
            valueNeeded: true,
            legalValue: {
                0: '歌单',
                2: '歌曲'
            }
        }, {
            key: 'id',
            alias: 'i',
            desc: '是否使用id获取',
            defaultValue: null,
            valueNeeded: false,
            legalValue: null
        }
    ],
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type, id } = args;
        const keywords = _.join(' ');

        // 0请求歌单,2请求歌曲
        const musicRequestOption = {
            0: { type: 0, func: getNeteaseMusicList, height: 450 },
            2: { type: 2, func: getNeteaseMusic, height: 110 }
        }
        let urlid = keywords
        // 没有id搜索,正常关键字搜索
        if (id === null) {
            const result = await musicRequestOption[type].func(keywords);
            // console.log(result)
            const songs = result.data.data;
            if (songs.length < 1) {
                return 'Not Found';
            }
            urlid = songs[0].id;
        }

        let url = `https://music.163.com/outchain/player?type=${type}&id=${urlid}&auto=1&height=${musicRequestOption[type].height - 20}`;
        return (
            <iframe 
                renderkey={new Date().getTime() + url} 
                frameBorder="no" border="0" marginWidth="0" marginHeight="0" width="330" 
                height={musicRequestOption[type].height} 
                src={url}
                title={`${type}${keywords}`}
            >
            </iframe>
        )
    }
}


export {
    command
}


    