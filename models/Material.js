const mongoose = require("mongoose");

const MaterialShema = new mongoose.Schema({
  stub: {
    type: String,
  },
  question: {
    type: String,
  },
  answer: [
    {
      type: String,
    },
  ],
  correctanswer: {
    type: String,
  },
  explanation: { type: String },
});

module.exports = mongoose.model("material", MaterialShema);
