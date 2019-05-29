"use strict";
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var localConfig = require('./local.json');

exports.app = app;
exports.server = server;
exports.io = io;
exports.localConfig = localConfig;