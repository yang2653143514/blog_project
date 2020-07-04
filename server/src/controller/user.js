const { exec, escape } = require("../db/mysql");

/**
 * 登录用户
 * @param {暂未完成} query 
 */
const login = (username, password) => {
  username = escape(username);
  password = escape(password);
  const sql = `select username, realname from user where username=${username} and password=${password}`;
  return exec(sql).then((data) => {
    return data[0] || {};
  });
};

module.exports = {
  login,
};
