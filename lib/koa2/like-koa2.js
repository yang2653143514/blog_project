const http = require("http");

// 组合中间件
function compose(middlewareList) {
  return function (ctx) {
    function dispatch(i) {
      const fn = middlewareList[i];
      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1)) // promise
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}

// compose源码
function compose(middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = [];
  }
  //app.use把所有中间件收集起来
  use(fn) {
    this.middlewareList.push(fn);
    return this;
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  callback() {
    const fn = compose(this.middlewareList);

    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
  }

  createContext(req, res) {
    const ctx = {
      req,
      res,
    };
    ctx.query = req.query;
    return ctx;
  }

  handleRequest(ctx, fn) {
    return fn(ctx);
  }
}

module.exports = LikeKoa2;
