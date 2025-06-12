const Comment = require("../Model/CommentSchema.js");
const {validationResult} = require('express-validator')

const addcomment = async (req, res) => {
  try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({
            message:errors.array()
          })
        }
        const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    if (req.user_data) {
      const postid = req.params.id;
      if (!postid) {
        return res.status(400).json({
          success: false,
          message: "Post Id is Required",
        });
      }
      const { _id } = req.user_data;
      userid = _id.toString();
      const { comment } = req.body;
      const newcomment = await new Comment({
        postid,
        userid,
        comment,
      });
      await newcomment.save();
      const commentdata = await newcomment.populate([
        { path: "userid" },
        { path: "postid" },
      ]);
      return res.status(200).json({
        success: true,
        message:"Comment Added Successfully",
        data: commentdata,
      });
    } else {
      return res.status(402).json({
        success: false,
        message: "User not Found,Please login Again or try  Registering",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addreply = async (req, res) => {
  try {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({
            message:errors.array()
          })
        }
        const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const commentid = req.params.id;
    if(!commentid){
        return res.status(400).json({
            success:false,
            message:"Comment Id is required"
        })
    }
    const {reply} = req.body;
    const userid = _id.toString();
    
    const replydata = {
        userid,
        reply,
    }
    
    const postdata = await Comment.findByIdAndUpdate(commentid,{$push:{replies:replydata}},{new:true})
    if(!postdata){
        return res.status(404).json({
            success:false,
            message:"Error Adding Reply"
        })
    }
    const ReplyWithUserDetails = await postdata.populate("replies.userid");
    return res.status(200).json({
        message:"Reply Added Successfully",
        data:ReplyWithUserDetails
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCommentsAndRepliesByPostId = async (req,res)=>{
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
        postid = req.params.id
        if(!postid){
            return res.status(400).json({
                success:false,
                message:"Post Id is Required"
            })
        }

        const CommentAndReplyData = await Comment.find({postid:postid}).populate("userid")
        if(!CommentAndReplyData || CommentAndReplyData.length === 0){
            return res.status(404).json({
                success:false,
                message:"No Comments or Reply's are found for this Post"
            })
        }

        return res.status(200).json({
            success:true,
            data:CommentAndReplyData
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}
module.exports = { addcomment, addreply, getCommentsAndRepliesByPostId};
