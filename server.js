const http = require('http');
const { v4: uuidv4 } = require('uuid');
const todos = [{
    title: '我是貓咪',
    id: uuidv4(),
  },
  {
    title: '我是狗',
    id: uuidv4(),
  },
];


const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  }

  if(req.url === '/todos' && req.method === 'GET'){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos,
    }));
    res.end();
  } else if(req.method === 'OPTIONS'){  // 預檢請求
    res.writeHead(200, headers);
    res.end();
  } else {
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