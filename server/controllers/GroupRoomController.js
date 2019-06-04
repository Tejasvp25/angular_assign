//#region ---------imports--------------
var ObjectId = require('mongodb').ObjectID;
const ResAPI = require('../Parameters/ResAPI');
const ApiReturnEnum = require('../models/Enums/APIReturnEnum')

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
    let resAPI = new ResAPI();
    await groupRoomRepo.createNewGroup(grpName)
        .then(res => {
            resAPI.retCode = ApiReturnEnum.Successful;
            resAPI.object = res._id;
        })
        .catch(err => {
            custConsoleLog(err);
            resAPI.retMessage = "Error creating new room";
            resAPI.retCode = ApiReturnEnum.ErrorOccured;
        });
    return resAPI;
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
        return 0;
    }

    let numUsers;
    await groupRoomRepo.loadNumUsers(o_grpId)
        .then(res => res[0])
        .then(res => numUsers = res["userIdCount"])
        .catch(err => numUsers = 0);
    return numUsers;
}

exports.isGroupExists = async (grpId) => {
    let resAPI = new ResAPI();
    let o_grpId;
    try {
        o_grpId = new ObjectId(grpId);
    } catch (err) {
        // custConsoleLog(err);
        resAPI.retCode = ApiReturnEnum.ErrorOccured;
        resAPI.object = false;
        resAPI.retMessage = "Invalid room id";
        return Promise.resolve(resAPI);
    }

    let isValidGrp;
    await groupRoomRepo.isGroupExists(o_grpId)
        .then(res => {
            // custConsoleLog(res)
            resAPI.retCode = ApiReturnEnum.Successful;
            isValidGrp = res.length !== 0
        })
        .catch(err => {
            resAPI.retCode = ApiReturnEnum.ErrorOccured;
            resAPI.object = false;
            resAPI.retMessage = "Invalid room id";
        })

    custConsoleLog(resAPI.object)
    resAPI.object = isValidGrp
    return resAPI;
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