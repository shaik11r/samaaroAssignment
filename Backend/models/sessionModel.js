const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
});

const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
