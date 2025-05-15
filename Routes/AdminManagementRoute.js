const Express = require('express');
const Route = Express.Router();
const {deletepost} = require('../Controllers/AdminManagement');
const verifyToken = require('../Middleware/Authentication/verifyToken');

//Routes
Route.delete("/deletepost/:id",verifyToken,deletepost);

module.exports = Route;