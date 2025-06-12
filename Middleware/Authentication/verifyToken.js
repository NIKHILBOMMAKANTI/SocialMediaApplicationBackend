const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../../Model/UserSchema.js')
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    console.log(req.cookies);
    console.log(token);
    if(!token){
        return res.status(401).json({
            message: "Access Denied: The Session Expired, Please Login"
        })
    }
    const secretkey = process.env.JWT_SECRET_KEY;
    const user_data = jwt.verify(token, secretkey);
    const { id } = user_data;
    const userdetails = await User.findById(id);
    if(userdetails.length == 0){
        return res.status(500).json({
        message: "User Data not Found",
      });
    }
    const role = userdetails.role
    if((userdetails && role === 'User') || (userdetails && role === 'Admin')){
        req.user_data = userdetails
        next();
    }else{
        return res.status(403).json({
            message:'Access Denied: Insufficient Permissions'
        })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = verifyToken;
