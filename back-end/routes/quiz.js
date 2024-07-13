const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/", quizController.getAllQuizzes);

router.get("/:quizId", quizController.getQuizById);

router.get("/:courseId/quiz", quizController.getQuizByCourseId);

router.post("/:courseId", quizController.addQuiz);

router.post("/:quizId/questions", quizController.addQuestion);
router.post("/:quizId/submit", quizController.submitQuiz);
router.put("/:quizId/questions/:questionId", quizController.editQuestion);
router.delete("/:quizId/questions/:questionId", quizController.deleteQuestion);

module.exports = router;
