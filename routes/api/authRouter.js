/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const admin = require("../../config/firebaseAdminConfig");
const jwt = require("jsonwebtoken");

// Changed from 'import' to 'require' to maintain consistency in module system
const User = require("../../models/User");

router.post("/signup", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    const email = decodedToken.email;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const newUser = new User({
        uid: crypto.randomUUID(),
        email: decodedToken.email,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
      });
      await newUser.save();

      const jwtToken = jwt.sign(
        { id: newUser.id, email: newUser.email },
        "secreate",
        { expiresIn: "1h" }
      );

      res
        .status(201)
        .json({ message: "User registered successfully", token: jwtToken });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized", details: error.errorInfo });
  }
});

router.post("/signin", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    const email = decodedToken.email;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const jwsPayload = {
        id: existingUser._id,
        email: existingUser.email,
        displayName: existingUser.displayName,
        photoURL: existingUser.photoURL,
        repeatTimes: existingUser.repeatTimes,
        period: existingUser.period,
      };
      const jwtToken = jwt.sign(jwsPayload, "secreate", {
        expiresIn: "1h",
      });
      res
        .status(200)
        .json({ message: "Successfully logged in", token: jwtToken });
    } else {
      res.status(404).json({ message: "Please sign up first." });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized", details: error.errorInfo });
  }
});

module.exports = router;
