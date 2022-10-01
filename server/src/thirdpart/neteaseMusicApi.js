const { cloudsearch } = require('NeteaseCloudMusicApi');

const searchMusic = async (keywords, limit = 10) => {
    if (!keywords) {
        return [];
    }
    const result = await cloudsearch({
        keywords,
        type: 1,
        limit
    })
    .catch(e => {
        throw e.body.msg
    })
    if (result.status !== 200) {
        return [];
    }
    return result.body?.result?.songs ?? []
}

const searchMusicList = async (keywords, limit = 10) => {
    if (!keywords) {
        return [];
    }
    const result = await cloudsearch({
        keywords,
        type: 1000,
        limit: 100
    })
    .catch(e => {
        throw e.body.msg
    })
    if (result.status !== 200) {
        return [];
    }
    return result.body?.result?.playlists ?? []
}

module.exports = {
    searchMusic,
    searchMusicList
}
