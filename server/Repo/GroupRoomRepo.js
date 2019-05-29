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
let numMessages;
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
    new_grp = new groupRoom({
        "groupName": groupName
    })
    new_grp.save((err, res) => {
        if (err){
            console.log(err);
            res.retcode = APIReturnEnum.ErrorOccured;
            res.object = false;
        }
        console.log("Group added successfully!")
        res.retCode = APIReturnEnum.Successful;
        res.object = true;
    })
}

exports.createNewMessage = async (msg, userName) => {
    res = new ResAPI();

    // Increase the msg count by 1
    await incrementNumMsgs()

    console.log("NumMessages: " + numMessages)

    // If the number of message(s) is 1, then create the global room
    if (numMessages === 1) {
        main = new globRoom({ "userIdCount": 1, "msgCount": 1, "messages": [{ "userName": userName, "data": msg }] })
        main.save((err, res) => {
            if (err) {
                console.log(err)
                res.retCode = APIReturnEnum.ErrorOccured;
                res.object = false;
                // return res
            }
            console.log("Message added successfully!! -- New")
            res.retCode = APIReturnEnum.Successful;
            res.object = true;
            // return res;
        })
    }

    // Push new messages
    globRoom.findOneAndUpdate({}, {
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
exports.loadChatHist = async () => {
    return await globRoom.find({}, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        return data;
    })
}

exports.loadNumUsers = async () => {
    return await globRoom.find({}, { userIdCount: 1 }, (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        return data;
    })
}

loadNumMsgs = async () => {
    return await globRoom.find({}, { msgCount: 1 }, (err, data) => {
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
    await globRoom.find({}, { messages: 1 }, (err, data) => {
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
    return await globRoom.findOneAndUpdate(
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
updateMsgCount = async (data) => {
    return await globRoom.findOneAndUpdate(
        {},
        { msgCount: data },
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
    return await globRoom.update({}, { messages: [] }, (err, result) => {
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
async function incrementNumMsgs() {
    if (isNaN(numMessages)) {
        await loadNumMsgs()
            .then(res => res[0])
            .then(res => numMessages = res.msgCount)
            .catch(err => {
                numMessages = 0;
            });
    }

    updateMsgCount(++numMessages)
        .then(newCount => newCount.msgCount)
        .then(newCount => numMessages = newCount)
        .catch(err => { });
}

//#endregion --------------------Helper Functions----------------//