const userName = prompt("Please enter a NickName : ")
$('#userId').text(userName)
var socket = io()


//  Set the initial settings here
try {
    var url = new URL(window.location.href)
    var grpName = url.searchParams.get('grp');
    // console.log(grpName)
    if (grpName == null) {
        throw error();
    }

    emitChangeGroup(grpName)
    
    // socket = io(`/${grpName}`)
} catch (error) { }

fetch('/getChatHist')
    .then(response => response.json())
    .then(response => response['0'])
    .then(response => {
        if (!response){
            return;
        }
        for (var i in response.messages) {
            receiveMessage(response.messages[i].data, response.messages[i].userName)
        }
        $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
    })


function sendMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }

    emitAddMsg(message, userName)

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


//#region -------------------------------------------- Group----------------------------------------------//
function addGroup() {
    let grpName = prompt("Enter a group name : ")
    emitAddGroup(grpName);
    // window.location = "/"
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

function joinGroup(){
    let grpName = prompt("Enter a group name: ");
    socket.emit('joinGrp', grpName);
    $('.messages ul').empty();
    // window.location = "?grp="+"grpA"
}


//  setInterval(addGroupInList("GlobalChat"),5000)

//#endregion ---------------------------------------------- Group-------------------------------------------------//

//#region --------------------------------------- Socket Incoming events ------------------------------------------------------ //

socket.on('getUsers', d => {
    console.log("Number of users : ", d)
    document.getElementById("numUsers").innerHTML = `${d} user(s) connected`
})

socket.on('serverMsg', message => receiveMessage(message["message"], message["username"]))

//#endregion --------------------------------------- Socket Incoming events ------------------------------------------------------ //

//#region ------------------------------------------ Socket outgoing events ------------------------------------------------------ //

function emitAddMsg(message, userName) {
    let data = {
        "message": message,
        "username": userName
    }
    socket.emit("clientMsg", data)
}

function emitChangeGroup(grpName) {
    socket.emit('changeGrp', grpName)
}

function emitAddGroup(grpName) {
    socket.emit("addGrp", grpName)
}

//#endregion --------------------------------------- Socket outgoing events ------------------------------------------------------ //
