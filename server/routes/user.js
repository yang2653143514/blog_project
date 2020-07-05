const router = require("koa-router")();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
router.prefix("/api/user");

router.post("/login", async (ctx, next) => {
  //request.body 因为app.js已经注册bodyparser json两个中间件了
  const { username, password } = ctx.request.body;

  //查询sql
  const data = await login(username, password);
  console.log(data);
  if (data.username) {
    //设置SEESION express-session自动同步到redis
    ctx.session.username = data.username;
    ctx.session.realname = data.realName;

    ctx.body = new SuccessModel();
    return;
  }
  ctx.body = new ErrorModel("登陆失败");
});

router.get("/session-test", async (ctx, next) => {
  console.log("ctx------------\n", ctx);
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0;
  }
  ctx.session.viewCount++;
  ctx.body = {
    resultCode: 0,
    viewCount: ctx.session.viewCount,
  };
});

module.exports = router;
