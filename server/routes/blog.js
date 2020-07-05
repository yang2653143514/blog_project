const router = require("koa-router")();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");

router.prefix("/api/blog");

router.get("/search", async (ctx, next) => {
  //从URL取值
  let author = ctx.query.author;
  const keyword = ctx.query.keyword || "";

  if (ctx.query.isadmin) {
    // 管理员界面
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModel("未登录");
      return;
    }
    // 强制查询自己的博客
    author = ctx.session.username;
  }
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
});

router.get("/detail", async (ctx, next) => {
  const detail = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(detail);
});

router.post("/create", loginCheck, async (ctx, next) => {
  //user.js里login路由设置了 const {username,password} = ctx.request.body;
  ctx.request.body.author = ctx.session.username;
  const data = await newBlog(req.body);
  ctx.body = new SuccessModel(data);
});

router.post("/update", loginCheck, async (ctx, next) => {
  const val = await updateBlog(ctx.query.id, ctx.request.body);

  if (val) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel("更新博客失败");
  }
});

router.post("/delete", loginCheck, async (ctx, next) => {
  const author = ctx.session.username;
  const val = await delBlog(ctx.query.id, author);
  if (val) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel("刪除博客失敗");
  }
});

module.exports = router;
