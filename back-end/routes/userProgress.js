const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgressController");

router.get("/:userId/:courseId", userProgressController.getUserProgress);
router.put("/", userProgressController.updateUserProgress);

module.exports = router;
