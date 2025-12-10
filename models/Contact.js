// models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  phone: { type: String, trim: true, maxlength: 50 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  ip: { type: String },
  userAgent: { type: String },
  spamScore: { type: Number, default: 0 },
  handled: { type: Boolean, default: false },
  source: { type: String, default: "contact-form" },

}, {
  timestamps: true
});

module.exports = mongoose.model("Contact", ContactSchema);
