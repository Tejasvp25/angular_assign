var path = require('path')
var socketManager = require('./controllers/SocketController')

const app = require('./config/headers').app
const server = require('./config/headers').server
const localConfig = require('./config/headers').localConfig;
// var io = require('./config/headers').io


var mongoose = require('mongoose')
mongoose.Promise = global.Promise

if (process.env.DB_CONNECTION_STR) {
    const dbConnStr = process.env.DB_CONNECTION_STR
    const dbPassword = process.env.DB_PASSWORD
    mongoose.connect(dbConnStr.replace('<password>', dbPassword), {
        useNewUrlParser: true
    });
} else {
    mongoose.connect('mongodb://localhost/chatRoomDb', {
        useNewUrlParser: true
    });
}

require('./routers/index')(app, server);
require('./routers/routes')(app);

const port = process.env.PORT || localConfig.port;
server.listen(port, function () {
    // console.log(`ChatRoom listening on http://localhost:${port}`);
    console.log(`ChatRoom listening on Port :${port}`);
});

// Pass route handling to angular
app.use(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/dist/chatroom/index.html'));
})

// app.use(function (req, res, next) {
//     res.sendFile(path.join(__dirname, '../public', '404.html'));
// });

app.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
});
