const mongoose = require('mongoose');

const movementLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['purchase', 'transfer', 'assignment', 'expenditure'] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  entityType: { type: String }, // Asset, Transfer, etc.
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MovementLog', movementLogSchema);
