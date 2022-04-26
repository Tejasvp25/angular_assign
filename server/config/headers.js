"use strict";
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
var localConfig = require("./local.json");
app.use(require("cors")());

// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = Server(server);

exports.app = app;
exports.server = server;
exports.io = io;
exports.localConfig = localConfig;
