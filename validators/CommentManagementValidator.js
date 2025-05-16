const {body} = require('express-validator');
const addcommentvalidator = [
    body("comment")
      .notEmpty()
      .withMessage("Comment should not be Empty")
      .isLength({ min: 20, max: 300 })
      .withMessage("Comment should be between 20 to 300 characters Long")
];
const addreplyvalidator = [
    body("reply")
      .notEmpty()
      .withMessage("Comment should not be Empty")
      .isLength({ min: 20, max: 300 })
      .withMessage("Comment should be between 20 to 300 characters Long")
]
module.exports = {addcommentvalidator,addreplyvalidator}