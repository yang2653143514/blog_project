const {
  getList,
  createBlog,
  deleteBlog,
  updateBlog,
  getDetail,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../models/resultModels");

const loginCheck = (req) => {
  if (!req.session.username) {
    return new ErrorModel("尚未denglu")
  }
}

// 处理博客的路由
const blogRouter = (req, res) => {
  const { method, pathname } = req;
  const id = req.query.id;

  if (method === "GET" && pathname === "/api/blog/detail") {
    const result = getDetail(id);
    return result
      .then((data) => {
        return new SuccessModel(data, "查看博客详情成功");
      })
      .catch((error) => {
        return new ErrorModel("查看博客详情失败" + error);
      });
  }

  if (method === "GET" && pathname === "/api/blog/search") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    const result = getList(author, keyword);
    return result
      .then((data) => {
        return new SuccessModel(data, "查询博客列表成功");
      })
      .catch((error) => {
        return new ErrorModel("查询博客列表失败：" + error);
      });
  }

  if (method === "POST" && pathname === "/api/blog/create") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const author = req.session.username;

    const result = createBlog(req.body, author);
    return result
      .then((data) => {
        return new SuccessModel(data, "创建博客成功");
      })
      .catch((error) => {
        return new ErrorModel("创建博客失败：" + error);
      });
  }

  if (method === "POST" && pathname === "/api/blog/delete") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const author = req.session.username;

    const result = deleteBlog(id, author);
    return result.then((data) => {
      if (data) {
        return new SuccessModel("删除博客列表成功");
      } else {
        return new ErrorModel("删除博客列表失败");
      }
    });
  }

  if (method === "POST" && pathname === "/api/blog/update") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const result = updateBlog(id, req.body);
    return result.then((data) => {
      if (data) {
        return new SuccessModel("更新博客列表成功");
      } else {
        return new ErrorModel("更新博客列表失败");
      }
    });
  }
};

module.exports = blogRouter;
