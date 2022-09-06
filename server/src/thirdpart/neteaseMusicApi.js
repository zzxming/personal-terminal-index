const { cloudsearch } = require('NeteaseCloudMusicApi');

const searchMusic = async (keywords, limit = 10) => {
    if (!keywords) {
        return [];
    }
    try {
        const result = await cloudsearch({
            keywords,
            type: 1,
            limit
        })
        if (result.status !== 200) {
            return [];
        }
        return result.body?.result?.songs ?? []
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

const searchMusicList = async (keywords, limit = 10) => {
    if (!keywords) {
        return [];
    }
    try {
        const result = await cloudsearch({
            keywords,
            type: 1000,
            limit: 100
        })
        if (result.status !== 200) {
            return [];
        }
        return result.body?.result?.playlists ?? []
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

module.exports = {
    searchMusic,
    searchMusicList
}
