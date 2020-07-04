const redis = require("redis");

const redisClient = redis.createClient(6379, "127.0.0.1");
redisClient.on("error", (err) => {
  console.error(err);
});

module.exports = redisClient;
