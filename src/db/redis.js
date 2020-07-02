const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');
const redisClient = redis.createClient(REDIS_CONF);

const setRedis = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  redisClient.set(key, value, redis.print);
}

const getRedis = (key) => {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      if (value === null) {
        resolve(null);
        return;
      } 
      // 因为可能需要的value是json，但返回的是字符串，所以转换一下
      try {
        resolve(JSON.parse(value))
      } catch(err) {
        resolve(value)
      }
    })
  })
  return promise;
}

module.exports = {
  setRedis,
  getRedis
}