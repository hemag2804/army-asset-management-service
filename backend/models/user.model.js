const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'commander', 'logistics'] },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }
});

module.exports = mongoose.model('User', userSchema);
