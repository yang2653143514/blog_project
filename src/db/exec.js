const MYSQL_CONF = require('MYSQL_CONF');
const mysql = require('mysql');

const con = mysql.createConnection(MYSQL_CONF);

con.connect();

const exec = (sql) => {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if(err){
        reject(err);
        return;
      }
      resolve(result);
    })
  })
  return promise;
}

module.exports = {
  exec
};