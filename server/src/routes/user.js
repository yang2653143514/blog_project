var express = require("express");
var router = express.Router();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../models/resultModels");

router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);

  return result.then((data) => {
    if (data.username) {
      //设置session,这里设置会自动存储到redis中
      req.session.username = data.username;
      req.session.realname = data.realname;

      reson(new SuccessModel("登录成功"));
      return;
    }
    reson(new ErrorModel("登录失败"));
  });
});

router.get("/login-test", (req, res, next) => {
  if (req.session.username) {
    reson({
      resultCode: 0,
      msg: "已登录",
    });
    return;
  }
  reson({
    resultCode: -1,
    msg: "未登录",
  });
});

module.exports = router;
