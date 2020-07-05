const mysql = require("mysql");

const { MYSQL_CONF } = require("../conf/db");

//创建连接对象
const con = mysql.createConnection(MYSQL_CONF);

//开始连接
con.connect();

//统一执行SQL的函数

function exec(sql) {
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
}

//保持 不执行con.end() 类似单列模式 创建了实例就保存不关闭

module.exports = {
  exec,
  //安全验证
  escape: mysql.escape,
};
