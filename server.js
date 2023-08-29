//Importing modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const EventEmitter = require('events');
class Emitter extends EventEmitter{ };
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;
const serveFile = async (filePath,contentType,response)=>{
try{
  const rawData = await fsPromise.readFile(filePath,
    !contentType.includes('image') ? 'utf-8' : '');
  const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;  
  response.writeHead(200,{'Content-Type': contentType});
  response.end(data);
} catch(err){
  console.log(err)
  response.statusCode=500;
  response.end();
}
}

const server = http.createServer((req, res)=>{
  console.log(req.url, req.method)
  const extension = path.extname(req.url);
  let contentType;
  switch(extension){
    case '.css' : contentType = 'text/css';
      break;
    case '.js' : contentType = 'text/javaScript';
      break;  
    case '.json' : contentType = 'application/json';
      break;  
    case '.jpg' : contentType = 'image/jpeg';
      break;  
    case '.png' : contentType = 'image/png';
      break;  
    case '.ico' : contentType = 'image/vnd';
      break;  
    case '.txt' : contentType = 'text/plain';
      break;
    default : contentType = 'text/html';    
  }
  console.log(contentType); 
  let filePath = 
  contentType === 'text/html' && req.url ==='/'
    ? path.join(__dirname, 'index.html')
      : path.join(__dirname,req.url)  
  const fileExists = fs.existsSync(filePath);
  if(fileExists) {
    //serve the file.
    serveFile(filePath,contentType,res);
  }
})
server.listen(PORT, ()=> console.log(`Server running in PORT ${PORT}.`))