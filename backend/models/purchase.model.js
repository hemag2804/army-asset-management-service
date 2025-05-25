const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
