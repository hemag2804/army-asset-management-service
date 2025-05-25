const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment.model');
const Asset = require('../models/asset.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Assign asset
router.post('/', authenticate, authorizeRoles('admin', 'commander'), async (req, res) => {
  try {
    const { assetId, assignedTo, baseId, quantity } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset || asset.quantity < quantity) {
      return res.status(400).json({ message: 'Invalid asset or insufficient quantity' });
    }

    asset.quantity -= quantity;
    await asset.save();

    const assignment = await Assignment.create({
      assetId,
      assignedTo,
      baseId,
      quantity,
      assignedBy: req.user.id
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Assignment failed' });
  }
});

// View all assignments
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await Assignment.find()
      .populate('assetId', 'name serialNumber')
      .populate('assignedTo', 'name role')
      .populate('baseId', 'name')
      .populate('assignedBy', 'name');

    res.json(result || []); // always return a consistent type
  } catch (err) {
    console.error('Error fetching assignments:', err); // optional logging
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
});

module.exports = router;
