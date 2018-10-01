// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

// require('appmetrics-dash').attach();
// require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
var fs = require('fs')


const logger = log4js.getLogger(appName);
const app = express();
const server = http.createServer(app);
var io = require('socket.io').listen(server)


app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Add your code here

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`ChatRoom listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`ChatRoom listening on http://localhost:${port}`);
  console.log(`ChatRoom listening on http://localhost:${port}`);
});

app.use(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
});

///@author : Sraavan

var groups = []

var userIdCount = 0;
var mainObj = JSON.parse('{}')
mainObj.groups = {}
mainObj.groups.globRoom = {}
mainObj.groups.globRoom.msgCount = "0";
mainObj.groups.globRoom.messages = {}
mainObj.groups.globRoom.messagesUserName = {}

io.on('connection', (socket) => {
    console.log("A user connected")
    
    userIdCount++;
    console.log("Number of active users : "+userIdCount)
    
    var msgToAdd = []
    var fPath = path.join(__dirname,"dataFiles","glob_room.json");
    var obj = {}

    mainObj.userIdCount = userIdCount
    
    var userId = userIdCount
    // console.log(io.sockets.length)
    // mainObj[userId] = {}
    // mainObj[userId].groups = {}
    // mainObj[userId].groups.globRoom = {}
    // mainObj[userId].groups.globRoom.msgCount = '0';
    // mainObj[userId].groups.globRoom.messages = {}
    
    //If users are not signed up they land up in the globRoom

    // fs.readFile(fPath, (err,data) => {
    //     if (err || data == undefined){
    //         console.log(err)
    //         socket.emit('initChat',"No Data in file!")
    //         console.log('initChat',"No Data in file!")
    //         // fs.writeFileSync(fPath,'w',err => console.log(err))
    //         // fs.closeSync(fs.openSync(fPath, 'w'));
    //     }else{
    //         console.log("File data : "+data)
    //         // fs.writeFileSync(fPath,JSON.stringify(mainObj))
    //         // socket.emit('initChat',JSON.stringify(JSON.parse(data)["0"].groups.globRoom))
    //         socket.emit('initChat',JSON.stringify(mainObj.groups.globRoom));
    //     }
    // })

    console.log('Emitting', userIdCount)
    io.sockets.emit('getUsers',userIdCount);

    socket.emit('chatHist', mainObj.groups.globRoom)
    socket.on('clientMsg', (data) => {
        console.log("Message : ",data[0])
        console.log("UserId : ",data[1])
        socket.broadcast.emit('serverMsg',data)
        // mainObj[userId].groups['globRoom'].messages[mainObj[userId].groups.globRoom.msgCount] = data
        // mainObj[userId].groups['globRoom'].msgCount++;
        mainObj.groups.globRoom.msgCount++;
        mainObj.groups.globRoom.messages[mainObj.groups.globRoom.msgCount] = data[0];
        mainObj.groups.globRoom.messagesUserName[mainObj.groups.globRoom.msgCount] = data[1];
        console.log(JSON.stringify(mainObj))
        // fs.writeFile(fPath,JSON.stringify(mainObj), err => {})
    })
    count = 0
    socket.on('changeGrp', (data) => {
        console.log(count++)
        console.log(socket.rooms)
        socket.rooms = {}
        socket.join(`/${data}`)
        var msgData  = ""
        // fPath = path.join(__dirname,"dataFiles",data+'.json')
        try{
            // msgData = fs.readFileSync(fPath);
        }catch(err){
            // fs.open(fpath,'a',(err) => console.log(err))
        }
        socket.emit('chatHist',msgData)
    })

    socket.on('addGrp', data => {
        groups.push(data)
        socket.join(`/${data}`)
    })

    socket.on('disconnect', () => {
        userIdCount--
        io.sockets.emit('getUsers',userIdCount);
        if (mainObj.groups.globRoom.msgCount>100){ 
            //If the message threshold reaches this limit then the previous messages would be deleted
            mainObj.groups.globRoom.msgCount = "0";
            mainObj.groups.globRoom.messages = {}
            mainObj.groups.globRoom.messagesUserName = {}
        }
    })
})