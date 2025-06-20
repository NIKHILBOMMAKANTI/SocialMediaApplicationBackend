const Express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const app = Express();
const port = process.env.PORT
const cookie = require('cookie-parser');
const DBConnection = require('./Config/DBConnection')
const CORS = require('cors');

app.use(CORS({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


//app.options('*', CORS());

DBConnection();

app.use(Express.json());
app.use(cookie());

//Importing all the Required Routes
UserAuthentication = require('./Routes/UserAuthenticationRoute');
PostManagement = require('./Routes/PostManagementRoute');
CommentManagement = require('./Routes/CommentManagementRoute');
LikesManagement = require('./Routes/LikesManagementRoute');
FriendSystem = require('./Routes/FriendSystemRoute');
AdminManagement = require('./Routes/AdminManagementRoute')

//Middleware
app.use('/auth',UserAuthentication);
app.use('/post',PostManagement);
app.use('/comments',CommentManagement);
app.use('/likes',LikesManagement);
app.use('/friend',FriendSystem);
app.use('/admin',AdminManagement);


app.get("/test", (req,res)=>{
    res.status(200).send("hello world")
})

app.listen(port,(error)=>{
    if(error){
        console.log(err.message);
    }else{
        console.log("Server is Running...")
    }
})