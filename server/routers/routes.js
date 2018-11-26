var express = require('express')
var globRoom = require('../controllers/dbController')
var groupRoom = require('../controllers/groupDbController')

module.exports = (app) => {
    app.get('/getChatHist',globRoom.getAllInfo)

    app.get('/getNumMsgs',globRoom.getNumMsgs)

    app.post(':groupId',groupRoom.addNewGroup)
}

