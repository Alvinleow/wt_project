const mongoose = require("mongoose");
const Course = require("../models/course");
const quizController = require("./quizController");
const { storage } = require("../config/firebase");

async function saveCourse(course, req, res) {
  course.title = req.body.title || course.title;
  course.description = req.body.description || course.description;

  try {
    const savedCourse = await course.save();
    await quizController.generateQuizForCourse(savedCourse._id);
    res.json(savedCourse);
  } catch (err) {
    console.error("Error saving course:", err);
    res.status(400).json({ message: err.message });
  }
}

exports.getAllCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === "desc" ? -1 : 1;

    const courses = await Course.find().sort({ createdAt: sort }).limit(limit);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseByID = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const course = new Course({
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalOfLessons: 0,
    enrollment: 0,
  });

  try {
    if (req.file) {
      const blob = storage.file(`thumbnails/${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Blob stream error:", err);
        res.status(500).json({ message: "Failed to upload thumbnail" });
      });

      blobStream.on("finish", async () => {
        const thumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${
          storage.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;
        course.thumbnail = thumbnailUrl;
        await saveCourse(course, req, res);
      });

      blobStream.end(req.file.buffer);
    } else {
      await saveCourse(course, req, res);
    }
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.file) {
      const blob = storage.file(`thumbnails/${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Blob stream error:", err);
        res.status(500).json({ message: "Failed to upload thumbnail" });
      });

      blobStream.on("finish", async () => {
        const thumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${
          storage.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;
        course.thumbnail = thumbnailUrl;
        await saveCourse(course, req, res);
      });

      blobStream.end(req.file.buffer);
    } else {
      await saveCourse(course, req, res);
    }
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addLesson = async (req, res) => {
  const { title } = req.body;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(new mongoose.Types.ObjectId(courseId));
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.lessons.push({ title, content: "", status: "not viewed" });
    course.totalOfLessons = course.lessons.length;
    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Error adding lesson:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  const { content } = req.body;
  const { courseId, lessonId } = req.params;

  try {
    const course = await Course.findById(new mongoose.Types.ObjectId(courseId));
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.lessons.id(new mongoose.Types.ObjectId(lessonId));
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.content = content;

    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );
    await course.save();

    res.json({ lessons: course.lessons });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res
      .status(500)
      .json({ message: "Error deleting lesson", error: error.message });
  }
};
