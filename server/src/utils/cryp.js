const crypto = require('crypto');

const SECRET_KEY = "yang_123456";

function md5(content){
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

function getPassWord(password){
  const str = `password=${password}&ket=${SECRET_KEY}`;
  return md5(str);
}
module.exports = { getPassWord }