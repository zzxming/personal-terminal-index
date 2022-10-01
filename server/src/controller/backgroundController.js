const { backgroundImageUrl } = require("../thirdpart/backgroundApi")



const getBackgroundImage = async (event, req, res) => {
    const { type } = event;
    return await backgroundImageUrl(type);
}

module.exports = {
    getBackgroundImage
}
