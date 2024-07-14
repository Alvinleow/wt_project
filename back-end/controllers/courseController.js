const mongoose = require("mongoose");
const Course = require("../models/course");
const { storage } = require("../config/firebase");
const UserProgress = require("../models/userProgress");

const saveCourse = async (course, req, res) => {
  const { title, description, totalOfLessons } = req.body;

  if (title) course.title = title;
  if (description) course.description = description;
  if (totalOfLessons !== undefined) course.totalOfLessons = totalOfLessons;

  try {
    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Error saving course:", err);
    res.status(500).json({ message: "Failed to save course" });
  }
};

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
    console.log(
      `Deleting lesson with ID: ${lessonId} from course with ID: ${courseId}`
    );

    const course = await Course.findById(courseId);

    if (!course) {
      console.error(`Course with ID: ${courseId} not found`);
      return res.status(404).json({ message: "Course not found" });
    }

    console.log(`Course found: ${course.title}`);

    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );

    console.log(`Updated lessons count: ${course.lessons.length}`);

    course.totalOfLessons = course.lessons.length;

    await course.save();

    // Remove the lesson statuses for the deleted lesson
    await UserProgress.updateMany(
      { courseId: new mongoose.Types.ObjectId(courseId) },
      {
        $pull: {
          lessonStatuses: { lessonId: new mongoose.Types.ObjectId(lessonId) },
        },
      }
    );

    res.json({
      message: "Lesson deleted successfully",
      lessons: course.lessons,
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ message: "Server error" });
  }
};
