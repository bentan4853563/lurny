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
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "material",
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  saved_date: {
    type: Date,
  },
  learn_count: {
    type: Number,
    default: 0,
  },
  last_learned: {
    type: Date,
  },
});

module.exports = mongoose.model("study", StudySchema);
