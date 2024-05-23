// Importing necessary modules
const express = require("express");
const Study = require("../../models/Study");
const Lurny = require("../../models/Lurny");
const Material = require("../../models/Material");

// Create a router instance
const router = express.Router();

/**
 * GET request handler to retrieve studies for a specific user by ID.
 * The studies are populated with related user and material data.
 */
router.get("/get/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const studies = await Study.find({ user: user_id }).populate([
      "user",
      "material",
    ]);
    res.send(studies);
  } catch (error) {
    console.error(error);
    res.status(500).send("An internal server error occurred.");
  }
});

/**
 * POST request handler to create a new study record.
 * It checks for an existing study, if not found, creates a new one including creating needed material.
 */
router.post("/save", async (req, res) => {
  try {
    const { user_id, lurny_id, type, number } = req.body;

    // Find an existing study with the same characteristics
    const existingStudy = await Study.findOne({
      user: user_id,
      lurny: lurny_id,
      type,
      number,
    });

    if (existingStudy) {
      return res.status(409).json({ message: `The ${type} already exists.` });
    }

    // Ensure the Lurny exists before continuing
    const lurny = await Lurny.findById(lurny_id);
    if (!lurny) {
      return res.status(404).json(`No Lurny found with id ${lurny_id}`);
    }

    let stub, quiz;
    if (type === "stub") {
      // Validate 'number' for array bounds
      if (
        !Array.isArray(lurny.summary) ||
        number < 0 ||
        number >= lurny.summary.length
      ) {
        return res
          .status(400)
          .json("Invalid 'number' or no summary available.");
      }

      stub = lurny.summary[number];

      // Fetch quiz from external quiz server
      const quizResponse = await fetch(
        `${process.env.VITE_QUIZ_SERVER}/get_quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stub }),
        }
      );

      if (!quizResponse.ok) {
        return res.status(500).json("Failed to fetch quiz.");
      }

      quiz = await quizResponse.json();
    } else if (type === "quiz") {
      // For quiz, simply use the provided quiz item from Lurny
      quiz = lurny.quiz[number];
    } else {
      return res.status(400).json({ message: "Invalid type specified." });
    }

    const materialData = {
      title: lurny.title,
      ...quiz,
    };

    // Insert the new material into the database
    const [materialDoc] = await Material.insertMany([materialData]);

    // Create and save the new study document
    const newStudy = new Study({
      user: user_id,
      lurny: lurny_id,
      type,
      number,
      image: lurny.image,
      url: lurny.url,
      material: materialDoc._id,
      saved_date: Date.now(),
      last_learned: Date.now(),
    });

    const savedStudy = await newStudy.save();
    res.status(201).json(savedStudy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

/**
 * POST request handler to update study data by studyId.
 */
router.post("/test", async (req, res) => {
  try {
    const { studyId, newStudyData } = req.body;

    // Update the study and return the updated document
    const updatedStudy = await Study.findByIdAndUpdate(studyId, newStudyData, {
      new: true,
    }).populate(["user", "material"]);

    if (!updatedStudy) {
      return res.status(404).json({ message: "Study not found." });
    }

    res.status(200).json(updatedStudy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Study.findByIdAndDelete(id);

    res.send("Successfully deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Export the router to be used by other parts of the application
module.exports = router;
