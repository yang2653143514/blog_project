const getList = (author, keyword) => {
  return [
    {
      id: 1,
      title: "博客标题11",
      content: "博客内容111",
      createTime: 1593420850887,
      keyword: "关键词11"
    },
    {
      id: 2,
      title: "博客标题2222",
      content: "博客内容222",
      createTime: 1593420892995,
      keyword: "关键词2222"
    },
  ]
}

const createBlog = (blogData = {}) => {
  return blogData;
}

const deleteBlog = (id) => {
  return true;
}

const updateBlog = (id, blogData = {}) => {
  return false;
}

module.exports = {
  getList,
  createBlog,
  deleteBlog,
  updateBlog
}