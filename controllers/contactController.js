// controllers/contactController.js
const Contact = require("../models/Contact");
const validator = require("validator");

/**
 * POST /api/contact
 * Create a contact message
 */
exports.submitContact = async (req, res) => {
  try {
    const { name = "", email = "", phone = "", message = "", honeypot = "" } = req.body || {};

    // Honeypot - silently accept
    if (honeypot && honeypot.trim().length > 0) {
      return res.status(200).json({ ok: true, note: "spam detected" });
    }

    // Validation
    const errors = [];
    if (!name || !String(name).trim()) errors.push("Name is required");
    if (!email || !validator.isEmail(String(email))) errors.push("A valid email is required");
    if (!message || String(message).trim().length < 10) errors.push("Message must be at least 10 characters");

    if (errors.length) {
      return res.status(400).json({ ok: false, error: errors.join(", ") });
    }

    const contact = new Contact({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : "",
      message: String(message).trim(),
      ip: req.ip || (req.headers["x-forwarded-for"] || "").split(",").shift(),
      userAgent: req.get("User-Agent") || "",
    });

    await contact.save();

    return res.status(201).json({ ok: true, message: "Received", id: contact._id });
  } catch (err) {
    console.error("contact submit error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

/**
 * GET /api/contact
 * List contact entries (with simple pagination & filter)
 * Query params: page, limit, q (search), handled (true/false)
 */
exports.listContacts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit || "20")));
    const q = (req.query.q || "").trim();
    const handled = req.query.handled;

    const filter = {};
    if (handled === "true") filter.handled = true;
    if (handled === "false") filter.handled = false;

    if (q) {
      // basic text search across name, email, message
      filter.$or = [
        { name: new RegExp(escapeRegex(q), "i") },
        { email: new RegExp(escapeRegex(q), "i") },
        { message: new RegExp(escapeRegex(q), "i") },
      ];
    }

    const total = await Contact.countDocuments(filter);
    const docs = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      ok: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: docs,
    });
  } catch (err) {
    console.error("listContacts error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

/**
 * GET /api/contact/:id
 * Get single contact
 */
exports.getContact = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findById(id).lean();
    if (!contact) return res.status(404).json({ ok: false, error: "Not found" });
    return res.json({ ok: true, data: contact });
  } catch (err) {
    console.error("getContact error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

/**
 * PATCH /api/contact/:id
 * Partial update (e.g., mark handled)
 * Body: { handled?: boolean, note?: string }
 */
exports.updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = {};
    if (typeof req.body.handled !== "undefined") updates.handled = !!req.body.handled;
    if (typeof req.body.note !== "undefined") updates.note = String(req.body.note).slice(0, 2000);

    if (!Object.keys(updates).length) {
      return res.status(400).json({ ok: false, error: "No updates provided" });
    }

    const contact = await Contact.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    if (!contact) return res.status(404).json({ ok: false, error: "Not found" });

    return res.json({ ok: true, data: contact });
  } catch (err) {
    console.error("updateContact error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

/**
 * DELETE /api/contact/:id
 */
exports.deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findByIdAndDelete(id).lean();
    if (!contact) return res.status(404).json({ ok: false, error: "Not found" });
    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteContact error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

/* helpers */
function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
