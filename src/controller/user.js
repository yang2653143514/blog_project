const { exec } = require("../db/exec");

// 登录的数据操作
/**
 * 登录用户
 * @param {暂未完成} query 
 */
const login = (query) => {
  const { username, password } = query;
  const sql = `select username, realname from user where username='${username}' and password='${password}'`;
  return exec(sql).then((data) => {
    return data[0] || {};
  });
};

module.exports = {
  login,
};
