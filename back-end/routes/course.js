const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Create course
router.post("/", upload.single("thumbnail"), courseController.createCourse);

// Get all courses
router.get("/", courseController.getAllCourses);

// Get a single course by _id
router.get("/:id", courseController.getCourseByID);

// Update course
router.put("/:id", upload.single("thumbnail"), courseController.updateCourse);

// Delete course
router.delete("/:id", courseController.deleteCourse);

router.post("/:courseId/lessons", courseController.addLesson);
router.put("/:courseId/lessons/:lessonId", courseController.updateLesson);
router.delete("/:courseId/lessons/:lessonId", courseController.deleteLesson);

module.exports = router;
