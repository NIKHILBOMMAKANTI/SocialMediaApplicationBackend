const Express = require('express')
const Route = Express.Router();
const verifyToken = require('../Middleware/Authentication/verifyToken.js');
const {addcomment,addreply,getCommentsAndRepliesByPostId,getRepliesByCommentId} = require('../Controllers/CommentManagement.js');
const {addcommentvalidator,addreplyvalidator} = require('../validators/CommentManagementValidator.js')


Route.post("/addcomment/:id",verifyToken,addcommentvalidator,addcomment);
Route.post("/addreply/:id",verifyToken,addreplyvalidator,addreply);
Route.get("/getCommentsAndRepliesByPostId/:id",verifyToken,getCommentsAndRepliesByPostId)
Route.get("/getRepliesByCommentId/:id",verifyToken,getRepliesByCommentId)

module.exports = Route