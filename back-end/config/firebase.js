const admin = require("firebase-admin");
const serviceAccount = require("./sololeveling-eb695-firebase-adminsdk-dbyid-46b4a955e6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sololeveling-eb695.appspot.com",
});

const storage = admin.storage().bucket();

module.exports = { storage };
