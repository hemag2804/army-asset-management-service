const MovementLog = require('../models/movementLog.model');

exports.logMovement = async ({ userId, action, entityId, entityType, data }) => {
  try {
    await MovementLog.create({
      userId,
      action,
      entityId,
      entityType,
      data
    });
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};
