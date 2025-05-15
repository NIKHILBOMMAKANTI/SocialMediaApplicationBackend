const Express = require('express');
const verifyToken = require('../Middleware/Authentication/verifyToken');
const Route = Express.Router();
const {SendFriendRequest,AcceptFriendRequest,RejectFriendRequest,getCurrentUserFriends,unfriendUser} = require('../Controllers/FriendSystem.js')


//Routes
Route.post("/request/:id",verifyToken,SendFriendRequest);
Route.post("/accept/:id",verifyToken,AcceptFriendRequest);
Route.post("/reject/:id",verifyToken,RejectFriendRequest);
Route.get("/currentUserFriends",verifyToken,getCurrentUserFriends);
Route.delete("/unfriend/:id",verifyToken,unfriendUser)

module.exports = Route;