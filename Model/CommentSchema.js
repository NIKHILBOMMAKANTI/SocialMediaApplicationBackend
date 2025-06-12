const User = require('./UserSchema.js')
const Post = require('./PostSchema.js');

const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    postid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Post"},
    userid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    comment:{type:String,required:true},
    replies:{type:[{
        userid:{type:mongoose.Schema.Types.ObjectId,ref:User},
        reply:{type:String},
        createdAt:{type:Date,default:Date.now()}
    }],required:false},
    createdAt:{type:Date,default:Date.now()}
})
module.exports = mongoose.model('Comments',CommentSchema)