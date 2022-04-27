var axios = require("axios");

exports.fetchNumMsgs = async () => {
  try {
    let res = await axios.get(`http://localhost:3000/getNumMsgs`);
    let resp = res.data;
    return resp.msgCount;
  } catch (error) {
    console.log("Error : ", error);
    return 0;
  }
};
