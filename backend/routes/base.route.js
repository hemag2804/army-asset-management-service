const express = require('express');
const router = express.Router();
const Base = require('../models/base.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Create a new base (admin only)
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, location } = req.body;
    const base = await Base.create({ name, location });
    res.status(201).json(base);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create base', details: err.message });
  }
});


// Get all bases
router.get('/', authenticate, async (req, res) => {
  const bases = await Base.find();
  res.json(bases);
});

module.exports = router;
