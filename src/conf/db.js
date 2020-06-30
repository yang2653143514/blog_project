const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF;
if(env === 'dev'){
  MYSQL_CONF = {
    host:'localhost',
    user:'root',
    password:'we11240507',
    port:'3306',
    database:'blog_project'
  }
}

if(env === 'production'){
  MYSQL_CONF = {
    host:'localhost',
    user:'root',
    password:'we11240507',
    port:'3306',
    database:'blog_project'
  }
}

module.exports.MYSQL_CONF;