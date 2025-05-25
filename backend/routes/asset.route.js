const express = require('express');
const router = express.Router();
const Asset = require('../models/asset.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Create a new asset (admin only)
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, type, serialNumber, quantity, baseId } = req.body;
    const asset = await Asset.create({ name, type, serialNumber, quantity, baseId });
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create asset' });
  }
});

// Get all assets
router.get('/', authenticate, async (req, res) => {
  const assets = await Asset.find().populate('baseId', 'name location');
  res.json(assets);
});

module.exports = router;
