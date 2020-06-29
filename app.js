const url = require("url");
const querystring = require("querystring");
const blogRouter = require("./src/router/blog");
const userRouter = require("./src/router/user");

const serverHandle = (req, res) => {
  req.query = querystring.parse(url.parse(req.url).query);
  req.pathname = url.parse(req.url).pathname;

  res.setHeader("Content-type", "application/json");

  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理博客
    const blogData = blogRouter(req, res);
    if (blogData) {
      res.end(JSON.stringify(blogData));
      return;
    }

    // 处理用户
    const userData = userRouter(req, res);
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }

    res.writeHeader(404, { "Content-type": "text/plain" });
    res.write("404 Not Fount");
    res.end();
  });
};

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
