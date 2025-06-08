const User = require("../Model/UserSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const {validationResult} = require('express-validator');
const {upload} = require('../utils/multerConfig.js');
const {S3} = require('../utils/AwsS3Config.js');
const {GetObjectCommand,PutObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');


const Register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors:errors.array()
      })
    }
    const {fieldname,originalname,mimetype,buffer} = req.files.profilepicture[0];
    const profilepictureS3key = `ProfilePictures/${originalname}-${Date.now()}`;
    await S3.send(new PutObjectCommand({
      Bucket:process.env.AWS_BUCKET_NAME,
      Key:profilepictureS3key,
      Body:buffer,
      ContentType:mimetype
    }))
    const {username,email,password,role,bio,gender,interests,location} = req.body;
    const user_data = await User.find({
      $or: [{ username: username }, { email: email }],
    });
    if (user_data.length != 0) {
      return res.json({
        success:false,
        message: "Username or Email already Exists",
      });
    }
    const newUser = await User({
      username,
      email,
      password,
      profilepictureS3key,
      role,
      bio,
      gender,
      interests,
      location,
    });
    await newUser.save();
    const presignedUrl = await getSignedUrl(S3,new GetObjectCommand({
      Bucket:process.env.AWS_BUCKET_NAME,
      Key:profilepictureS3key
    }),{ expiresIn: 86400 });
    console.log(presignedUrl);
    const registereduserdata = {
      username:newUser.username,
      email:newUser.email,
      role:newUser.role,
      bio:newUser.bio,
      gender:newUser.gender,
      interests:newUser.interests,
      location:newUser.location,
      presignedUrl
    }
    return res.status(200).json({
      success:true,
      message: "Registered successfully",
      data: registereduserdata,
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors:errors.array()
      })
    }
    const { email, password } = req.body;
    const user_data = await User.find({ email: email });
    if (user_data.length > 0) {
      const passwordMatch = await bcrypt.compare(password,user_data[0].password);
      
      if (passwordMatch) {
            const payload = {id:user_data[0]._id};
            const secretkey = process.env.JWT_SECRET_KEY;
            const Token = jwt.sign(payload,secretkey,{expiresIn:'1d'});
            res.cookie('auth_token',Token,{
                // httpOnly:true,
                secure:true,
                sameSite:'Strict',
                maxAge: 86400000,
            }).status(200).json({
                success:true,
                message: "Login Successful!"
            });
      } else {
        return res.status(401).json({
          success:false,
          message: "Invalid Login Credentials",
          details: "Please check your email and password and try again.",
        });
      }
    }else{
        
        return res.status(404).json({ 
          success:false,
          message: "User Not Found" 
        });
    }
   
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message,
    });
  }
};
module.exports = { Register, Login };


