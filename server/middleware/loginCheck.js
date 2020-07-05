const { ErrorModel } = require("../model/resModel");

module.exports = async (ctx, next) => {
  //是否登录
  if (ctx.session.username) {
    await next();
    return;
  }
  ctx.body = new ErrorModel("未登录");
};
