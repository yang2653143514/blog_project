var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// session和redis做登录
const session = require("express-session");
const redisStore = require("connect-redis")(session);

const blogRouter = require("./src/routes/blog.js");
const userRouter = require("./src/routes/user.js");
//初始化一个app实例
var app = express();

const ENV = process.env.NODE_ENV;

// 写日志
if (ENV !== "production") {
  app.use(logger("dev", {}));
} else {
  const logFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(
    logger("combined", {
      stream: writeStream,
    })
  );
}

//视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger("dev", {}));
//处理请求postdata数据,放在req.body中
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//处理cookie,放在req.cookies中
app.use(cookieParser());

const redisClient = require("./src/db/redis.js");
const sessionStore = new redisStore({
  client: redisClient,
});

//处理session
app.use(
  session({
    secret: "yang_123456",
    cookie: {
      // path:'/',//默认配置
      // httpOnly:true,//默认配置
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false, //是否保存未初始化的会话
    resave: false, //是否允许session重新设置
    // 设置了session存储到redis中,不设置存储到内存中
    store: sessionStore,
  })
);

//设置路由
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
