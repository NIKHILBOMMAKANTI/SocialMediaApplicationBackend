const Express = require('express');
const app = Express();
const Route = Express.Router();
const {Register, Login} = require('../Controllers/UserAuthentication.js')
const PasswordHash = require('../Middleware/Authentication/PasswordHash.js')


//Routes
Route.post("/Register",PasswordHash,Register);
Route.post("/login",Login)



module.exports = Route