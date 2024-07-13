const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Get all accounts
router.get("/", accountController.getAllAccounts);

// Get a single account by userID
router.get("/:id", accountController.getAccountByID);

// Register account
router.post("/", accountController.createAccount);

// Login
router.post("/login", accountController.loginAccount);

// Update an account
router.put(
  "/:id",
  upload.single("profilePic"),
  accountController.updateAccount
);

// Delete an account
router.delete("/:id", accountController.deleteAccount);

// Verify password
router.post("/:id/verify-password", accountController.verifyPassword);

router.put("/enroll/:userId", accountController.enrollCourse);
router.put("/unenroll/:userId", accountController.unenrollCourse);

module.exports = router;
