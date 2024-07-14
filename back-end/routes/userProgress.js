const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgressController");

router.get("/:userId/:courseId", userProgressController.getUserProgress);
router.get("/:userId", userProgressController.fetchUserProgress);
router.put("/", userProgressController.updateUserProgress);

module.exports = router;
