// models/service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: false },
  icon: { type: String, required: false },
  detail: {
    tag: String,
    heroImg: String,
    summary: String,
    metrics: [{ label: String, value: String }],
    trust: [String],
    toc: [{ id: String, label: String }],
    approachBlocks: [{ title: String, text: String, img: String }],
    process: [{ step: String, title: String, desc: String }],
    services: [{ icon: String, title: String, pts: [String] }],
    cases: [{ logo: String, title: String, img: String, bullets: [String] }],
    pricing: [{ title: String, desc: String, price: String, includes: [String] }],
    faqs: [{ q: String, a: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
