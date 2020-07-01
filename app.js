const url = require("url");
const querystring = require("querystring");
const blogRouter = require("./src/router/blog");
const userRouter = require("./src/router/user");

// 项目的服务器函数
const serverHandle = (req, res) => {
  req.query = querystring.parse(url.parse(req.url).query);
  req.pathname = url.parse(req.url).pathname;

  res.setHeader("Content-type", "application/json");

  // 解析cookie
  req.cookies = {};
  const cookiesStr = req.headers.cookie || "";
  cookiesStr.split(";").forEach((cookie) => {
    if (!cookie) {
      return;
    }
    let key = cookie.split("=")[0];
    let value = cookie.split("=")[1];
    req.cookies[key] = value;
  });

  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理博客
    const blogResult = blogRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理用户
    const userResult = userRouter(req, res);
    if (userResult) {
      userResult.then((userData) => {
        res.end(JSON.stringify(userData));
      });
      return;
    }

    res.writeHeader(404, { "Content-type": "text/plain" });
    res.write("404 Not Fount");
    res.end();
  });
};

// 获取POST请求中的参数
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    // if (req.headers['Conetent-Type'] !== "application/json") {
    //   resolve({});
    //   return;
    // }
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(postData);
    });
  });
  return promise;
};

module.exports = serverHandle;
