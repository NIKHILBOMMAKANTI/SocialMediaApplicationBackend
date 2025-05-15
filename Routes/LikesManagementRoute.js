const Express = require('express');
const Route = Express.Router();
const {addLikeToPost,unLikePost,getLikeCountForPost} = require('../Controllers/LikesManagement.js');
const verifyToken = require('../Middleware/Authentication/verifyToken.js');

//Routes
Route.post("/addLikeToPost/:id",verifyToken,addLikeToPost);
Route.delete("/unLikePost/:id",verifyToken,unLikePost);
Route.get("/getLikeCountForPost/:id",verifyToken,getLikeCountForPost);

module.exports = Route