const Friend = require('../Model/FriendRequestSchama.js');

const SendFriendRequest = async(req,res)=>{
    try{
    const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    
        reciverId = req.params.id;
        if(!reciverId){
            return res.status(400).json({
                success:false,
                message:"Reciver Id Required"
            })
        }
        // const {_id} = req.user_data;
        const senderId = _id.toString();
        if(!senderId){
            return res.status(401).json({
                success:false,
                message:"Please login to perform this action."
            })
        }

        const FriendRequestData = await Friend.find({$and:[{senderid:senderId},{reciverid:reciverId}]});
        if(FriendRequestData.length>0){
            return res.status(200).json({
                success:true,
                message:"Friend Request Already Sent"
            })
        }
        const Request = await new Friend({
                senderid:senderId,
                reciverid:reciverId
        })
        
        await Request.save();
        console.log("From Request",Request);
        const Requestdata = await Friend.findById(Request._id).populate([{path:'senderid'},{path:'reciverid'}]);
        if(!Requestdata){
            return res.status(500).json({
                success:false,
                message:"Failed to send the Request"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Friend Request Sent Successfully",
            data:Requestdata
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const AcceptFriendRequest = async(req,res)=>{
    try{
                const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const reciverId = req.params.id;
    if(!reciverId){
            return res.status(400).json({
                success:false,
                message:"Reciver Id Required"
            })
        }
    // const {_id} = req.user_data
    const senderId = _id.toString();
     if(!senderId){
            return res.status(401).json({
                success:false,
                message:"Please login to perform this action."
            })
        }
    const Requestdata = await Friend.findOneAndUpdate({senderid:senderId,reciverid:reciverId},{$set:{status:'Accepted'}},{new:true}).populate([{path:'senderid'},{path:'reciverid'}]);
    if(!Requestdata){
        return res.status(404).json({
            success:false,
            message:"Friend request not found or already processed."
        })
    }
    return res.status(200).json({
        success:true,
        message:"Friend Request Accepted Successfully",
        data:Requestdata
    })


    }catch(error){
        return res.status(500).json({
        success:false,
        message:error.message
    })
    }
  
}

const RejectFriendRequest = async (req,res)=>{
  try{
        const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
      const reciverId = req.params.id;
    if(!reciverId){
            return res.status(400).json({
                success:false,
                message:"Reciver Id Required"
            })
        }
    // const {_id} = req.user_data
    const senderId = _id.toString();
     if(!senderId){
            return res.status(401).json({
                success:false,
                message:"Please login to perform this action."
            })
        }
    const Requestdata = await Friend.findOneAndUpdate({senderid:senderId,reciverid:reciverId},{$set:{status:'Rejected'}},{new:true}).populate([{path:'senderid'},{path:'reciverid'}]);
     if(!Requestdata){
        return res.status(404).json({
            success:false,
            message:"Friend request not found or already processed."
        })
    }
    return res.status(200).json({
        success:true,
        message:"Friend Request Rejected Successfully",
        data:Requestdata
    })
    

  }catch(error){
    return res.status(500).json({
        success:false,
        message:error.message
    })
  }
}

const getCurrentUserFriends = async (req,res)=>{
    try{
            const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
        // const {_id} = req.user_data;
        const userId = _id.toString();
        console.log(userId);
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Please login to perform this action."

            })
        }
        const Requestdata = await Friend.find({$or:[{senderid:userId,status: 'Accepted'},{reciverid:userId,status: 'Accepted'}]}).populate([{path:'senderid'},{path:'reciverid'}]);
         if(!Requestdata){
        return res.status(404).json({
            success:false,
            message:"Friend request not found or already processed."
        })
    }
    return res.status(200).json({
        success:true,
        data:Requestdata
    })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const unfriendUser = async(req,res)=>{
    try{
    const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                message:"ID is Required",
            })
        }
        // const deletedRequest = await Friend.findOneAndDelete({_id:id,status:'Accepted'})
        const deletedRequest = await Friend.findOneAndDelete({status:'Accepted',$or:[{senderid:id,reciverid:_id},{senderid:_id,reciverid:id}]})
        if(!deletedRequest){
            return res.status(404).json({
                success:false,
                message:"No active Friend Request found between the users."
            })
        }
        return res.status(200).json({
            success:true,
            message:"UnFriend Successfull",
            data:deletedRequest
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports = {SendFriendRequest,AcceptFriendRequest,RejectFriendRequest,getCurrentUserFriends,unfriendUser}