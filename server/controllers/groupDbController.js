var mongoose = require('mongoose');
var chatRoomSchema = require('../models/globalRoomSchema')

var groupRoomSchema = chatRoomSchema.groupRoom;
var groupRoom = mongoose.model('groups',groupRoomSchema)

exports.getAllInfo = (req,res) => {
    groupRoom.findById(req.params.groupId, (err,data) => {
        if (err){
            console.log(err)
            return ""
        }
        res.json(data)
    })
}

exports.addNewGroup = (res,req) => {
    new_grp = groupRoom({"groupName": res.params.grpName, "messages": []})
    new_grp.save((err,res) => {
        if (err){
            console.log(err)
            return false
        }
        console.log("Message added successfully!!")
    })
}

