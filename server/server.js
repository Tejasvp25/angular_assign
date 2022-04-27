var path = require("path");

const app = require("./config/headers").app;
const server = require("./config/headers").server;
var socketManager = require("./controllers/SocketController");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/chatRoomDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require("./routers/index")(app, server);
require("./routers/routes")(app);

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/dist/chatroom/index.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log(`ChatRoom listening on Port :${port}`);
});
