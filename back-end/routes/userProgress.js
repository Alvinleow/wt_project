const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgressController");

router.get("/:userId", userProgressController.getUserProgress);
router.put("/", userProgressController.updateUserProgress);

module.exports = router;
