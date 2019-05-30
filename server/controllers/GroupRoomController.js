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
    let resultId;
    await groupRoomRepo.createNewGroup(grpName)
        .then(res => resultId = res._id)
        .catch(err => custConsoleLog(err));
    return resultId;
}

exports.createNewMessage = async (grpId, msg, un) => {
    o_grpId = new ObjectId(grpId);
    groupRoomRepo.createNewMessage(o_grpId, msg, un);
}
//#endregion -------------- Create ----------------------//


//#region -------------- -- Load ----------------------//
exports.getChatHist = async (req, res) => {
    grpId = req.params.groupId
    o_grpId = new ObjectId(grpId);
    await groupRoomRepo.loadChatHist(o_grpId)
        .then(repoResult => {
            res.json(repoResult);
        })
}

exports.getNumUsers = (req, res) => {
    groupRoom.findById(req.params.groupId, { usersInGroup: 1 }, (err, data) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.json(data)
    })
}
//#endregion -------------- -- Load ----------------------//


//#region -------------------- Update ----------------------//

//#endregion ----------------- Update ----------------------//


//#region -------------------- Remove ----------------------//

//#endregion ----------------- Remove ----------------------//

//#region -----------------------Helper functions----------------------------
function custConsoleLog(str){
    console.log(`${logName} :: ${str}`)
}
//#endregion --------------------Helper functions----------------------------