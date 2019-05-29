//#region ---------imports--------------
var groupRoomRepo = require('../Repo/GroupRoomRepo')
//#endregion ---------imports--------------

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
        .catch(err => console.log("GroupDbController: \n", err));
    return resultId;
}
//#endregion -------------- Create ----------------------//


//#region -------------- -- Load ----------------------//
exports.getAllInfo = (req, res) => {
    groupRoom.findById(req.params.groupId, (err, data) => {
        if (err) {
            console.log(err)
            return ""
        }
        res.json(data)
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