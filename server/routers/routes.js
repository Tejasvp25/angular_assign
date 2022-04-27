var express = require("express");
var globRoom = require("../controllers/GlobalRoomController");
var groupRoom = require("../controllers/GroupRoomController");

module.exports = (app) => {
  app.get("/api/getChatHist", globRoom.getChatHist);
  app.get("/api/getChatHist/:groupId", groupRoom.getChatHist);
  app.get("/api/getNumMsgs", globRoom.getNumMsgs);
};
