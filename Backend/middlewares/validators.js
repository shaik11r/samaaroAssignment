const { body, param, validationResult } = require("express-validator");

const validUserSignup = [
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .trim()
    .isLength({ min: 4 })
    .withMessage("name should be atleast 4 letters")
    .isLength({ max: 15 })
    .withMessage("title must be less than 15 letters"),
  body("email").isEmail().withMessage("invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 chars")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

const validUserSignin = [
  body("email").isEmail().withMessage("invalid email address"),
  body("password").notEmpty().withMessage("password is required"),
];

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validUserSignup,
  validUserSignin,
  handleValidationResult,
};
