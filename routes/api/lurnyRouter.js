/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

const Lurny = require("../../models/Lurny");

const quiz_server_url = process.env.VITE_QUIZ_SERVER;

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

// router.delete("/delete-stub", async (req, res) => {
//   try {
//     const { id, type, number } = req.body;

//     const lurny = await Lurny.findById(id);

//     const summary =
//       type === "stub"
//         ? lurny.summary.filter((lurny, index) => index !== number - 1)
//         : summary;
//     const quiz =
//       type === "quiz"
//         ? lurny.quiz.filter((lurny, index) => index !== number - 1)
//         : quiz;

//     Lurny.findByIdAndUpdate(id, summary, quiz);

//     res.send("Successfully deleted");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

router.delete("/delete-stub", async (req, res) => {
  try {
    // Destructuring id, type, and number from the request body
    const { id, type, number } = req.body;
    const lurny = await Lurny.findById(id);
    let update = {};
    const indexToRemove = parseInt(number, 10); // ensure `number` is of type `Number`

    if (!isNaN(indexToRemove)) {
      if (type === "stub" && Array.isArray(lurny.summary)) {
        update.summary = lurny.summary.filter(
          (_, index) => index !== indexToRemove
        );
      } else if (type === "quiz" && Array.isArray(lurny.quiz)) {
        update.quiz = lurny.quiz.filter((_, index) => index !== indexToRemove);
      }
    }
    const updatedLurny = await Lurny.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("user");

    res.send(updatedLurny);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete-byuser", async (req, res) => {
  await Lurny.deleteMany({ user: "65f726277e1c4b277e67a352" });

  res.send("Success!!");
});

router.delete("/low-quality", async (req, res) => {
  const outputFile = "output.txt";
  try {
    const lurnies = await Lurny.find().populate("user");
    const stream = fs.createWriteStream(outputFile, { flags: "w" });

    for (let i = 0; i < lurnies.length; i++) {
      let lurny = lurnies[i];
      if (lurny.quiz.length < 5 || lurny.summary.length < 5) {
        await Lurny.findByIdAndDelete(lurny._id);

        stream.write(`${lurny.user.email} ${lurny.url}\n`);
      }
    }
    stream.end(() => {
      console.log("Finished writing to file");
    });

    res
      .status(200)
      .json({ message: "Low quality lurnies have been deleted and logged." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
