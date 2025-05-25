const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  transferredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transfer', transferSchema);
