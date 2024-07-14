const UserProgress = require("../models/userProgress");

exports.getUserProgress = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const userProgress = await UserProgress.findOne({ userId, courseId });
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.json(userProgress);
  } catch (err) {
    console.error("Error fetching user progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchUserProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    const userProgresses = await UserProgress.find({ userId });
    if (!userProgresses.length) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.json(userProgresses);
  } catch (err) {
    console.error("Error fetching user progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProgress = async (req, res) => {
  const { userId, courseId, lessonId, status } = req.body;
  console.log("Request body:", req.body);

  try {
    let userProgress = await UserProgress.findOne({ userId, courseId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId, courseId, lessonStatuses: [] });
    }

    const lessonStatus = userProgress.lessonStatuses.find(
      (ls) => ls.lessonId.toString() === lessonId
    );
    if (lessonStatus) {
      lessonStatus.status = status;
    } else {
      userProgress.lessonStatuses.push({ lessonId, status });
    }

    await userProgress.save();
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
