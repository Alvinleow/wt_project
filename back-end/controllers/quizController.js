const Quiz = require("../models/quiz");
const Account = require("../models/account");

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("courseId");
    res.json(
      quizzes.map((quiz) => ({
        ...quiz.toObject(),
        courseTitle: quiz.courseId.title,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get quiz by course ID
exports.getQuizById = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate("courseId");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const quiz = await Quiz.findOne({ courseId: courseId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found for this course" });
    }

    res.status(200).json({ quizId: quiz._id });
  } catch (error) {
    console.error("Error fetching quiz by course ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Auto-generate quiz for a course if it doesn't exist
exports.generateQuizForCourse = async (courseId) => {
  try {
    const existingQuiz = await Quiz.findOne({ courseId });
    if (existingQuiz) {
      return existingQuiz;
    }
    const newQuiz = new Quiz({
      quizId: courseId,
      courseId,
      questions: [], // Start with no questions
    });
    return await newQuiz.save();
  } catch (err) {
    throw new Error("Error generating quiz: " + err.message);
  }
};

exports.addQuiz = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = new Quiz({
      quizId: courseId,
      courseId,
      questions: [],
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { text, options, correctAnswer } = req.body;

  if (!text || !options || !correctAnswer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const newQuestion = {
      text,
      options,
      correctAnswer,
    };

    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.editQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  const { text, options, correctAnswer } = req.body;

  if (!text || !options || !correctAnswer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.text = text;
    question.options = options;
    question.correctAnswer = correctAnswer;

    await quiz.save();
    res.status(200).json(question);
  } catch (err) {
    console.error("Error editing question:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await quiz.questions.id(questionId).deleteOne();
    await quiz.save();
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { userId, answers } = req.body;

  if (!userId || !answers || !Array.isArray(answers)) {
    return res
      .status(400)
      .json({ message: "User ID and answers are required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Evaluate the answers
    let score = 0;
    answers.forEach((answer) => {
      const question = quiz.questions.id(answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        score++;
      }
    });

    const percentageScore = Math.floor((score / quiz.questions.length) * 100);

    // Save the result to the user's profile
    const user = await Account.findById(userId);
    if (user) {
      const existingQuizResult = user.quizResults.find(
        (result) => result.quizId.toString() === quizId
      );

      if (existingQuizResult) {
        if (percentageScore > existingQuizResult.score) {
          existingQuizResult.score = percentageScore;
        }
        existingQuizResult.totalQuestions = quiz.questions.length;
      } else {
        user.quizResults.push({
          quizId,
          score: percentageScore,
          totalQuestions: quiz.questions.length,
          date: new Date(),
        });
      }

      await user.save();
    }

    res
      .status(200)
      .json({ score: percentageScore, totalQuestions: quiz.questions.length });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: error.message });
  }
};
