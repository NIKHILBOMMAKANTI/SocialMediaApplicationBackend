const User = require('./UserSchema.js')

const mongoose = require('mongoose');
const LikesSchema = mongoose.Schema({
    postid:{type:mongoose.Schema.Types.ObjectId,required:true},
    userid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:User},
    createdAt:{type:Date,default:Date.now()}
})



module.exports = mongoose.model('Likes',LikesSchema)