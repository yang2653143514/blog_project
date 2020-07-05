const env = process.env.NODE_ENV; //在PACKJSON中有定义
//配置
let MYSQL_CONF;
let REDIS_CONF;

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "blog_project",
  };

  //redis
  REDIS_CONF = {
    port: 6379,
    host: "127.0.0.1",
  };
}
//线上配置真实的
if (env === "production") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "blog_project",
  };

  //redis
  REDIS_CONF = {
    port: 6379,
    host: "127.0.0.1",
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
