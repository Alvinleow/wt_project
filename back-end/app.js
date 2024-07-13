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
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Routes
app.use("/api/accounts", require("./routes/account"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/courses", require("./routes/course"));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));