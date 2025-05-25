const express = require('express');
const router = express.Router();
const MovementLog = require('../models/movementLog.model');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Get logs (Admin only)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const logs = await MovementLog.find()
      .sort({ timestamp: -1 })
      .populate('userId', 'name role');

    res.json(logs || []);
  } catch (err) {
    console.error('Error fetching movement logs:', err); // Helpful during development
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
});


module.exports = router;
