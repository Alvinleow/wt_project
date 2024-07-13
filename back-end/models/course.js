const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  totalOfLessons: { type: Number, default: 0 },
  enrollment: { type: Number, default: 0 },
});

module.exports = mongoose.model("Course", courseSchema);
