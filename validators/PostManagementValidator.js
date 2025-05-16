const { body } = require("express-validator");

const createpostvalidator = [
body("content")
  .notEmpty()
  .withMessage("Content should not be Empty")
  .isLength({ min: 20, max: 300 })
  .withMessage("Content should be between 20 to 300 characters Long")
];
module.exports = {createpostvalidator}
