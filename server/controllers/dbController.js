var mongoose = require('mongoose');
var chatRoomSchema = require('../models/globalRoomSchema')
var axios = require('axios')

var globalRoomSchema = chatRoomSchema.globRoom;
var globRoom = mongoose.model('globRoom',globalRoomSchema);

const url_getNumMsgs = 'http://localhost:3000/getNumMsgs';

var numMessages;

var fetchNumMsgs = async url => {
    try{
        var res = await axios.get(url);
        var resp = res.data
         return resp.msgCount;
    }catch (error){
        console.log("Error : ",error)
    }
}

fetchNumMsgs(url_getNumMsgs).then(res => numMessages = res)


exports.getAllInfo = (req,res) => {
    globRoom.find({}, (err,data) => {
        if (err){
            console.log(err)
            return ""
        }
        if (data == ""){
            console.log("yes")
        }
        console.log(data[0])
        res.json(data[0])
    })
}

exports.getNumUsers = (req,res) => {
    globRoom.find({},{userIdCount:1}, (err, data) => {
        if (err){
            console.log(err)
            res.send(err)
        }
        console.log()
        res.json(data)
    })
}

exports.getNumMsgs = (req,res) => {
    globRoom.find({},{msgCount:1}, (err, data) => {
        if (err){
            res.send(err)
        }
        if (data.length==0){
            data = [{"msgCount" : 0}]
        }
        res.json(data[0])
    })
}

exports.getAllMessages = (req,res) => {
    globRoom.find({},{messages:1}, (err, data) => {
        if (err){
            console.log(err)
            res.send(err)
        }
        res.json(data)

    })
}


exports.addNewMessage  = (msg, un) => {
    // obj = JSON.stringify({"userName": un, "data": msg})
    console.log(numMessages)
    if (numMessages==0){
        numMessages++
        main = new globRoom({"userIdCount":numMessages, "msgCount": 1, "messages":[{"userName":un,"data":msg}]})
        main.save((err, res) => {
            if (err){
                console.log(err)
                return false
            }
            console.log("Message added succesfully!!")
            console.log(res)
        })
        return true
    }
    numMessages++
    globRoom.update({},{$push: {"messages":{"userName": un , "data": msg}}},(err,result) => {
        if (err){
            console.log("Error inserting message")
            return false
        }
        console.log("Message inserted succesfully!!")
        console.log(result)
    });
    // temp = globRoom.messages.push(obj)
    // globRoom.save(temp)
}

//Returns true on successful update and false if the update is unsuccesful
exports.updateUserCount  = (data) => {
    globRoom.findOneAndUpdate(
        {},
        {userIdCount: data},
        {new:true},
        (err, count) => {
            if (err){
                return false;
            }
            return true;
    })
}

exports.incrementMsgCount = () => {
    this.updateMsgCount(numMessages+1)
}

exports.updateMsgCount  = (data) => {
    globRoom.findOneAndUpdate(
        {},
        {msgCount: data},
        {new:true},
        (err, count) => {
            if (err){
                return false;
            }
            return true;
    })
}

exports.clearAllMsgs = () => {
    globRoom.update({},{messages: []}, (err , result) => {
        if (err){
            console.log(err)
            return false
        }
        return result;
    })
}