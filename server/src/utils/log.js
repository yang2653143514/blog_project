const path = require('path');
const fs = require('fs');

const writeLog = (writeStream, log) => {
  writeStream.write(log + '\n');
}

const writeLogStream = (fileName) => {
  const filepath = path.resolve(__dirname, '../../logs', fileName);
  const writeStream = fs.createWriteStream(filepath, {
    flag: 'a'
  })
  return writeStream;
}
const accessWriteStream = writeLogStream('access.log');
const errorWriteStream = writeLogStream('error.log');

function accessLog(log){
  writeLog(accessWriteStream, log);
}

function errorLog(log){
  writeLog(errorWriteStream, log);
}

module.exports = { accessLog, errorLog };