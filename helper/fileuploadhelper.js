const getmediaS3key = (uploadedfiles)=>{
    
    const {fieldname,originalname,mimetype,buffer} = uploadedfiles.media[0];
    if(mimetype.startsWith('video/')){
        return key = `Video/${originalname}-${Date.now()}`
    }else if(mimetype.startsWith('image/')){
        return key = `Image/${originalname}-${Date.now()}`
    }

}
module.exports = {getmediaS3key}