const { MYSQL_CONF } = require("../conf/db");
const mysql = require("mysql");

const con = mysql.createConnection(MYSQL_CONF);

con.connect();

/**
 * 封装mysql建立连接和发送请求的函数
 * @param {对mysql的操作} sql 
 */
const exec = (sql) => {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
};

module.exports = {
  exec,
};
