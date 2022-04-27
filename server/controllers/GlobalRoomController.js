const globalRoomRepo = require("../Repo/GlobalRoomRepo");

exports.createNewMessage = async (msg, un) => {
  globalRoomRepo.createNewMessage(msg, un);
};

exports.getChatHist = async (req, res) => {
  await globalRoomRepo.loadChatHist().then((repoResult) => {
    res.json(repoResult);
  });
};

exports.getNumMsgs = async (req, res) => {
  await globalRoomRepo
    .loadNumMsgs()
    .then((repoResult) => repoResult[0])
    .then((repoResult) => res.json(repoResult));
};

exports.updateUserCount = async (data) => {
  return globalRoomRepo.updateUserCount(data);
};

exports.clearAllMsgs = () => {
  globRoom.update({}, { messages: [] }, (err, result) => {
    if (err) {
      console.log(err);
      return false;
    }
    return result;
  });
};
