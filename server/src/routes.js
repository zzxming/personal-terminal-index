
const routes = [
    {
        path: '/fanyi/translate',
        method: 'post',
        handle: require('./controller/fanyiController').getTranslateApi
    }, {
        path: '/music/get',
        method: 'post',
        handle: require('./controller/musicController').getSingleMusic
    }, {
        path: '/music/list',
        method: 'post',
        handle: require('./controller/musicController').getMusicList
    }, {
        path: '/background/random',
        method: 'get',
        handle: require('./controller/backgroundController').getBackgroundImage
    }, {
        path: '/bili/search',
        method: 'get',
        handle: require('./controller/biliController').getBiliSearchResultApi
    }, {
        path: '/bili/pic',
        method: 'get',
        handle: require('./controller/biliController').getBiliPic
    }
];


module.exports = {
    routes
};
