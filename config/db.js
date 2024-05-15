/* eslint-disable no-undef */
const mongoose = require("mongoose");
require("dotenv").config();

// It's important to keep your credentials private. Use environment variables instead.
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MongoDB URI is not set in environment variables");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
