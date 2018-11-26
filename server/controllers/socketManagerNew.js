///@author : Sraavan

var io = require('../config/headers').io
var chatDb = require('./dbController')

var userIdCount = 0

exports.new_socket_conn = io.on('connection',(socket) => {
    console.log("A user connected")
    console.log(socket.rooms)
    userIdCount++;
    console.log("Number of active users : "+userIdCount)

    console.log('Emitting', userIdCount)
    io.sockets.emit('getUsers',userIdCount);
    
    //data = [message, username]
    socket.on('clientMsg', (data) => { 
        console.log("Message : ",data[0])
        console.log("UserId : ",data[1])
        socket.broadcast.emit('serverMsg',data)
        chatDb.addNewMessage(data[0],data[1])
        chatDb.incrementMsgCount()
    })


    socket.on('disconnect', () => {
        userIdCount--
        chatDb.updateUserCount(userIdCount)
        io.sockets.emit('getUsers',userIdCount)
    })
})