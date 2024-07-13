const Account = require("../models/account");
const { storage } = require("../config/firebase");
const { ObjectId } = require("mongoose").Types;

async function saveAccount(account, req, res) {
  account.username = req.body.username || account.username;

  try {
    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (err) {
    console.error("Error saving account:", err);
    res.status(400).json({ message: err.message });
  }
}

exports.getAllAccounts = async (req, res) => {
  try {
    console.log("Fetching all accounts");
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAccountByID = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAccount = async (req, res) => {
  const { username, email, password, completedCourses, accountLevel } =
    req.body;

  const account = new Account({
    username,
    email,
    password, // No hashing here
    completedCourses,
    accountLevel,
    profilePicUrl:
      "https://img.icons8.com/ios-filled/100/ffffff/user-male-circle.png",
  });

  try {
    console.log("Creating a new account:", account);
    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.loginAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({ message: "Login successful", account });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    console.log("Received form data:", req.body);
    console.log("Received file:", req.file);

    if (req.file) {
      const blob = storage.file(`profile_pics/${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Blob stream error:", err);
        res.status(500).json({ message: "Failed to upload profile picture" });
      });

      blobStream.on("finish", async () => {
        const profilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          storage.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;
        account.profilePicUrl = profilePicUrl;
        await saveAccount(account, req, res);
      });

      blobStream.end(req.file.buffer);
    } else {
      await saveAccount(account, req, res);
    }
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await account.deleteOne();
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: err.message });
  }
};

// Verify password
exports.verifyPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const account = await Account.findById(req.params.id);
=======
exports.enrollInCourse = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const courseId = new ObjectId(req.body.courseId);

    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (!account.enrolledCourses.includes(courseId)) {
      account.enrolledCourses.push(courseId);
    }

    await account.save();
    res.json({ message: "Enrolled in course", account });
  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const courseId = new ObjectId(req.body.courseId);

    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({ success: true, message: "Password verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
    account.enrolledCourses = account.enrolledCourses.filter(
      (id) => !id.equals(courseId)
    );
    await account.save();
    res.json({ message: "Unenrolled from course", account });
  } catch (err) {
    console.error("Error unenrolling from course:", err);
    res.status(500).json({ message: err.message });
  }
};
