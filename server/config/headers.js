const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
var io = require('socket.io').listen(server)

exports.app = app
exports.server = server
exports.io = io