const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  category: String,
  venue: String,
  mediaUrl: String, // Stores Cloudinary media URL
  attendees: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Event", EventSchema);
