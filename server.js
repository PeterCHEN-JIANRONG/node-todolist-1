const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./method/errorHandle');
const todos = [];


const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  }

  let body = "";

  // 監聽data事件
  req.on('data', (chunk)=>{
    body+=chunk;
  });


  if(req.url === '/todos' && req.method === 'GET'){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos,
    }));
    res.end();
  } else if(req.url === '/todos' && req.method === 'POST'){

    // 監聽end事件
    req.on('end', ()=>{
      try{
        const { title } = JSON.parse(body);
        if(title !== undefined){
          const todo = {
            title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
          }));
          res.end();
        } else {
          errorHandle(res, "title 欄位未正確填寫");
        }
      }catch(err){
        errorHandle(res, "JSON 格式錯誤");
      };

    });
  } else if(req.url === '/todos' && req.method === 'DELETE'){
    todos.length = 0; // 清空陣列
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      message: "刪除全部成功",
    }));
    res.end();
  } else if(req.method === 'OPTIONS'){  // preflight 預檢請求
    res.writeHead(200, headers);
    res.end();
  } else {
    // 404頁
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: 'false',
      message: '無此路由',
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(8080);