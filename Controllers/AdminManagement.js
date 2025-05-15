const Post = require('../Model/PostSchema');
const {S3} = require('../utils/AwsS3Config');
const {DeleteObjectCommand} = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();


const deletepost = async (req,res)=>{
    try{
        const {_id,username,email,password,bio,gender,location,role} = req.user_data
        if(role === 'User'){
            return res.status(403).json({
                success:false,
                title: "Access Denied",
                message:"Unauthorized. Your account does not have permission to access this resource"
            })
        }
        console.log(req.user_data);
        const postid = req.params.id;
        if(!postid){
            return res.status(400).json({
                success:false,
                message:"Post Id required"
            })
        }

        const Postdata = await Post.findById(postid); 
        const mediaS3key = Postdata.mediaS3key
        console.log(mediaS3key);
        console.log(Postdata);

        await S3.send(new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:mediaS3key
        }))
        const deletedpostdata = await Post.findByIdAndDelete(postid);
        
        if(!deletedpostdata){
            return res.status(404).json({
                success: false,
                message:"Error Deleting the Post"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Post Deleted Successfully",
            data:deletedpostdata
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports = {deletepost};