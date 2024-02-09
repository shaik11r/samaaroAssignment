const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();
const sessionModel = require("../models/sessionModel");

const isUserAuthorized = async (req, res, next) => {
  try {
    if (req.headers.authtoken) {
      const token = req.headers.authtoken;
      req.currentUser = jwt.verify(token, "longInt");
      const userId = req.currentUser.userId;
      const session = await sessionModel.findOne({ userId, token });
      if (!session) {
        return res.status(401).json({
          error: "unauthorized invalid session",
        });
      }
      next();
      return;
    } else {
      res.json({
        error: "error please signin",
      });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized:Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized : Token expired" });
    }
    return res.status(500).json({ error: "internal server errorrr" });
  }
};

const getAllUserDetails = async (req, res) => {
  try {
    const allusers = await userModel.find().exec();
    const otherUsers = allusers.filter((user) => {
      return user._id.toString() !== req.currentUser.userId;
    });
    const data = otherUsers.map((user) => {
      return {
        userId: user._id,
        username: user.username,
        onlineStatus: user.onlineStatus,
        isBlocked: user.isBlocked,
      };
    });
    return res.status(200).send({
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "internal server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.currentUser;
    const userDetails = await userModel.findOne({ _id: userId });
    if (!userDetails) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json({
      userDetails: userDetails,
    });
  } catch (error) {
    return res.status(500).send({ error: "internal server errrror" });
  }
};

//Kicking user
const kickUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const boomUser = await userModel.findOne({ _id: req.currentUser.userId });
    // console.log(boomUser.isAdmin);
    const isAdmin = boomUser.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({
        error: "only admins can kick users",
      });
    }
    await sessionModel.deleteOne({ userId });
    await userModel.findByIdAndUpdate({ _id: userId }, { $set: { onlineStatus: "offline" } });
    return res.status(200).json({ message: `User is kicked sucessfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const adminUser = await userModel.findOne({ _id: req.currentUser.userId });
    const isAdmin = adminUser.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({
        error: "only admins can block users",
      });
    }
    const anotherUser = await userModel.findOne({ _id: userId });
    if (anotherUser.isAdmin) {
      return res.status(403).json({
        error: "admins cant block another admins",
      });
    }
    await sessionModel.deleteOne({ userId });
    const fetchUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { isBlocked: true } },
      { new: true }
    );
    if (!fetchUser) {
      return res.status(404).json({
        error: "user not found",
      });
    }
    return res.status(200).json({
      message: `user is ${userId} sucessfully blocked`,
    });
  } catch (error) {
    console.log(error);
    s;
  }
};
//user signup Functions
const signUp = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  const existingUser = await userModel.findOne({ email: email });

  if (existingUser && existingUser.isBlocked === true) {
    return res.status(400).json({
      error: "sorry you were blocked",
    });
  }
  if (existingUser) {
    return res.status(400).json({
      error: "Error Email is already exists",
    });
  }
  const existingUsername = await userModel.findOne({ username: username });
  if (existingUsername) {
    return res.status(400).json({
      error: "username already taken",
    });
  }
  if (isAdmin === true) {
    if (username !== "nadeenShaik" || username !== "admin") {
      return res.status(400).json({
        error: "sorry your not admin",
      });
    }
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new userModel({
    username: username,
    email: email,
    password: hashPassword,
    isAdmin: isAdmin,
  });
  await newUser.save();
  res.status(200).json({
    message: "new user registered",
  });
};

/**user signin function */

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email: email }).exec();
    if (!existingUser) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    if (existingUser && existingUser.isBlocked === true) {
      return res.status(403).json({
        error: "you were blocked",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Error invalid password",
      });
    }

    const token = jwt.sign({ userId: existingUser._id }, "longInt", { expiresIn: "10h" });
    const session = new sessionModel({ userId: existingUser._id, token });
    await session.save();
    res.set("authtoken", token);
    res.status(200).json({
      message: "sign in sucessfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  signUp,
  signin,
  isUserAuthorized,
  getUserDetails,
  getAllUserDetails,
  kickUser,
  blockUser,
};
