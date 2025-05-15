const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// const ConnectionString = 'mongodb+srv://nikhil:y6vXgPkFz6Pg7oZA@socialmedia.bieipm9.mongodb.net/'
// const ConnectionString = 'mongodb://localhost:27017/SocialMedia'
const ConnectionString = process.env.CONECTION_STRING
const DBConnection = async ()=>{
try{
    await mongoose.connect(ConnectionString);
    console.log("Connected to MongoDB Successfully");
}catch(error){
    console.log(error)
}
}
module.exports = DBConnection