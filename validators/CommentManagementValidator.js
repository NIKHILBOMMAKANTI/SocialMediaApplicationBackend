const {body} = require('express-validator');
const addcommentvalidator = [
    body("comment")
      .notEmpty()
      .withMessage("Comment should not be Empty")
      .isLength({ min: 20})
      .withMessage("Comment must be at least 20 characters long.")
];
const addreplyvalidator = [
    body("reply")
      .notEmpty()
      .withMessage("Comment should not be Empty")
      .isLength({ min: 20})
      .withMessage("Reply must be at least 20 characters long.")
]
module.exports = {addcommentvalidator,addreplyvalidator}