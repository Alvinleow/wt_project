const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    completedCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
    },
    enrolledCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
    },
    accountLevel: {
      type: Number,
      required: true,
      default: 0, // 0 for user, 1 for admin
    },
    profilePicUrl: {
      type: String,
      default:
        "https://img.icons8.com/ios-filled/100/ffffff/user-male-circle.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", AccountSchema);
