const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Lurny = require("../../models/Lurny");
const Study = require("../../models/Study");
const { config } = require("dotenv");
const Material = require("../../models/Material");

const quiz_server_url = process.env.VITE_QUIZ_SERVER;

router.get("/get/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log("user_id", user_id);
    const studies = await Study.find({ user: user_id })
      .populate("user")
      .populate("material");
    res.send(studies);
  } catch (error) {
    console.log(error);
  }
});

router.post("/save", async (req, res) => {
  try {
    const { user_id, lurny_id, type, number } = req.body;
    console.log("object :>> ", user_id, lurny_id, type, number);

    // Check for an existing study record
    const check = await Study.findOne({
      user: user_id,
      lurny: lurny_id,
      type,
      number,
    });
    console.log("check", check);

    let response;

    if (check) {
      // Increment learn_count
      const updatedLearnCount = check.learn_count + 1;

      // Update the existing document
      response = await Study.findByIdAndUpdate(
        check._id,
        { $set: { learn_count: updatedLearnCount, last_learned: Date.now() } },
        { new: true }
      );
    } else {
      const lurny = await Lurny.findById(lurny_id);
      console.log("lurny :>> ", lurny);
      if (!lurny) {
        return res.status(404).send(`No Lurny found with id ${lurny_id}`);
      }

      let quiz = null;
      let stub = null;
      let image = lurny.image ? lurny.image : null;
      let url = lurny.url ? lurny.url : null;

      if (type === "stub") {
        if (lurny.summary && number >= 0 && number < lurny.summary.length) {
          stub = lurny.summary[number];
        } else {
          return res
            .status(400)
            .send("Invalid 'number' or no summary available.");
        }
        // Assuming 'headers' should be a valid headers object, you might need to set Content-Type, Authorization, etc.
        const quizResponse = await fetch(`${quiz_server_url}/get_quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stub }),
        });

        if (!quizResponse.ok) {
          // Handle failed request e.g., return an error message to the client
          return res.status(500).send("Failed to fetch quiz.");
        }
        quiz = await quizResponse.json();
      } else {
        console.log("lurny.quiz :>> ", lurny.quiz);
        quiz = lurny.quiz[number];
      }

      let quizObject = {
        stub,
        ...quiz,
      };

      let materialDocs = await Material.insertMany([quizObject]);
      const materialId = materialDocs[0]._id;

      const newStudy = new Study({
        user: user_id,
        lurny: lurny_id,
        type,
        number,
        material: materialId,
        image,
        url,
        learn_count: 1,
        last_learned: Date.now(),
      });

      response = await newStudy.save();
      console.log("response :>> ", response);
    }

    // The success response could be improved by returning some data about the operation (e.g., the created or updated document)
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("An internal server error occurred.");
  }
});

router.post("/test", async (req, res) => {
  try {
    const { studyId, newStudyData } = req.body;

    const response = await Study.findByIdAndUpdate(studyId, newStudyData, {
      new: true,
    })
      .populate("user")
      .populate("material");

    console.log("response :>> ", response);

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
