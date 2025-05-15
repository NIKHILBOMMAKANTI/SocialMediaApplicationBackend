const Express = require('express')
const app = Express();
const Route = Express.Router()
const {createpost,getallpost,updatepost, deletepost ,getspecificpost} = require('../Controllers/PostManagement.js')
const verifyToken = require('../Middleware/Authentication/verifyToken.js');
const {upload} = require('../utils/multerConfig.js');

//Routes
Route.post("/create-post/:id",verifyToken,upload.fields([{name:'media',maxCount:1}]),createpost);
Route.get("/getallpost",verifyToken,getallpost);
Route.put("/updatepost/:id",verifyToken,upload.fields([{name:'media',maxCount:1}]),updatepost);
Route.delete("/deletepost/:id",verifyToken,deletepost);
Route.get("/getspecificpost/:id",verifyToken,getspecificpost);

module.exports = Route