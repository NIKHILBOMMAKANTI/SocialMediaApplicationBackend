const { body } = require("express-validator");

//SignUp
const signupValidation = [
body("username")
  .notEmpty()
  .withMessage("Username is Required")
  .isLength({ min: 6, max: 30 })
  .withMessage("Username must be between 6 and 30 characters")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Username must contain only alphabetic characters"),

body("email")
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Please Enter the Valid Email Address"),


body("password")
  .notEmpty()
  .withMessage("Password  is Required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[a-z]/)
  .withMessage("Password Must have atleast one lowercase")
  .matches(/[A-Z]/)
  .withMessage("Password Must have atleast one Uppercase")
  .matches(/\d/)
  .withMessage("Password Must have atleast one Digit")
  .matches(/[@$!%*?&]/)
  .withMessage("Password must be have atleast one  Special Character"),

body("confirmpassword")
  .notEmpty()
  .withMessage("Confirm password is required")
  .custom((value , {req})=>{
    if(value != req.body.password){
        throw new Error("Password Does not Match")
    }
    return true
  }),

body("bio")
  .optional()
  .isLength({ min: 50, max: 150 })
  .withMessage("Bio should be between 50 and 150 characters long"),

body("gender")
  .optional()
  .isIn(["Male", "Female", "Other"])
  .withMessage("Gender should have one of the Following:Male,Female,Other"),

body("interests")
  .optional()
  .isLength({ min: 50, max: 150 })
  .withMessage("Intrest Should be between 50 to 150 characters long"),

body("location")
  .optional()
  .isLength({ min: 5 })
  .withMessage("Loaction should be minimum of 5 characters Long"),

];

const loginvalidation = [
  body("email")
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Please Enter the Valid Email Address"),

  body("password")
  .notEmpty()
  .withMessage("Password  is Required")
  

]
module.exports = {signupValidation,loginvalidation}
