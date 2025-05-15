const Likes = require("../Model/LikesSchema.js");

const addLikeToPost = async (req, res) => {
  try {
        const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const postid = req.params.id;
    if (!postid) {
      return res.status(400).json({
        success: false,
        message: "Post Id Required",
      });
    }
    // const { _id } = req.user_data;
    const userid = _id.toString();
    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "Please login to perform this action.",
      });
    }
    const alreadyLiked = await Likes.findOne({ postid, userid });
    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: "You Have Already Liked This Post.",
      });
    }
    console.log(alreadyLiked);
    const newLike = await new Likes({
      postid,
      userid,
    });
    await newLike.save();
    const UserLike = await newLike.populate("userid");
    res.status(200).json({
      success: true,
      message: "Post Liked Successfully",
      data: UserLike,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const unLikePost = async (req, res) => {
  try {
        const { _id, username, email, password, bio, gender, location, role } = req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const postid = req.params.id;
    if (!postid) {
      return res.status(400).json({
        success: false,
        message: "Post Id Required",
      });
    }
    // const { _id } = req.user_data;
    const userid = _id.toString();
    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "Please login to perform this action.",
      });
    }
    const deletedpost = await Likes.findOneAndDelete({ postid, userid });
    if (!deletedpost) {
      return res.status(404).json({
        success: false,
        message: "You haven't liked this post yet.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post Unliked Successfully.",
      data: deletedpost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLikeCountForPost = async (req,res)=>{
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
    const postid = req.params.id;
    console.log(postid);
    if(!postid){
      return res.status(400).json({
        success:false,
        message:"Post Id is Required"
      })
    }
    const LikesCount = await Likes.countDocuments({postid:postid});
    if(LikesCount == 0){
      return res.status(200).json({
        success:true,
        message:"This post hasn't received any likes yet"
      })
    }
    return res.status(200).json({
      success:true,
      data:LikesCount
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message

    })
  }
}
module.exports = { addLikeToPost, unLikePost, getLikeCountForPost};
