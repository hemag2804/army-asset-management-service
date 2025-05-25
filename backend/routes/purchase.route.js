const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase.model');
const Asset = require('../models/asset.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Record a new purchase
router.post('/', authenticate, authorizeRoles('admin', 'logistics'), async (req, res) => {
  try {
    const { assetId, baseId, quantity } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    // Update asset quantity
    asset.quantity += quantity;
    await asset.save();

    // Create purchase record
    const purchase = await Purchase.create({
      assetId,
      baseId,
      quantity,
      purchasedBy: req.user.id
    });

    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to record purchase' });
  }
});

// Get purchase history (optional filters: base, type, date)
router.get('/', authenticate, async (req, res) => {
  const { baseId, type } = req.query;

  const filters = {};
  if (baseId) filters.baseId = baseId;

  try {
    const purchases = await Purchase.find(filters)
      .populate('assetId', 'name type serialNumber')
      .populate('baseId', 'name location')
      .populate('purchasedBy', 'name role')
      .sort({ date: -1 });

    // Optional filtering by asset type
    const result = type
      ? purchases.filter(p => p.assetId?.type === type)
      : purchases;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
});

module.exports = router;
