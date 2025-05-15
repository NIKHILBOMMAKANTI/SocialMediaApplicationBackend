const { Body } = require("express-validator");

//SignUp
Body("username")
  .notEmpty()
  .withMessage("Username is Required")
  .isLength({ min: 6, max: 30 })
  .withMessage("Username must be between 6 and 30 characters")
  .isAlpha()
  .withMessage("Username must contain only alphabetic characters");

Body("email")
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Please Enter the Valid Email Address");

Body("password")
  .notEmpty()
  .withMessage("Password  is Required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[a-z]/)
  .matches(/[A-Z]/)
  .matches(/\d/)
  .matches(/[@$!%*?&]/)
  .withMessage(
    "Password must be have atleast one Uppercase , Lowercase, Digit and a Special Character"
  );

Body("confirmpassword")
  .notEmpty()
  .withMessage("Confirm password is required")
  .custom((value , {req})=>{
    if(value != req.body.password){
        throw new Error("Password Does not Match")
    }
  });

Body("bio")
  .optional()
  .isLength({ min: 50, max: 150 })
  .withMessage("Bio should be between 50 and 150 characters long");

Body("gender")
  .optional()
  .isIn(["Male", "Female", "Other"])
  .withMessage("Gender should have one of the Following:Male,Female,Other");

Body("interests")
  .optional()
  .isLength({ min: 5, max: 15 })
  .withMessage("Intrest Should be between 50 to 150 characters long");

Body("location")
  .optional()
  .isLength({ min: 5 })
  .withMessage("Loaction should be minimum of 5 characters Long");

