//#region ---------imports--------------
var globalRoomRepo = require('../Repo/GlobalRoomRepo')
//#endregion ---------imports--------------

/**
 * --Structure--
 *Create
 *Load
 *Update
 *Remove
 */

//#region ----------------- Create ----------------------//
exports.createNewMessage = async (msg, un) => {
    globalRoomRepo.createNewMessage(msg, un);
}
//#endregion -------------- Create ----------------------//

//#region -------------- -- Load ----------------------//
exports.getChatHist = async (req, res) => {
    await globalRoomRepo.loadChatHist()
        .then(repoResult => {
            res.json(repoResult);
        })
}


exports.getNumMsgs = async (req, res) => {
    await globalRoomRepo.loadNumMsgs()
        .then(repoResult => repoResult[0])
        .then(repoResult => res.json(repoResult))
}

//#endregion -------------- Load ----------------------//

//#region ---------------- Update ----------------------//

exports.updateUserCount = async (data) => {
    return globalRoomRepo.updateUserCount(data)
}
//#endregion -------------Update ----------------------//

//#region -------------- Remove ----------------------//
exports.clearAllMsgs = () => {
    globRoom.update({}, { messages: [] }, (err, result) => {
        if (err) {
            console.log(err)
            return false
        }
        return result;
    })
}
//#endregion -------------- Remove ----------------------//