const { SuccessModel, ErrorModel } = require("../models/resultModels.js");

module.exports = (req, res, next) => {
  if (req.session.username) {
    next();
    return;
  }
  res.json(new ErrorModel("未登录"));
};
