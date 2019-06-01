///@author : Sraavan Sridhar

var io = require('../config/headers').io
var globRoomController = require('./GlobalRoomController')
var groupRoomController = require('./GroupRoomController')

var userIdCount = 0
let logName = "SocketController"

exports.new_socket_conn = io.on('connection', (socket) => {
    console.log("A user connected")
    console.log(socket.rooms)



    //data = {"grpId":grpId, "message" : msg, "username": username}
    socket.on('clientMsg', (data) => {
        console.log(socket.rooms)
        console.log("Group Id : ", data["grpId"]);
        console.log("Message : ", data["message"])
        console.log("UserName : ", data["username"])
        Object.keys(socket.rooms).forEach(roomId => {
            emitNewMessage(roomId, data);
            groupRoomController.createNewMessage(data.grpId, data.message, data.username)
        });
    })


    socket.on('addGrp', async (grpName) => {
        socket.leaveAll();

        let groupId;
        await groupRoomController.createNewGroup(grpName).then(
            res => groupId = res
        );

        //Socket joins the groupId
        socket.join(groupId);
        emitAddGroupResult(groupId);
        return groupId;
    })

    socket.on('joinGrp', async (grpId) => {
        //TODO: Remove users from current group here
        socket.leaveAll();

        //Validate group id here
        let isValidGroup;
        await groupRoomController.isGroupExists(grpId)
            .then(res => isValidGroup = res);

        if (!isValidGroup) {
            emitJoinGroupResult(false, grpId);
            return;
        }

        socket.join(grpId);

        const count = increaseUserCount(grpId);
        emitUserCountUpdate(grpId, count);

        emitJoinGroupResult(true, grpId);
    })

    socket.on('disconnect', () => {
        let isValidGroup;
        Object.keys(socket.rooms).forEach(roomId => {
            groupRoomController.isGroupExists(roomId)
                .then(res => isValidGroup = res);

            if (isValidGroup) {
                const count = decreaseUserCount(grpId);
                emitUserCountUpdate(grpId, count);
            }
        })
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
        socket.broadcast.to(grpId).emit('getUsers', count);
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

