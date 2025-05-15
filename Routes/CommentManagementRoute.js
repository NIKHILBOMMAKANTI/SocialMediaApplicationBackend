const Express = require('express')
const Route = Express.Router();
const verifyToken = require('../Middleware/Authentication/verifyToken.js');
const {addcomment,addreply,getCommentsAndRepliesByPostId} = require('../Controllers/CommentManagement.js')


Route.post("/addcomment/:id",verifyToken,addcomment);
Route.post("/addreply/:id",verifyToken,addreply);
Route.get("/getCommentsAndRepliesByPostId/:id",verifyToken,getCommentsAndRepliesByPostId)


module.exports = Route