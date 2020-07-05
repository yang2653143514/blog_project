/**
 * 这里是简单模拟express中间件的代码
 * 
 * 简单总结：
 * 1. 一个中间件（use、get、post）被执行到后，处理参数（register），放入到对应的栈中
 * 2. 创建服务中的函数（callback）执行，获取栈
 * 3. 从栈中获取匹配的函数（match）,放入结果栈中（栈中可能包含中间件：路由，则回到1）
 * 4. 递归 执行(handle)结果栈中的函数，如果其中某个函数不继续递归（或执行完），则结束
 * 
 *  ！！！这个顺序也引发了我的一个思考，发现了跟着教程写的代码的一个问题：因为一个路由是先经过router.use再到router.get的，
 * 所以router.get加入栈的时间节点是3，但是如果设置了捕捉404的router.use，那这个
 * 中间件函数反而会先入栈，从而比router.get更先执行，然后因为404不会执行next（），
 * 所以router.get永远不会被执行。
 *  实际操作原生的express也是这样。所以会有专门接受四个参数的错误处理中间件吧。
 */

const http = require("http");
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], //app.use 中间件
      get: [], //app.get 中间件
      post: [], //app.post 中间件
    };
  }

  // 每接收一个中间件之后都会经过这里，用于接收参数并规范为对象后返回
  register(path) {
    const info = {};
    if (typeof path === "string") {
      info.path = path;
      // 获取函数参数（可能多个）
      info.stack = slice.call(arguments, 1);
    } else {
      // 第一个参数不是string，设置默认为根目录
      info.path = "/";
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  // 暴露出去的接口，接收参数，处理后放在对应的栈中
  use() {
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }
  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }
  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }

  // 创建http，监听端口
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  // 核心。
  callback() {
    return (req, res) => {
      res.json = (data) => {
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();

      // 收集符合标准的中间件
      const resultList = this.match(method, url);
      // 处理符合标准的中间件，这里实现next（）方法
      this.handle(req, res, resultList);
    };
  }

  match(method, url) {
    let stack = [];
    if (url === "/favicon.ico") {
      return stack;
    }
    // 获取routes,找到所有可用的中间件
    let curRoutes = [];
    curRoutes = curRoutes.concat(this.routes.all);
    curRoutes = curRoutes.concat(this.routes[method]);

    curRoutes.forEach((routeInfo) => {
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
      }
    });

    return stack;
  }

  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个获取的中间件(函数)
      const middleware = stack.shift();
      if (middleware) {
        // 递归执行中间件函数
        middleware(req, res, next);
      }
    };
    // 进入递归
    next();
  }
}

module.exports = () => {
  return new LikeExpress();
};
