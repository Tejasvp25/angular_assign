const io = require("../config/headers").io;
const groupRoomController = require("./GroupRoomController");
const ResAPI = require("../Parameters/ResAPI");
const APIReturnEnum = require("../models/Enums/APIReturnEnum");

exports.new_socket_conn = io.on("connection", (socket) => {
  socket.on("clientMsg", (data) => {
    let curGrpId = socket.roomId;
    emitNewMessage(curGrpId, data);
    groupRoomController.createNewMessage(
      data.grpId,
      data.message,
      data.username
    );
  });

  socket.on("addGrp", async (grpName) => {
    let resApi = new ResAPI();
    let newGroupId;
    await groupRoomController.createNewGroup(grpName).then((res) => {
      resApi = res;
      if (res.retCode === APIReturnEnum.Successful) {
        newGroupId = res.object;
      }
    });
    emitAddGroupResult(resApi, newGroupId);
    if (res.retCode === APIReturnEnum.ErrorOccured) {
      return;
    }

    socket.leaveAll();
    socket.join(newGroupId);
    socket.roomId = newGroupId;
  });

  socket.on("joinGrp", async (newGrpId) => {
    let resApi = new ResAPI();
    let isValidGroup;
    await groupRoomController.isGroupExists(newGrpId).then((res) => {
      isValidGroup = res.object;
      resApi = res;
    });

    if (!isValidGroup || isValidGroup === null || isValidGroup === undefined) {
      custConsoleLog("Not a valid group");
      emitJoinGroupResult(resApi, false, newGrpId);
      return;
    }

    socket.leaveAll();
    socket.join(newGrpId);
    socket.roomId = newGrpId;

    count = await increaseUserCount(newGrpId);
    emitUserCountUpdate(newGrpId, count);

    emitJoinGroupResult(resApi, true, newGrpId);
  });

  socket.on("disconnectFromRoom", () => {
    socket.disconnect();
  });

  socket.on("disconnect", async () => {
    let curGrpId = socket.roomId;

    if (curGrpId === undefined || curGrpId === null) {
      return;
    }

    const count = await decreaseUserCount(curGrpId);
    emitUserCountUpdate(curGrpId, count);
  });

  function emitAddGroupResult(resApi, newGroupId) {
    resApi.object = newGroupId;
    socket.emit("grpCreated", resApi);
  }

  function emitJoinGroupResult(resApi, isValidGroup, newGroupId) {
    resApi.object = {
      isValidGroup: isValidGroup,
      groupId: newGroupId,
    };
    socket.emit("joinGrpResult", resApi);
  }

  function emitUserCountUpdate(grpId, count) {
    io.sockets.to(grpId).emit("getUsers", count);
  }

  function emitNewMessage(grpId, data) {
    socket.broadcast.to(grpId).emit("serverMsg", data);
  }
});

async function increaseUserCount(grpId) {
  return await updateUserCount(grpId, 1);
}

async function decreaseUserCount(grpId) {
  return await updateUserCount(grpId, -1);
}

async function updateUserCount(grpId, adjValue) {
  let curUsers = await groupRoomController
    .getNumUsersInGroup(grpId)
    .catch((err) => {
      custConsoleLog("Error fetching the number of users");
      return 0;
    });
  custConsoleLog("Num Users: " + curUsers);

  curUsers += adjValue;
  groupRoomController.updateUserCount(grpId, curUsers);
  return curUsers;
}
