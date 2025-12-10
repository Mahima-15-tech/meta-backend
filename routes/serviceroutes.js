// routes/serviceroutes.js
const express = require("express");
const { upload } = require("../config/cloudinary");
const verifyToken = require("../middlewares/authMiddleware");

const {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController.js");

const router = express.Router();

/* --- Count route first --- */
router.get("/count", async (req, res) => {
  try {
    const total = await require("../models/service").countDocuments();
    res.json({ ok: true, total });
  } catch (err) {
    console.error("service count error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

/* --- Public routes --- */
router.get("/", getAllServices);
router.get("/:slug", getServiceBySlug);

/* --- Upload route (protected) --- */
router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  res.json({ url: req.file.path });
});

/* --- CRUD routes (protected) --- */
router.post("/", verifyToken, createService);
router.put("/:slug", verifyToken, updateService);
router.delete("/:slug", verifyToken, deleteService);

module.exports = router;
