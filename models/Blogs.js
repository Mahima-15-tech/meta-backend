const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cat: { type: String, required: true },
    read: { type: String, default: "5 min" },
    views: { type: String, default: "0" },
    author: { type: String, required: true },
    date: { type: String, default: new Date().toLocaleDateString() },
    cover: { type: String, required: true },
    excerpt: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
