// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

// require('appmetrics-dash').attach();
// require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const log4js = require('log4js');
const localConfig = require('./config/local.json');
var fs = require('fs')
var socketManager = require('./controllers/socketManagerNew')

const logger = log4js.getLogger(appName);

const app = require('./config/headers').app
const server = require('./config/headers').server
var io = require('./config/headers').io


var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/chatRoomDb',{
    useNewUrlParser: true
})

app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);
require('./routers/routes')(app);
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
