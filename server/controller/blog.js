const { exec } = require("../db/mysql");

//可通过作者 或者 关键词查询
const getList = async (author, keyword) => {
  let sql = `select * from blog where 1=1`;
  if (author) {
    sql += ` and author = '${author}'`;
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%' `;
  }
  sql += ` order by createtime desc;`;
  console.log("-------sql: ", sql);
  return await exec(sql);
};

const getDetail = async (id) => {
  const sql = `select * from blog where id = '${id}'`;
  //查询出一条也是一个数组 要 取数组的第一个
  const rows = await exec(sql);
  return rows[0];
};

const newBlog = async (blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createtime = Date.now();

  const sql = `
        insert into blog (title,content,createtime,author) 
        values ('${title}','${content}',${createtime},'${author}')
        `;
  const insertData = await exec(sql);
  return {
    //新建成功 返回一个对象 这个对象里有insertId
    id: insertData.insertId,
  };
};

const updateBlog = async (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;

  const sql = `
        update blog set title = '${title}', content='${content}' 
         where id = ${id}`;
  const updateData = exec(sql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
};

const delBlog = async (id, author) => {
  const sql = `delete from blog where id = '${id}' and author='${author}'`;

  const deleteData = await exec(sql);
  if (deleteData.affectedRows > 0) {
    return true;
  }
  return false;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
