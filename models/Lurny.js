/* eslint-disable no-undef */
const mongoose = require("mongoose");

const LurnySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // This should reference the name of the User model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    trim: true,
  },
  summary: [
    {
      type: Object,
    },
  ],
  quiz: [
    {
      type: Object,
    },
  ],
  collections: [{ type: Object }],
  image: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  shared: {
    type: Boolean,
    default: false,
  },
});

LurnySchema.index({ "$**": "text" });

module.exports = mongoose.model("lurny", LurnySchema);
