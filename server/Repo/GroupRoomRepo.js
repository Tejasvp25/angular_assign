//#region ---------imports--------------
const mongoose = require('mongoose');
const chatRoomSchema = require('../models/RoomsSchema')

const groupRoomSchema = chatRoomSchema.groupRoom;
const groupRoom = mongoose.model('groupRoom', groupRoomSchema);
const ResAPI = require('../Parameters/ResAPI');
const APIReturnEnum = require('../models/Enums/APIReturnEnum');

const fetchService = require('../services/fetchService')
//#endregion ---------imports--------------


//#region -----------------Global variables-----------------

//#endregion -----------------Global variables-----------------

/**
 * --Structure--
 *Create
 *Load
 *Update
 *Remove
 *
 * Helper functions 
 */

//#region ---------------- Create ---------------------//
exports.createNewGroup = async (groupName) => {
    res = new ResAPI();

    new_grp = new groupRoom({
        "groupName": groupName
    })

    return new_grp.save()
}

exports.createNewMessage = async (grpId, msg, userName) => {
    res = new ResAPI();

    // Increase the msg count by 1
    incrementNumMsgs(grpId)

    // Push new messages
    groupRoom.findOneAndUpdate({ _id: grpId }, {
        $addToSet:
        {
            "messages": {
                "userName": userName,
                "data": msg
            }
        }
    }, (err, result) => {
        if (err) {
            console.log("Error inserting message")
            res.retCode = APIReturnEnum.ErrorOccured;
            res.object = false;
            // return res
        }
        console.log("Message inserted succesfully!!")
        res.retCode = APIReturnEnum.Successful;
        res.object = true;
        // return res;
    });
}
//#endregion ---------------- Create ---------------------//

//#region ---------------- Load ---------------------//
exports.loadChatHist = async (grpId) => {
    return await groupRoom.find({_id: grpId}, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        return data;
    })
}

async function loadNumMsgs(grpId) {
    return await groupRoom.find({ _id: grpId }, { msgCount: 1 }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data.length === 0) {
            data = [{ "msgCount": 0 }];
        }
        return data;
    })
}
exports.loadNumMsgs = loadNumMsgs;

exports.loadAllMessages = async () => {
    await groupRoom.find({}, { messages: 1 }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        return data;
    })
}
//#endregion ---------------- Load ---------------------//

//#region ---------------- Update ---------------------//

//Updates user count and returns the updated count
exports.updateUserCount = async (data) => {
    return await groupRoom.findOneAndUpdate(
        {},
        { userIdCount: data },
        { new: true, projection: { userIdCount: 1 } },
        (err, count) => {
            if (err) {
                console.log(err);
                return;
            }
            return count;
        })
}

//Updates message count and returns the updated count
async function updateMsgCount(grpId, newCount) {
    return await groupRoom.findOneAndUpdate(
        { _id: grpId },
        { msgCount: newCount },
        { new: true, projection: { msgCount: 1 } },
        (err, count) => {
            if (err) {
                console.log(err);
                return;
            }
            return count;
        })
}
//#endregion ---------------- Update ---------------------//

//#region ---------------- Remove ---------------------//
exports.removeAllMsgs = async () => {
    return await groupRoom.update({}, { messages: [] }, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        return result;
    })
}
//#endregion ---------------- Remove ---------------------//


//#region ---------------- Helper Functions----------------//

//Increment the number of messages by 1
async function incrementNumMsgs(grpId) {
    let numMessages;

    //Load the current number of messages in the group and increase it by 1
    await loadNumMsgs(grpId)
        .then(res => res[0])
        .then(res => numMessages = res.msgCount)
        .catch(err => {
            numMessages = 0;
        });

    updateMsgCount(grpId, ++numMessages)
        .catch(err => { });
}

//#endregion --------------------Helper Functions----------------//