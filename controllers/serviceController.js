// controllers/serviceController.js
const Service = require('../models/service.js');

// Get all services (list view)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().select('slug title text image icon');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single service by slug (detail view)
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new service
// Create a new service
exports.createService = async (req, res) => {
    try {
      console.log("🎯 CreateService called with body:", req.body);
      const newService = new Service(req.body);
      await newService.save();
      console.log("✅ Service saved:", newService);
      res.status(201).json(newService);
    } catch (err) {
      console.error("❌ CreateService error:", err);
      res.status(400).json({ error: err.message });
    }
  };
  

// Update service by slug
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete service by slug
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
