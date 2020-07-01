// 项目入口
const http = require("http");

const Port = 3001;
const serverhandle = require("../app.js");

const server = http.createServer(serverhandle);

server.listen(Port);
