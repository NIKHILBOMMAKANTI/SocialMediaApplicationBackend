const Post = require("../Model/PostSchema.js");
const { upload } = require("../utils/multerConfig.js");
const { S3 } = require("../utils/AwsS3Config.js");
const {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();
const { getmediaS3key } = require("../helper/fileuploadhelper.js");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const createpost = async (req, res) => {
  try {
    const { _id, username, email, password, bio, gender, location, role } =
      req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const userid = req.params.id;
    const { content } = req.body;
    const mediaS3key = getmediaS3key(req.files);
    const { fieldname, originalname, mimetype, buffer } = req.files.media[0];

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: mediaS3key,
        Body: buffer,
        ContentType: mimetype,
      })
    );

    if (!userid) {
      res.status(400).json({
        success: false,
        message: "Userid Required",
      });
    }

    const newpost = await Post({
      userid,
      content,
      mediaS3key,
    });
    await newpost.save();

    const PoppulatedPostData = await Post.find({ userid: userid }).populate(
      "userid"
    );
    res.status(200).json({
      success: true,
      message: "Post Created Successfully",
      data: PoppulatedPostData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getallpost = async (req, res) => {
  try {
    const { _id, username, email, password, bio, gender, location, role } =
      req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }

    const allpost = await Post.find({ isPrivate: false })
      .populate("userid")
      .lean();
    const PostWithPresignedUrl = await Promise.all(
      (presignedData = allpost.map(async (Post) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: Post.mediaS3key,
        });
        const presignedUrl = await getSignedUrl(S3, command, {
          expiresIn: "6h",
        });
        return {
          ...Post,
          presignedUrl,
        };
      }))
    );

    res.status(200).json({
      success: true,
      data: PostWithPresignedUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatepost = async (req, res) => {
  try {
    const { _id, username, email, password, bio, gender, location, role } =
      req.user_data;
    if (role !== "User") {
      return res.status(403).json({
        success: false,
        title: "Access Denied",
        message:
          "Unauthorized. Your account does not have permission to access this resource",
      });
    }
    const { fieldname, originalname, mimetype, buffer } = req.files.media[0];
    const file = req.files.media;
    const postid = req.params.id;
    console.log(postid);
    if (file.length > 0) {
      const postdata = await Post.findById(postid);
      await S3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: postdata.mediaS3key,
        })
      );
      const mediaS3key = getmediaS3key(req.files);
      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: mediaS3key,
          Body: buffer,
          ContentType: mimetype,
        })
      );

      const UpdatedMultiMediadata = await Post.findByIdAndUpdate(
        postid,
        { mediaS3key: mediaS3key },
        { new: true }
      );
      console.log(UpdatedMultiMediadata);
    }
    const { content } = req.body;
    if (content) {
      const UpdatedContentdata = await Post.findByIdAndUpdate(
        postid,
        { content: content },
        { new: true }
      );
    }

    const data = await Post.findById(postid).populate("userid");
    console.log(data);
    res.status(200).json({
      message: "Post Updated Successfullly",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletepost = async (req, res) => {
  try {
    const { _id, username, email, password, bio, gender, location, role } =
      req.user_data;
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
        message: "Post Id is Required",
      });
    }
    const postdata = await Post.findById(postid);
    if (!postdata) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    await S3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: postdata.mediaS3key,
      })
    );
    const deletepost = await Post.findByIdAndDelete(postid);
    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
      data: deletepost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getspecificpost = async (req, res) => {
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
        message: "Post Id is Required",
      });
    }
    const postdata = await Post.findById(postid).populate("userid").lean();
    const command = await new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: postdata.mediaS3key,
    });

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: "6h" });

    const PostWithPresignedUrl = {
      ...postdata,
      presignedUrl,
    };
    res.status(200).json({
      success: true,
      data: PostWithPresignedUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {createpost,getallpost,updatepost,deletepost,getspecificpost};
