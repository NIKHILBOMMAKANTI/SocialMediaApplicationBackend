const bcrypt = require('bcrypt');
const PasswordHash = async (req,res,next)=>{
   try{
    const password = req.body.password; 
    if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        req.body.password = hashedpassword
    }
    next();
   }catch(error){
    res.status(500).json({
        message:error.message
    })
   } 
   
}
module.exports = PasswordHash