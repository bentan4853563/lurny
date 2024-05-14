const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

router.post("/update-rosi", async (req, res) => {
  try {
    const { user_id, repeatTimes, period } = req.body;
    if (!user_id) {
      return res.status(400).send({ message: "User ID is required." });
    }

    const response = await User.findByIdAndUpdate(
      user_id,
      { repeatTimes, period },
      { new: true }
    );

    // If no document was found with the given ID, send a 404 response.
    if (!response) {
      return res.status(404).send({ message: "User not found." });
    }

    console.log("response :>> ", response);
    const jwsPayload = {
      id: response._id,
      email: response.email,
      displayName: response.displayName,
      photoURL: response.photoURL,
      repeatTimes: response.repeatTimes,
      period: response.period,
    };

    const jwtToken = jwt.sign(jwsPayload, "secreate", { expiresIn: "1h" });
    res.json({ message: "Successfully logged in", token: jwtToken });
  } catch (error) {
    // If an error occurs, send a 500 response with the error message.
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
