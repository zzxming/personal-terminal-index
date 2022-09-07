import { biliSearchResultList } from "./biliSearchListOutput";

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

const command = {
    name: 'bili',
    desc: 'b站搜索',
    param: {
        key: 'keyword',
        desc: '关键词',
        required: true,
    },
    option: [
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
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type } = args;
        if (!result_type.includes(type)) {
            return 'option type error'
        }

        const keywords = _[0];

        return biliSearchResultList(keywords, type, commandHandle);
        // return 'some'
    }
}

export {
    command
}