const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const courseController = require("../controllers/courseController");

// Get all courses
router.get("/", courseController.getAllCourses);

// Get a single course by ID
router.get("/:id", courseController.getCourseByID);

// Create new course
router.post("/", upload.single("thumbnail"), courseController.createCourse);

// Update course
router.put("/:id", upload.single("thumbnail"), courseController.updateCourse);

// Delete course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
