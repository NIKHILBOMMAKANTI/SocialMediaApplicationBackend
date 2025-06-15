const Express = require('express');
const app = Express();
const Route = Express.Router();
const {Register, Login, fetchUserDetailsById} = require('../Controllers/UserAuthentication.js');
const PasswordHash = require('../Middleware/Authentication/PasswordHash.js');
const {signupValidation,loginvalidation} = require('../validators/UserAuthenticationValidator.js')
const {upload} = require('../utils/multerConfig.js')
import verifyToken from '../Middleware/Authentication/verifyToken.js';

//Routes
Route.post("/Register",upload.fields([{name:'profilepicture',maxCount:1}]),signupValidation,PasswordHash,Register);
Route.post("/login",loginvalidation,Login)
Route.get("/fetchUserDetailsById/:userid",verifyToken,fetchUserDetailsById)



module.exports = Route