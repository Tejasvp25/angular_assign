"use strict";
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
app.use(require("cors")());

exports.app = app;
exports.server = server;
exports.io = io;
