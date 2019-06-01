///@author : Sraavan Sridhar

var io = require('../config/headers').io
// var globRoomController = require('./GlobalRoomController')
var groupRoomController = require('./GroupRoomController')

let logName = "SocketController"

exports.new_socket_conn = io.on('connection', (socket) => {
    console.log("A user connected")
    // console.log(socket.rooms)

    //data = {"grpId":grpId, "message" : msg, "username": username}
    socket.on('clientMsg', (data) => {
        console.log(socket.rooms)
        console.log("Group Id : ", data["grpId"]);
        console.log("Message : ", data["message"])
        console.log("UserName : ", data["username"])
        Object.keys(socket.rooms).forEach(roomId => {
            custConsoleLog(roomId);
            emitNewMessage(roomId, data);
            groupRoomController.createNewMessage(data.grpId, data.message, data.username)
            return;
        });
    })


    socket.on('addGrp', async (grpName) => {
        //Decrease number of users in the room the socket is currently in
        let curGrpId = socket.roomId;
        let count;
        if (typeof curGrpId !== 'undefined') {
            custConsoleLog("Reducing CurGrpId");
            count = await decreaseUserCount(curGrpId);
            emitUserCountUpdate(curGrpId, count);
        }
        socket.leaveAll();

        let newGroupId;
        await groupRoomController.createNewGroup(grpName).then(
            res => newGroupId = res
        );

        //Socket joins the groupId
        socket.join(newGroupId);
        socket.roomId = newGroupId;

        emitAddGroupResult(newGroupId);
        emitUserCountUpdate(newGroupId, 1); //Default number of active users in the room when the room is created
        return newGroupId;
    })

    socket.on('joinGrp', async (newGrpId) => {

        //Check if the group is valid
        let isValidGroup;
        await groupRoomController.isGroupExists(newGrpId)
            .then(res => isValidGroup = res);

        if (!isValidGroup || isValidGroup === null || isValidGroup === undefined) {
            custConsoleLog("Not a valid group");
            emitJoinGroupResult(false, '');
            return;
        }

        //Decrease number of users in the room the socket is currently in
        let curGrpId = socket.roomId;
        let count;
        if (typeof curGrpId !== 'undefined') {
            custConsoleLog("Reducing CurGrpId");
            count = await decreaseUserCount(curGrpId);
            emitUserCountUpdate(curGrpId, count);
        }

        //Leave all the joined rooms which is always 1
        socket.leaveAll();

        socket.join(newGrpId);

        socket.roomId = newGrpId;

        //Increase the number of users in the room the socket is joining
        count = await increaseUserCount(newGrpId);
        emitUserCountUpdate(newGrpId, count);

        emitJoinGroupResult(true, newGrpId);
    })

    socket.on('disconnect', async () => {
        let curGrpId = socket.roomId;

        custConsoleLog("A User disconnected from " + curGrpId)

        if (curGrpId === undefined || curGrpId === null) {
            return;
        }

        const count = await decreaseUserCount(curGrpId);
        emitUserCountUpdate(curGrpId, count);

    });


    //#region ------------------Socket Emitting functions-----------------------
    function emitAddGroupResult(grpId) {
        socket.emit('grpCreated', grpId);
    }

    function emitJoinGroupResult(success, grpId = '') {
        let data = {
            "success": success,
            "grpId": grpId
        }
        socket.emit('joinGrpResult', data);
    }

    function emitUserCountUpdate(grpId, count) {
        custConsoleLog("Emiting num users: " + count + " to grp: " + grpId);
        io.sockets.to(grpId).emit('getUsers', count);
    }

    //data = {"grpId":grpId, "message" : msg, "username": username}
    function emitNewMessage(grpId, data) {
        socket.broadcast.to(grpId).emit('serverMsg', data);
    }
    //#endregion ---------------Socket Emitting functions-----------------------
})


//#region -----------------------Helper functions----------------------------

//returns the number of users+1 in a group
async function increaseUserCount(grpId) {
    return await updateUserCount(grpId, 1);
}

//returns the number of users-1 in a group
async function decreaseUserCount(grpId) {
    return await updateUserCount(grpId, -1);
}

//returns the number of updated users in a group
async function updateUserCount(grpId, adjValue) {
    let curUsers = await groupRoomController.getNumUsersInGroup(grpId);
    custConsoleLog("Num Users: " + curUsers);

    curUsers += adjValue;
    groupRoomController.updateUserCount(grpId, curUsers);
    return curUsers;


    // globRoomController.updateUserCount(updatedCount)
    //     .then(newCount => newCount.userIdCount)
    //     .then(newCount => {
    //         console.log('Newcount:', newCount)
    //         userIdCount = newCount;

    //         //Update user count to all connections
    //         io.sockets.emit('getUsers', userIdCount);
    //     })
    //     .catch(err => {
    //         //Update user count to all connections in case there are no messages in the document
    //         io.sockets.emit('getUsers', userIdCount);
    //     });
}

function custConsoleLog(str) {
    console.log(`${logName} :: ${str}`)
}
//#endregion -----------------------Helper functions----------------------------

