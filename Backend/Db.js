require("dotenv").config();
const mongoose = require("mongoose");
const dbServerUrl = process.env.DB_SERVER_URL;
const liveServerUrl = process.env.DB_LIVE_SERVER_URL;
const db = mongoose.connection;

mongoose.connect(liveServerUrl);

db.on("connected", () => {
  console.log("connected to database");
});

db.on("disconnected", () => {
  console.log("disconnected with database");
});

db.on("error", () => {
  console.log("error with database");
});

module.exports = db;
