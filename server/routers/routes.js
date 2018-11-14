var express = require('express')
var globRoom = require('../controllers/dbController')

module.exports = (app) => {
    app.get('/getChatHist',globRoom.getAllInfo)

    app.get('/getNumMsgs',globRoom.getNumMsgs)
}

