const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
