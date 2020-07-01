const { SuccessModel, ErrorModel } = require("../models/resultModels");
const { login } = require("../controller/user");
const querystring = require("querystring");

const getExpired = () => {
  const date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  return date;
};

// 处理用户的路由
const userRouter = (req, res) => {
  const method = req.method;
  const pathname = req.pathname;

  if (method === "GET" && pathname === "/api/user/login") {
    return login(req.query).then((userData) => {
      if (userData.username) {
        res.setHeader(
          "Set-Cookie",
          `username=${
            userData.username
          };path='/';httpOnly;expired=${getExpired()}`
        );
        return new SuccessModel(userData, "登录成功");
      } else {
        return new ErrorModel("登录失败");
      }
    });
  }

  if (method === "GET" && pathname === "/api/user/login-test") {
    // const cookie = querystring.parse(req.headers.cookie) || {};
    if (req.cookies.username) {
      return Promise.resolve("已经登录" + req.cookies.username);
    } else {
      return Promise.resolve("尚未登录");
    }
  }
};

module.exports = userRouter;
