const { searchMusic, searchMusicList } = require('../thirdpart/neteaseMusicApi');

const getSingleMusic = async (event, req, res) => {
    const { keywords } = event;
    if (!keywords) {
        throw new Error("music Params error 请输入关键词");
    }
    const songs = await searchMusic(event.keywords);
    if (!songs) {
        throw new Error('music Not found');
    }
    console.log('get single music')
    return songs.map(item => ({name: item.name, id: item.id}))
}

const getMusicList = async (event, req, res) => {
    const { keywords } = event;
    if (!keywords) {
        throw new Error("music Params error 请输入关键词");
    }
    const lists = await searchMusicList(event.keywords);
    // console.log(lists)
    if (!lists) {
        throw new Error('music Not found');
    }
    console.log('get music list')
    return lists.map(item => ({name: item.name, id: item.id}))
}

module.exports = {
    getSingleMusic,
    getMusicList
}
