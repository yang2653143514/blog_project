const {
  getList,
  createBlog,
  deleteBlog,
  updateBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../models/resultModels");

const blogRouter = (req, res) => {
  const method = req.method;
  const pathname = req.pathname;
  const id = req.query.id;
  console.log(req.body)

  if (method === "POST" && pathname === "/api/blog/create") {
    const data = createBlog(req.body);
    return new SuccessModel(data, "创建博客列表成功");
  }
  if (method === "POST" && pathname === "/api/blog/delete") {
    const result = deleteBlog(id);
    if (result) {
      return new SuccessModel(data, "删除博客列表成功");
    } else {
      return new ErrorModel("删除博客列表失败");
    }
  }
  if (method === "POST" && pathname === "/api/blog/update") {
    const result = updateBlog(id, req.body);
    if (result) {
      return new SuccessModel(data, "更新博客列表成功");
    } else {
      return new ErrorModel("更新博客列表失败");
    }
  }
  if (method === "GET" && pathname === "/api/blog/search") {
    const blogListData = getList("yangshimin", "niubi");
    return new SuccessModel(blogListData, "查询博客列表成功");
  }
};

module.exports = blogRouter;
