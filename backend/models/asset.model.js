const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Weapon, Vehicle
  serialNumber: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'assigned', 'expended'], default: 'available' },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true }
});

module.exports = mongoose.model('Asset', assetSchema);
