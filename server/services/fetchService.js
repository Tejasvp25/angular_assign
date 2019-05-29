var axios = require('axios');
var localConfig = require('../config/headers').localConfig;
const baseUrl= localConfig.baseUrl;


exports.fetchNumMsgs = async () => {
    try {
        let res = await axios.get(`${baseUrl}/getNumMsgs`);
        let resp = res.data;
        return resp.msgCount;
    } catch (error) {
        console.log("Error : ", error);
        return 0;
    }
}