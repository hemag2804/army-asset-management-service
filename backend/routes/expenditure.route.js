const express = require('express');
const router = express.Router();
const Expenditure = require('../models/expenditure.model');
const Asset = require('../models/asset.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Record expenditure
router.post('/', authenticate, authorizeRoles('admin', 'commander'), async (req, res) => {
  try {
    const { assetId, baseId, quantity, reason } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset || asset.quantity < quantity) {
      return res.status(400).json({ message: 'Invalid asset or insufficient quantity' });
    }

    asset.quantity -= quantity;
    if (asset.quantity === 0) asset.status = 'expended';
    await asset.save();

    const expenditure = await Expenditure.create({
      assetId,
      baseId,
      quantity,
      reason,
      expendedBy: req.user.id
    });

    res.status(201).json(expenditure);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Expenditure failed' });
  }
});

// View expenditures
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await Expenditure.find()
      .populate('assetId', 'name serialNumber')
      .populate('baseId', 'name')
      .populate('expendedBy', 'name');

    res.json(result || []); // Ensure a consistent response type
  } catch (err) {
    console.error('Error fetching expenditures:', err); // Optional for debugging
    res.status(500).json({ message: 'Failed to fetch expenditures', error: err.message });
  }
});

module.exports = router;
