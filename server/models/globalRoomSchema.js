var mongoose = require('mongoose')

const Schema = mongoose.Schema;

exports.globRoom = new Schema({
    userIdCount: {
        type: Number,
        default: 0
    },
    msgCount: {
        type: Number,
        default: 0
    },
    messages:[{
        userName: String,
        data: String
    }]
})

exports.groupRoom = new Schema({
    groupName: {
        type: String
    },
    activeUserIdCount: {
        type: Number,
        default: 0
    },
    usersInGroup: {
        type: Number,
        default: 1
    },
    msgCount: {
        type: Number,
        default: 0
    },
    messages:[{
        userName: String,
        data: String
    }]
})

