const User = require('./UserSchema.js');

const mongoose = require('mongoose');
const FriendRequestSchema  = mongoose.Schema({
    senderid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:User},
    reciverid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:User},
    status:{type:'String',enum:['Pending','Accepted','Rejected'],default:'Pending'},
    createdAt:{type:Date,default:Date.now()}
})
module.exports = mongoose.model('FriendRequests',FriendRequestSchema);