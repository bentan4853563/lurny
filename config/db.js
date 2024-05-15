/* eslint-disable no-undef */
const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://krish:yXMdTPwSdTRo7qHY@serverlessinstance0.18otqeg.mongodb.net/Lurny";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Mongodb connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
