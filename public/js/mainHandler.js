const userName = prompt("Please enter a NickName : ")
$('#userId').text(userName)
var socket = io()

//  Do Initial config here
getChatHistory();
let currentGrpId;

//#region --------------------------------------- Socket Incoming events ------------------------------------------------------ //

socket.on('getUsers', d => {
    console.log("Number of users : ", d)
    document.getElementById("numUsers").innerHTML = `${d} user(s) connected`
})

socket.on('serverMsg', message => receiveMessage(message["message"], message["username"]))

socket.on('grpCreated', grpId => {
    currentGrpId = grpId;
    showAddGroupResult(grpId);
})
    
socket.on('joinGrpResult', res => {
    if (res.success) {
        clearDisplayMessages();
        getChatHistory(res.grpId);
        currentGrpId = res.grpId;
    } else {
        alert("Please enter a valid group Id");
    }
})

//#endregion --------------------------------------- Socket Incoming events ------------------------------------------------------ //


//#region ------------------------------------------ Socket outgoing events ------------------------------------------------------ //

function emitAddMsg(message, userName) {
    console.log(currentGrpId);
    if (currentGrpId === null || currentGrpId === undefined || currentGrpId === '') {
        alert('Please join a channel to start chatting:)');
        return false;
    }
    let data = {
        "grpId": currentGrpId,
        "message": message,
        "username": userName
    }
    socket.emit("clientMsg", data)
    return true;
}

function emitAddGroup(grpName) {
    socket.emit("addGrp", grpName);
}

function emitJoinGroup(grpId) {
    socket.emit('joinGrp', grpId);
}


//#endregion --------------------------------------- Socket outgoing events ------------------------------------------------------ //


//#region -------------------------------------------- Group----------------------------------------------//
function addGroup() {
    let grpName = prompt("Enter a group name : ");
    if (grpName === null || grpName === '') {
        return;
    }
    emitAddGroup(grpName);
    clearDisplayMessages();
}

function addGroupInList(groupName) {
    var grpList = document.getElementById("groupList")
    grpList.innerHTML += "<li class='contact'>"
    grpList.innerHTML += "<div class='wrap'>"
    grpList.innerHTML += "<span class='contact-status online'></span>"
    // grpList.innerHTML+="<img src='http://emilcarlsson.se/assets/rachelzane.png' alt='' />"
    grpList.innerHTML += "<div class='meta'>"
    grpList.innerHTML += `<p class='name'>${groupName}</p>`
    grpList.innerHTML += "<p class='preview'>Mike, I know everything! I'm Donna..</p>"
    grpList.innerHTML += "</div></div></li>"
}

function joinGroup() {
    let grpId = prompt("Enter a group Id: ");
    if (grpId === null || grpId === '') {
        return;
    }
    emitJoinGroup(grpId);
}

//#endregion ---------------------------------------------- Group-------------------------------------------------//


//#region ------------------------------------------ Helper functions ------------------------------------------------------------//
function sendMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }

    if (!emitAddMsg(message, userName)) {
        return;
    }

    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
};


function receiveMessage(msg, un) {
    if ($.trim(msg) === '') {
        return false;
    }
    // $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('<li class="replies"><p style="background-color:orange" id="msgUserName">' + un + '</p><p>' + msg + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html(`<span>${un} </span> ${msg}`);
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
};

function getChatHistory(grpId = '') {
    let url = '/getChatHist/' + grpId

    fetch(url)
        .then(response => response.json())
        .then(response => response['0'])
        .then(response => {
            if (!response) {
                return;
            }
            for (var i in response.messages) {
                receiveMessage(response.messages[i].data, response.messages[i].userName)
            }
            $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
        })
}

function showAddGroupResult(grpId) {
    let str = `Group Id : ${grpId} <br>
    Now you can invite friends with this Id! <br>
    Please make sure you store this Id:)`;

    $("#modalTitle").html("Add Group");
    $('#modalBody').html(str);
    $('.modal').modal('show');
}

function clearDisplayMessages() {
    $('.messages ul').empty();
}

//#endregion --------------------------------------- Helper functions ------------------------------------------------------------//