import { Fragment } from 'react';
import {
    AxiosResult,
    getNeteaseMusic,
    getNeteaseMusicList,
    MusicResult,
} from '../../assets/js/api'
import { Command } from '../../interface/interface';

const command: Command = {
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
            defaultValue: false,
            valueNeeded: false,
            legalValue: {
                false: '不使用id搜索',
                true: '使用id搜索',
            }
        }
    ],
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type, id } = args;
        const keywords = _.join(' ');

        // 0请求歌单,2请求歌曲
        const musicRequestOption: {
            [key: string]: { type: number; func: (keywords: any) => Promise<AxiosResult<MusicResult[]>>; height: number; }
        } = {
            0: { type: 0, func: getNeteaseMusicList, height: 450 },
            2: { type: 2, func: getNeteaseMusic, height: 110 }
        }
        const getTypeOption = musicRequestOption[type as number];
        let urlid: string | number = keywords;
        // 没有id搜索,正常关键字搜索
        if (!id) {
            const result = await getTypeOption.func(keywords);
            // console.log(result)
            const songs = result.data.data;
            if (songs.length < 1) {
                return 'Not Found';
            }
            urlid = songs[0].id;
        }

        let url = `https://music.163.com/outchain/player?type=${type}&id=${urlid}&auto=1&height=${getTypeOption.height - 20}`;
        return (
            <div key={`music result ${url}`}>
                <iframe 
                    frameBorder="no" marginWidth={0} marginHeight={0} width="330" 
                    height={getTypeOption.height} 
                    src={url}
                    title={`${keywords}`}
                >
                </iframe>
            </div>
        )
    }
}


export {
    command
}


    