const express = require('express');
const router = express.Router();
const Transfer = require('../models/transfer.model');
const Asset = require('../models/asset.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { logMovement } = require('../utils/logger');

// Transfer asset between bases
router.post('/', authenticate, authorizeRoles('admin', 'commander'), async (req, res) => {
  try {
    const { assetId, fromBaseId, toBaseId, quantity } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (String(asset.baseId) !== fromBaseId)
      return res.status(400).json({ message: 'Asset is not currently at fromBaseId' });
    if (asset.quantity < quantity)
      return res.status(400).json({ message: 'Not enough quantity available' });

    // Decrease quantity at fromBase
    asset.quantity -= quantity;

    // Clone asset to destination base if not present
    const existingAtToBase = await Asset.findOne({ serialNumber: asset.serialNumber, baseId: toBaseId });

    if (existingAtToBase) {
      existingAtToBase.quantity += quantity;
      await existingAtToBase.save();
    } else {
      await Asset.create({
        name: asset.name,
        type: asset.type,
        serialNumber: asset.serialNumber,
        quantity,
        baseId: toBaseId,
        status: 'available'
      });
    }

    await asset.save();

    const transfer = await Transfer.create({
      assetId,
      fromBaseId,
      toBaseId,
      quantity,
      transferredBy: req.user.id
    });

    await logMovement({
        userId: req.user.id,
        action: 'transfer',
        entityId: transfer._id,
        entityType: 'Transfer',
        data: transfer
    });

    res.status(201).json(transfer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Transfer failed' });
  }
});

// Get transfer history
router.get('/', authenticate, async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate('assetId', 'name serialNumber type')
      .populate('fromBaseId', 'name')
      .populate('toBaseId', 'name')
      .populate('transferredBy', 'name role')
      .sort({ date: -1 });

    res.json(transfers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transfer history' });
  }
});

module.exports = router;
