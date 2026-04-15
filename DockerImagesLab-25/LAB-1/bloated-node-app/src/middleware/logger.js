const {v4:uuidv4 }= require('uuid');

const logRequest = (req,res,next)=> {
  req.requestId= uuidv4();
  const start = Date.now();
  res.on('finish', ()=> {
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration:`${Date.now()- start}ms`,
    }));
  });
  next();
};

module.exports = { logRequest };