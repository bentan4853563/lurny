// Disables ESLint no-undef warnings in this file, should be enabled for production
/* eslint-disable no-undef */

// Required external modules for HTTP server, MongoDB interaction, and file system operations
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

// Router instance to handle incoming requests
const router = express.Router();

// Model import for Lurny collection
const Lurny = require("../../models/Lurny");

/**
 * GET request handler to retrieve all Lurny documents sorted by date in descending order.
 */
router.get("/get", async (req, res) => {
  try {
    const lurnies = await Lurny.find().sort({ date: -1 }).populate("user");
    res.json(lurnies);
  } catch (error) {
    // In case of error, respond with a status code of 500 and the error message
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET request handler to retrieve the last 20 shared Lurny documents.
 */
router.get("/currents", async (req, res) => {
  try {
    const lurnies = await Lurny.find({ shared: true })
      .sort({ date: -1 })
      .limit(20)
      .populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST request handler to retrieve Lurnies by user ID from the request body.
 */
router.post("/my-lurnies", async (req, res) => {
  const userId = req.body.user;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const query = { user: userId };
    const lurnies = await Lurny.find(query)
      .sort({ date: -1, shared: 1 })
      .populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST request handler to insert multiple new Lurnies.
 */
router.post("/insert", async (req, res) => {
  try {
    const newLurnies = req.body; // Assume that request body will be an array of objects

    // Inserts multiple documents into the database in one operation
    const savedLurny = await Lurny.insertMany(newLurnies);

    // Populates user field for all newly inserted Lurnies
    const populateUserField = (lurny) =>
      Lurny.populate(lurny, { path: "user" });
    const populatedLurnies = await Promise.all(
      savedLurny.map(populateUserField)
    );

    res.status(201).json(populatedLurnies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * PATCH request handler to mark a specific Lurny as shared.
 */
router.patch("/share/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid Lurny ID" });
  }

  try {
    const result = await Lurny.findByIdAndUpdate(
      id,
      { shared: true },
      { new: true }
    );
    if (!result) {
      return res.status(404).send("No document found with the given ID.");
    }

    res.send(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * DELETE request handler to delete a specific Lurny document by ID.
 */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid Lurny ID");
  }

  try {
    await Lurny.findByIdAndDelete(id);
    res.send("Successfully deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// The endpoint /delete-stub is commented out as it may contain logic errors.

/**
 * DELETE request handler to remove a quiz or summary 'stub' item from a Lurny document.
 * The type determines whether to remove from the quiz or summary arrays.
 */
router.delete("/delete-stub", async (req, res) => {
  const { id, type, number } = req.body;

  // Ensure we are working with valid types and ID
  const validTypes = ["stub", "quiz"];
  if (!validTypes.includes(type) || !mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid parameters");
  }

  try {
    const lurny = await Lurny.findById(id);
    if (!lurny) {
      return res.status(404).send("Lurny not found");
    }

    if (
      (type === "stub" && Array.isArray(lurny.summary)) ||
      (type === "quiz" && Array.isArray(lurny.quiz))
    ) {
      const fieldName = type === "stub" ? "summary" : "quiz";
      const updatedArray = lurny[fieldName].filter(
        (_, index) => index !== parseInt(number, 10)
      );
      const update = { [fieldName]: updatedArray };

      const updatedLurny = await Lurny.findByIdAndUpdate(id, update, {
        new: true,
      }).populate("user");
      res.send(updatedLurny);
    } else {
      res.status(400).send("Invalid type or structure");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * DELETE request handler to remove all Lurnies created by a specific user.
 * NOTE: User ID is hardcoded and should come from the request or session data.
 */
router.delete("/delete-byuser", async (req, res) => {
  const userId = "65f726277e1c4b277e67a352"; // Hardcoded userId, replace with dynamic retrieval of userID
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    await Lurny.deleteMany({ user: userId });
    res.send("Successfully deleted user's Lurnies");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * DELETE request handler to identify and delete low-quality Lurnies based on quiz and summary length.
 */
router.delete("/low-quality", async (req, res) => {
  const outputFile = "output.txt";

  try {
    const lurnies = await Lurny.find().populate("user");
    const stream = fs.createWriteStream(outputFile, { flags: "w" });

    const deletions = lurnies
      .filter((lurny) => lurny.quiz.length < 5 || lurny.summary.length < 5)
      .map(async (lurny) => {
        await Lurny.findByIdAndDelete(lurny._id);
        stream.write(`${lurny.user.email} ${lurny.url}\n`);
      });

    // Wait for all deletions to complete before closing the stream
    await Promise.all(deletions);
    stream.end();

    res
      .status(200)
      .json({ message: "Low quality lurnies have been deleted and logged." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export the router for use in other parts of the application
module.exports = router;
