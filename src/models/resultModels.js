class BaseModel {
  constructor(data, message) {
    // 如果data为string说明不符合格式，按message返回
    if (typeof data === 'string') {
      this.message = data;
      data = null;
      message = null;
    }
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel{
  constructor(data, message) {
    super(data, message);
    this.resultCode = 0;
  }
}

class ErrorModel extends BaseModel{
  constructor(message) {
    super(message);
    this.resultCode = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}