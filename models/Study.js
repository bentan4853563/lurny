const mongoose = require("mongoose");

const StudySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  lurny: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lurny",
  },
  type: {
    type: String,
  },
  number: {
    type: Number,
  },
  learn_count: {
    type: Number,
    default: 1,
  },
  last_learned: {
    type: Date,
  },
});

module.exports = mongoose.model("study", StudySchema);