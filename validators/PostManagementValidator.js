const { Body } = require("express-validator");
Body("content")
  .notEmpty()
  .withMessage("Content should not be Empty")
  .isLength({ min: 50, max: 300 })
  .withMessage("Content should be between 30 to 300 characters Long");
