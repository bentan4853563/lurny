const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

/**
 * POST request handler to update the 'repeatTimes' and 'period' fields of a User document.
 * On success, it generates a JWT token with user information and returns it.
 */
router.post("/update-rosi", async (req, res) => {
  try {
    const { user_id, repeatTimes, period } = req.body;

    // Validate that the user_id is provided in the request body
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Update the user document with new values for `repeatTimes` and `period`
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { repeatTimes, period },
      { new: true }
    );

    // If no document was found and updated, send a 404 response
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare payload for JWT based on the updated user information
    const jwtPayload = {
      id: updatedUser._id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL,
      repeatTimes: updatedUser.repeatTimes,
      period: updatedUser.period,
    };

    // Generate a JWT token using the payload and a secret key with an expiration time
    // NOTE: Replace 'secreate' with an actual secret key stored securely and accessed via environment variables
    const jwtToken = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET_KEY || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Send back the success message along with the generated JWT token
    res
      .status(200)
      .json({ message: "User updated successfully", token: jwtToken });
  } catch (error) {
    // If an error occurs, log it and send a 500 response with the error message
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Export the router to make it available for other parts of the application
module.exports = router;
