const { exec, escape } = require("../db/mysql");


/**
 * 获取博客列表
 * @param {作者} author 
 * @param {查询的关键字（模糊查询）} keyword 
 */
const getList = (author, keyword) => {
  author = escape(author);
  keyword = escape(keyword);
  let sql = `select * from blog where 1=1 `;
  if (author) {
    sql += `and author = ${author} `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  return exec((sql += "order by createTime desc;"));
};

/**
 * 获取某个博客的详情
 * @param {博客文章的id} id 
 */
const getDetail = (id) => {
  id = escape(id);
  const sql = `select * from blog where id=${id} `;
  return exec(sql).then((result) => {
    return result[0];
  });
};

/**
 * 创建博客
 * @param {postDate对象，包含了博客标题、博客内容、作者} blogData 
 */
const createBlog = (blogData = {}, author) => {
  const { title, content } = blogData;
  if (!title) return Promise.reject("博客标题必填!");
  if (!content) return Promise.reject("博客内容必填!");
  title = escape(title);
  content = escape(content);
  author = escape(author);
  const sql = `
    insert into blog (title, content, author, createTime) 
    values ('${title}', '${content}', '${author}', ${Date.now()})
  `;
  return exec(sql).then((result) => {
    return {
      id: result.insertId,
    };
  });
};

/**
 * 删除博客
 * @param {要删除博客的id} id 
 * @param {要删除博客的作者} author 
 */
const deleteBlog = (id, author) => {
  if (!id) return Promise.reject("没有要删除的id!");
  id = escape(id);
  author = escape(author);
  const sql = `delete from blog where id=${id} and author='${author}' `;
  return exec(sql).then((result) => {
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

/**
 * 
 * @param {要更新博客的id} id 
 * @param {postDate对象，包含了博客标题、博客内容} blogData 
 */
const updateBlog = (id, blogData = {}) => {
  const { title, content } = blogData;
  id = escape(id);
  author = escape(author);
  content = escape(content);
  const sql = `update blog set title='${title}', content='${content}' where id=${id} `;
  return exec(sql).then((result) => {
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  getList,
  createBlog,
  deleteBlog,
  updateBlog,
  getDetail,
};
