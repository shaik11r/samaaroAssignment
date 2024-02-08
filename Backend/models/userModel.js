const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isKicked: {
    type: Boolean,
    default: false,
  },
  onlineStatus: {
    type: String,
    default: "offline",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const userModel = new mongoose.model("User", userSchema);
module.exports = userModel;
