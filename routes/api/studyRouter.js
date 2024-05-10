const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Lurny = require("../../models/Lurny");
const Study = require("../../models/Study");

router.get("/get/:user_id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const studies = Study.find({ user: user_id })
      .pupulate("user")
      .populate("lurny");
    res.send(studies);
  } catch (error) {
    console.log(error);
  }
});

router.post("/save", async (req, res) => {
  try {
    const { user_id, lurny_id, type, number } = req.body;
    const check = await Study.findOne({
      user: user_id,
      lurny: lurny_id,
      type,
      number,
    });
    let response = null;
    if (check) {
      // Increment learn_count
      const updatedLearnCount = check.learn_count + 1;

      // Use the model name 'Study' if you are updating the Study collection
      response = await Study.findByIdAndUpdate(
        check._id,
        {
          learn_count: updatedLearnCount,
          last_learned: Date.now(),
        },
        { new: true }
      );
    } else {
      const newStudy = new Study({
        user: user_id,
        lurny: lurny_id,
        learn_count: 1,
        last_learned: Date.now(),
      });
      response = await newStudy.save();
    }
    console.log(response);
    res.send("Success");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
