///@author : Sraavan Sridhar

var io = require('../config/headers').io
var globRoomController = require('./GlobalRoomController')
var groupRoomController = require('./GroupRoomController')

var userIdCount = 0

exports.new_socket_conn = io.on('connection', (socket) => {
    console.log("A user connected")
    console.log(socket.rooms)

    updateUserCount(++userIdCount)

    //data = {"message" : msg, "username": username}
    socket.on('clientMsg', (data) => {
        console.log(socket.rooms)
        console.log("Message : ", data["message"])
        console.log("UserName : ", data["username"])
        Object.keys(socket.rooms).forEach(roomId => {
            socket.broadcast.to(roomId).emit('serverMsg', data)
            globRoomController.addNewMessage(data["message"], data["username"])
        });
    })

    socket.on('addGrp', async (grpName) => {
        socket.leaveAll();
        socket.join(grpName);

        let groupId;
        await groupRoomController.createNewGroup(grpName).then(
            res => groupId = res
        );

        return groupId;
    })

    socket.on('joinGrp', (grpName) => {
        socket.leaveAll();
        socket.join(grpName);
    })

    socket.on('disconnect', () => {
        updateUserCount(--userIdCount)
    });
})


//#region -----------------------Helper functions----------------------------

//Updates the number of users in the chat room
function updateUserCount(updatedCount) {
    globRoomController.updateUserCount(updatedCount)
        .then(newCount => newCount.userIdCount)
        .then(newCount => {
            console.log('Newcount:', newCount)
            userIdCount = newCount;

            //Update user count to all connections
            io.sockets.emit('getUsers', userIdCount);
        })
        .catch(err => {
            //Update user count to all connections in case there are no messages in the document
            io.sockets.emit('getUsers', userIdCount);
        });
}

//#endregion -----------------------Helper functions----------------------------

