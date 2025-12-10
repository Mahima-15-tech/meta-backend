// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");

// Public - submit contact
router.post("/", controller.submitContact);

// Count all contacts (for dashboard)  <-- MUST be before '/:id'
router.get("/count", async (req, res) => {
  try {
    const total = await require("../models/Contact").countDocuments();
    res.json({ ok: true, total });
  } catch (err) {
    console.error("contact count error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Admin / listing (no auth - you can add middleware later)
router.get("/", controller.listContacts);

// Now ID-based routes (these come last so '/count' won't be captured as :id)
router.get("/:id", controller.getContact);
router.patch("/:id", controller.updateContact);
router.delete("/:id", controller.deleteContact);

module.exports = router;
