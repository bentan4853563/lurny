/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Lurny = require("../../models/Lurny");

router.get("/get", async (req, res) => {
  try {
    const lurnies = await Lurny.find().sort({ date: -1 }).populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.post("/my-lurnies", async (req, res) => {
  try {
    const lurnies = await Lurny.find({ user: req.body.user })
      .sort({
        date: -1,
        shared: 1,
      })
      .populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/insert", async (req, res) => {
  try {
    const newLurnies = req.body;
    const savedLurny = await Lurny.insertMany(newLurnies);

    // Use Promise.all to wait for all promises to resolve simultaneously,
    // rather than waiting for each find operation to complete serially
    const populatedLurniesPromises = savedLurny.map((lurny) =>
      Lurny.findById(lurny._id).populate("user")
    );
    const populatedLurnies = await Promise.all(populatedLurniesPromises);
    console.log("populatedLurnies", populatedLurnies);
    res.status(201).json(populatedLurnies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Lurny.findByIdAndUpdate(
      id,
      { shared: true }, // Set sharedField to true
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Document shared.");
    }

    res.send(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Lurny.findByIdAndDelete(id);

    res.send("Successfully deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete-byuser", async (req, res) => {
  await Lurny.deleteMany({ user: "65f726277e1c4b277e67a352" });

  res.send("Success!!");
});

router.delete("/many", async (req, res) => {
  try {
    // const result = await Lurny.deleteMany({ url: { $exists: false } });
    // Or if you want to check for both non-existent and null values:
    const result = await Lurny.deleteMany({
      $or: [{ url: { $exists: false } }, { url: null }],
    });

    res.status(200).json({
      message: "Documents without url have been deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
