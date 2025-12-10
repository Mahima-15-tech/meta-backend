const Blog = require("../models/Blogs.js");

// Create new blog (admin)
// Create new blog (admin)
exports.createBlog = async (req, res) => {
  try {
    const { title, cat, excerpt, content, tags, featured, cover, author } = req.body;

    // Ensure cover exists
    if (!cover) return res.status(400).json({ message: "Cover image is required" });

    const blog = await Blog.create({
      title,
      cat,
      excerpt,
      content,
      tags,
      featured,
      cover,
      author: author || "Admin", // default author if not provided
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update blog (admin)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete blog (admin)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
