const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const { connectDB } = require("./config/database");

// Connect to database
connectDB().catch((err) => {
  console.error(err);
  process.exit(1); // Exit the application if the database connection fails
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Routes
app.use("/api/accounts", require("./routes/account"));
// app.use("/api/courses", require("./routes/course"));
// app.use("/api/feedback", require("./routes/feedback"));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
