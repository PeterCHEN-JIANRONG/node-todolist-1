const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./method/errorHandle');
const { HEADERS, REQUEST_METHOD } = require('./method/constant');
const todos = [];


const requestListener = (req, res) => {

  let body = "";

  // 監聽data事件
  req.on('data', (chunk)=>{
    body+=chunk;
  });


  if(req.url === '/todos' && req.method === REQUEST_METHOD.GET){
    res.writeHead(200, HEADERS);
    res.write(JSON.stringify({
      status: 'success',
      data: todos,
    }));
    res.end();
  } else if(req.url === '/todos' && req.method === REQUEST_METHOD.POST){

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
          res.writeHead(200, HEADERS);
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
  } else if(req.url === '/todos' && req.method === REQUEST_METHOD.DELETE){
    todos.length = 0; // 清空陣列
    res.writeHead(200, HEADERS);
    res.write(JSON.stringify({
      status: 'success',
      data: todos,
    }));
    res.end();
  } else if(req.url.startsWith('/todos/') && req.method === REQUEST_METHOD.DELETE){
    const id = req.url.split('/').pop(); // 取得 id
    const index = todos.findIndex(item=>item.id === id); // 搜尋陣列引索 index
    if(index !== -1) {
      todos.splice(index, 1); // 刪除一筆
      res.writeHead(200, HEADERS);
      res.write(JSON.stringify({
        status: 'success',
        data: todos,
      }));
      res.end();
    } else {
      errorHandle(res, "查無此id");
    }

  } else if(req.url.startsWith('/todos/') && req.method === REQUEST_METHOD.PATCH){

    req.on('end',()=>{
      try{
        const { title } = JSON.parse(body);
        const id = req.url.split('/todos/').pop();
        const index = todos.findIndex(item=> item.id === id);
        
        if( title !== undefined && index !== -1){
          todos[index].title = title;
          res.writeHead(200, HEADERS);
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
          }));
          res.end();
        } else if( title === undefined) {
          errorHandle(res, 'title 欄位未正確填寫');
        } else if( index === -1 ){
          errorHandle(res, '查無此id');
        } else {
          errorHandle(res);
        };
      } catch(err){
        errorHandle(res, 'JSON 格式錯誤');
      }
    });

  } else if(req.method === REQUEST_METHOD.OPTIONS){  // preflight 預檢請求
    res.writeHead(200, HEADERS);
    res.end();
  } else {
    // 404頁
    res.writeHead(404, HEADERS);
    res.write(JSON.stringify({
      status: 'false',
      message: '無此網站路由',
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);