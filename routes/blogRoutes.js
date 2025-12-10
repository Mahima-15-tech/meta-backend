// routes/blogRoutes.js
const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController.js");
const { upload } = require("../config/cloudinary");

const router = express.Router();

/* --- Count route first so 'count' is not treated as :id --- */
router.get("/count", async (req, res) => {
  try {
    const total = await require("../models/Blogs").countDocuments();
    res.json({ ok: true, total });
  } catch (err) {
    console.error("blog count error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

/* --- Public routes --- */
router.get("/", getAllBlogs);
/* plain :id route (validate ID inside controller) */
router.get("/:id", getBlogById);

/* --- Upload route --- */
router.post("/upload", upload.single("file"), (req, res) => {
  console.log("file received:", req.file);
  res.json({ url: req.file?.path });
});

/* --- Admin routes --- */
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
