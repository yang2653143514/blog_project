var express = require("express");
var router = express.Router();
const {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");

const { SuccessModel, ErrorModel } = require("../models/resultModels");
const loginCheck = require("../middleware/loginCheck");

router.get("/search", (req, res, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isadmin) {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }
    //强制查询自己的博客
    author = req.session.username;
  }
  const result = getList(author, keyword);
  return result.then((data) => {
    res.json(new SuccessModel(data, "查询博客列表成功"));
  });
});

router.get("/detail", (req, res, next) => {
  const result = getDetail(req.query.id);
  return result.then((data) => {
    res.json(new SuccessModel(data,  "查看博客详情成功"));
  });
});

router.post("/create", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = createBlog(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data, "创建博客成功"));
  });
});

router.post("/update", loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel("更新博客成功"));
    } else {
      res.json(new ErrorModel("更新失败"));
    }
  });
});

router.post("/delete", loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = deleteBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel("删除博客成功"));
    } else {
      res.json(new ErrorModel("删除失败"));
    }
  });
});
module.exports = router;
