/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const admin = require("../../config/firebaseAdminConfig"); // Firebase admin configuration for authenticating with Firebase services.
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Imported crypto to generate UUID.

// Load User model from the models directory to interact with the MongoDB Users collection.
const User = require("../../models/User");

// Endpoint for user registration using Firebase accessToken.
router.post("/signup", async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Verify the Firebase ID token and extract the email.
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    const email = decodedToken.email;

    // Check if a user already exists with the given email address.
    const existingUser = await User.findOne({ email }).exec(); // Use exec() for better stack traces on errors.

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // Return to prevent further execution.
    }

    // No existing user found, create a new user.
    const newUser = new User({
      uid: crypto.randomUUID(),
      email,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
    });
    await newUser.save();

    // Generate a JWT for the newly created user.
    const jwtToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET, // Use an environment variable for the JWT secret, never hardcode secrets!
      { expiresIn: "1h" }
    );

    // Respond with success and the JWT token.
    res
      .status(201)
      .json({ message: "User registered successfully", token: jwtToken });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized", details: error.errorInfo });
  }
});

// Endpoint for user login using Firebase accessToken.
router.post("/signin", async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Verify the Firebase ID token and extract email details.
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    const email = decodedToken.email;

    // Attempt to find the user by their email address.
    const existingUser = await User.findOne({ email }).exec(); // Use exec() for better stack traces on errors.

    if (existingUser) {
      // Payload for JWT should only contain necessary information.
      const jwsPayload = {
        id: existingUser._id,
        email: existingUser.email,
      };

      // Generate JWT for the existing user logging in.
      const jwtToken = jwt.sign(jwsPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Successfully logged in, respond with the token.
      res
        .status(200)
        .json({ message: "Successfully logged in", token: jwtToken });
    } else {
      // If no user exists with the email, they need to sign up first.
      res.status(404).json({ message: "Please sign up first." });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized", details: error.errorInfo });
  }
});

module.exports = router;
