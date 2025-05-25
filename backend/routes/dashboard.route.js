const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const Purchase = require('../models/purchase.model');
const Transfer = require('../models/transfer.model');
const Assignment = require('../models/assignment.model');
const Expenditure = require('../models/expenditure.model');
const Asset = require('../models/asset.model');

// /api/dashboard/metrics?baseId=<id>&date=<ISO>
router.get('/metrics', authenticate, async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const date = new Date(req.query.date || Date.now());
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    if (!baseId) return res.status(400).json({ message: 'baseId is required' });

    // Closing Balance (from current assets at base)
    const closingAssets = await Asset.find({ baseId });
    const closingBalance = closingAssets.reduce((sum, a) => sum + (a.quantity || 0), 0);

    // Purchases today
    const purchases = await Purchase.aggregate([
      { $match: { baseId: { $eq: baseId }, date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const purchaseQty = purchases[0]?.total || 0;

    // Transfers IN
    const transferIn = await Transfer.aggregate([
      { $match: { toBaseId: baseId, date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const transferInQty = transferIn[0]?.total || 0;

    // Transfers OUT
    const transferOut = await Transfer.aggregate([
      { $match: { fromBaseId: baseId, date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const transferOutQty = transferOut[0]?.total || 0;

    // Assignments today
    const assignments = await Assignment.aggregate([
      { $match: { baseId: baseId, date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const assignedQty = assignments[0]?.total || 0;

    // Expenditures today
    const expenditures = await Expenditure.aggregate([
      { $match: { baseId: baseId, date: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const expendedQty = expenditures[0]?.total || 0;

    // Opening = Closing - Purchases - TransferIn + TransferOut + Assigned + Expended
    const openingBalance = closingBalance - purchaseQty - transferInQty + transferOutQty + assignedQty + expendedQty;

    res.json({
      baseId,
      date: startOfDay.toISOString(),
      openingBalance,
      closingBalance,
      netMovement: purchaseQty + transferInQty - transferOutQty,
      purchases: purchaseQty,
      transferIn: transferInQty,
      transferOut: transferOutQty,
      assigned: assignedQty,
      expended: expendedQty
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to compute metrics' });
  }
});

module.exports = router;
