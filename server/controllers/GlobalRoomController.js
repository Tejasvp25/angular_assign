//#region ---------imports--------------
var localConfig = require('../config/headers').localConfig
var globalRoomRepo = require('../Repo/GlobalRoomRepo')
//#endregion ---------imports--------------

/**
 * --Structure--
 *Create
 *Load
 *Update
 *Remove
 */

//#region -------------- Create ----------------------//
exports.addNewMessage = async (msg, un) => {
    globalRoomRepo.createNewMessage(msg, un);
}
//#endregion -------------- Create ----------------------//

//#region -------------- Load ----------------------//
exports.getChatHist = async (req, res) => {
    await globalRoomRepo.loadChatHist()
        .then(repoResult => {
            res.json(repoResult);
        })
}

exports.getNumUsers = async (req, res) => {
    await globalRoomRepo.loadNumUsers()
        .then(repoResult => res.json(repoResult))
}

exports.getNumMsgs = async (req, res) => {
    await globalRoomRepo.loadNumMsgs()
        .then(repoResult => repoResult[0])
        .then(repoResult => res.json(repoResult))
}

exports.getAllMessages = async (req, res) => {
    await globalRoomRepo.loadAllMessages()
        .then(repoResult => res.json(repoResult))
}
//#endregion -------------- Load ----------------------//

//#region -------------- Update ----------------------//

//Returns true on successful update and false if the update is unsuccessful
exports.updateUserCount = async (data) => {
    return globalRoomRepo.updateUserCount(data)
}
//#endregion -------------- Update ----------------------//

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