const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    bio:{type:String,required:false},
    gender:{type:String,required:false},
    interests:{type:String,required:false},
    location:{type:String,required:false},
    role:{type:String,required:true,default:'User'},


})
module.exports = mongoose.model('User', UserSchema)