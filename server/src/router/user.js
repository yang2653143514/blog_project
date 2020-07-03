const { SuccessModel, ErrorModel } = require("../models/resultModels");
const { login } = require("../controller/user");
const { setRedis, delRedis } = require("../db/redis")

// 处理用户的路由
const userRouter = (req, res) => {
  const { method, pathname } = req;
  if ((method === "POST" || method === "OPTIONS") && pathname === "/api/user/login") {
    // const { username, password } = req.query;
    const { username, password } = req.body;
    return login(username, password).then((userData) => {
      if (userData.username) {

        req.session.username = userData.username;
        req.session.realname = userData.realname;
        setRedis(req.sessionId, req.session);

        return new SuccessModel(userData, "登录成功");
      } else {
        return new ErrorModel("登录失败");
      }
    });
  }

  if (method === "GET" && pathname === "/api/user/login-test") {
    if (req.session.username) {
      return Promise.resolve("已经登录" + req.session.username);
    } else {
      return Promise.resolve("尚未登录");
    }
  }
};

module.exports = userRouter;
