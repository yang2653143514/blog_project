const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
//koa-logger 的意思是让控制台打印出的LOG更加好看
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");
const blog = require("./routes/blog");
const user = require("./routes/user");
//处理session 链接 redis
const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const { REDIS_CONF } = require("./conf/db");

const path = require("path");
const fs = require("fs");
const morgan = require("koa-morgan");

// error handler
onerror(app);

//相当于 blog_node里app.js的getPostData 处理POST的数据
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next(); //next()返回一个promise
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//记录 log
const ENV = process.env.NODE_ENV;
if (ENV !== "production") {
  app.use(morgan("dev"));
}

else {
  const fullFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: "a", //追加
  });
  app.use(
    morgan("combined", {
      stream: writeStream,
    })
  );
}

//处理session 连接redis
app.keys = ["yang_123456"];
app.use(
  session({
    cookie: {
      path: "/", //默认配置
      httpOnly: true, // //默认配置 只有服务端能修改cookie
      maxAge: 24 * 60 * 60 * 1000, //过期时间24小时
    },
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
    }),
  })
);

//allowedMethods设置响应头，和允许对应的方法GET POST PUT DELETE
//如果请求的方法不对会返回失败
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
