//#region ---------imports--------------
var ObjectId = require('mongodb').ObjectID;

var groupRoomRepo = require('../Repo/GroupRoomRepo')
//#endregion ---------imports--------------

//#region -----------------Global variables-----------------
let logName = "GroupRoomController"
//#endregion -----------------Global variables-----------------


/**
 * --Structure--
 *Create
 *Load
 *Update
 *Remove
 */

//#region ----------------- Create ----------------------//
exports.createNewGroup = async (grpName) => {
    let resultId = '';
    await groupRoomRepo.createNewGroup(grpName)
        .then(res => resultId = res._id)
        .catch(err => custConsoleLog(err));
    return resultId;
}

exports.createNewMessage = async (grpId, msg, un) => {
    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        custConsoleLog(err);
        return;
    }
    groupRoomRepo.createNewMessage(o_grpId, msg, un);
}
//#endregion -------------- Create ----------------------//


//#region -------------- -- Load ----------------------//
exports.getChatHist = async (req, res) => {
    grpId = req.params.groupId

    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        custConsoleLog(err);
        return;
    }
    await groupRoomRepo.loadChatHist(o_grpId)
        .then(repoResult => {
            res.json(repoResult);
        })
}

exports.getNumUsersInGroup = async (grpId) => {
    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        custConsoleLog(err);
        return;
    }

    let numUsers;
    await groupRoomRepo.loadNumUsers(o_grpId)
        .then(res => res[0])
        .then(res => numUsers = res["userIdCount"]);
    return numUsers;
}

exports.isGroupExists = async (grpId) => {
    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        custConsoleLog(err);
        return Promise.resolve(false);
    }
    return groupRoomRepo.isGroupExists(o_grpId);
}

//#endregion -------------- -- Load ----------------------//


//#region -------------------- Update ----------------------//

exports.updateUserCount = async (grpId, count) => {
    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        custConsoleLog(err);
        return;
    }
    groupRoomRepo.updateUserCount(o_grpId, count)
    
}
//#endregion ----------------- Update ----------------------//


//#region -------------------- Remove ----------------------//

//#endregion ----------------- Remove ----------------------//

//#region -----------------------Helper functions----------------------------
function custConsoleLog(str) {
    console.log(`${logName} :: ${str}`)
}
//#endregion --------------------Helper functions----------------------------