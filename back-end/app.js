const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const Account = require("./models/account");

const saltRounds = 10;

connectDB()
  .then(async () => {
    try {
      const adminUsername = "Admin";
      const adminEmail = "admin@gmail.com";

      let account = await Account.findOne({ email: adminEmail });

      if (!account) {
        const hashedPassword = await bcrypt.hash("admin12345", saltRounds);

        account = new Account({
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          accountLevel: 1,
        });

        await account.save();
        console.log("Default admin account created successfully.");
      } else {
        console.log("Default admin account already exists.");
      }
    } catch (err) {
      console.error("Error creating default admin account:", err);
    }

    const app = express();

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
    app.use("/api/userProgress", require("./routes/userProgress"));
    app.use("/api/quizzes", require("./routes/quiz"));

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
