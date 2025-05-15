const mongoose = require('mongoose');
const User = require('./UserSchema.js')
const PostSchema = mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:User},
    content:{type:String,required:true},
    mediaS3key:{type:String,required:true},
    isPrivate:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now()}

})
module.exports = mongoose.model('Post',PostSchema);