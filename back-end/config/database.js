const mongoose = require("mongoose");

const uri =
  "mongodb+srv://alvinleow020816:alvinleow020816@sololevelingdb.zo6hscl.mongodb.net/SoloLevelingDB?retryWrites=true&w=majority";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = {
  connectDB,
};
