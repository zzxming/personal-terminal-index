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
            valueNeeded: true
        }, {
            key: 'id',
            alias: 'i',
            desc: '是否使用id获取',
            defaultValue: null,
            valueNeeded: false
        }
    ],
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type, id } = args;
        const keywords = _.join(' ');
        // 是否按id搜索
        // const indexId = args.findIndex(v => v === '-i');
        // let inpMusicIsId = false;
        // if (indexId !== -1) {
        //     inpMusicIsId = true;
        // }
        // // 搜索类型是什么, 默认是歌曲, 0是歌单, 2是歌曲
        // const indexType = args.findIndex(v => v === '-t');
        // let type = 2;
        // if (indexType !== -1) {
        //     let v = args[indexType + 1];
        //     try {
        //         if (isNaN(v)) {
        //             throw new Error('参数错误');
        //         }
        //     } catch(e) {
        //         return e.message
        //     }
        //     type = v;
        // }
        // // 关键词
        // const keywords = args[0];

        // 0请求歌单,2请求歌曲
        const musicRequestOption = {
            0: { type: 0, func: getNeteaseMusicList, height: 450 },
            2: { type: 2, func: getNeteaseMusic, height: 110 }
        }
        // 没有id搜索,正常关键字搜索
        if (id === null) {
            const result = await musicRequestOption[type].func(keywords);
            // console.log(result)
            const songs = result.data.data;
            if (songs.length < 1) {
                return 'Not Found';
            }
            else {
                let url = `https://music.163.com/outchain/player?type=${type}&id=${songs[0].id}&auto=1&height=${musicRequestOption[type].height - 20}`;
                return (
                    <iframe renderkey={new Date().getTime() + url} frameBorder="no" border="0" marginWidth="0" marginHeight="0" width="330" height={musicRequestOption[type].height} src={url}></iframe>
                )
            }
        }
        else {
            // id搜索直接
            let url = `https://music.163.com/outchain/player?type=${type}&id=${keywords}&auto=1&height=${musicRequestOption[type].height - 20}`;
            return (
                <iframe renderkey={new Date().getTime() + url} frameBorder="no" border="0" marginWidth="0" marginHeight="0" width="330" height={musicRequestOption[type].height} src={url}></iframe>
            )
        }
    }
}


export {
    command
}


    