const admin = require("firebase-admin");

const serviceAccount = require("../utils/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fullecommerce-a01bb.firebaseio.com",
});

module.exports = admin;
