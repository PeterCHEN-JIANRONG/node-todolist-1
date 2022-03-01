const { HEADERS } = require('./constant');

function errorHandle(res, message = '程式執行錯誤'){
  res.writeHead(400, HEADERS);
  res.write(JSON.stringify({
    status: 'false',
    message,
  }));
  res.end();
}

module.exports = errorHandle;
