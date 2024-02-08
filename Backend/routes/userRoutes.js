const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");
// const isUserAuthorized = require("");
const userValidtors = require("../middlewares/validators");

userRouter.post(
  "/signup",
  userValidtors.validUserSignup,
  userValidtors.handleValidationResult,
  userController.signUp
);
userRouter.post(
  "/signin",
  userValidtors.validUserSignin,
  userValidtors.handleValidationResult,
  userController.signin
);
userRouter.get("/userProfile", userController.isUserAuthorized, userController.getUserDetails);
userRouter.get("/allusers", userController.isUserAuthorized, userController.getAllUserDetails);
userRouter.post("/kickuser", userController.isUserAuthorized, userController.kickUser);
userRouter.post("/blockuser", userController.isUserAuthorized, userController.blockUser);
module.exports = userRouter;
