const { body } = require("express-validator");

const createpostvalidator = [
body("content")
  .notEmpty()
  .withMessage("Content should not be Empty")
  .isLength({ min: 20 })
  .withMessage("Content should be a minimum of 20 characters long")
];
module.exports = {createpostvalidator}
