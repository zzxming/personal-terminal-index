const { backgroundImageUrl } = require("../thirdpart/backgroundApi")



const getBackgroundImage = async (event, req, res) => {
    const { type } = event;
    let result = await backgroundImageUrl(type);
    return result;
}

module.exports = {
    getBackgroundImage
}
