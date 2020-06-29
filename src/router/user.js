const userRouter = (req, res) => {
  const method = req.method;
  const pathname = req.pathname;

  if (method === 'POST' && pathname === '/api/user/login') {
    return {
      msg : "登录"
    }
  }
}

module.exports = userRouter;