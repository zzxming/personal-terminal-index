import { biliSearchResultList } from "./biliSearchListOutput";
import { Command } from '../../interface/interface';

const result_type = [
    'tips', 
    'esports', 
    'activity',
    'web_game',
    'card',
    'media_bangumi',
    'media_ft',
    'bili_user',
    'user',
    'star',
    'video'
]

const biliCommand: Command = {
    name: 'bili',
    desc: 'b站搜索',
    params: [
        {
            key: 'keyword',
            desc: '关键词',
            required: true,
        }
    ],
    options: [
        {
            key: 'type',
            alias: 't', 
            desc: '搜索类型',
            defaultValue: 'video',
            valueNeeded: true,
            legalValue: {
                video: '视频',
                // bili_user: '用户'
            }
        }
    ],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type } = args;
        if (!result_type.includes(type as string)) {
            return 'option type error'
        }

        const keywords = _.join(' ');

        return biliSearchResultList(keywords, type as string, commandHandle);
    }
}

export {
    biliCommand
}