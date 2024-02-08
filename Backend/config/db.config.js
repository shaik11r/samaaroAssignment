const mongoose = require("mongoose");

require("dotenv").config();

const connectToDatabase = async () => {
  try {
    // console.log(process.env);
    await mongoose.connect(process.env.MONGODBURL);
    console.log("conneted to db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDatabase;
