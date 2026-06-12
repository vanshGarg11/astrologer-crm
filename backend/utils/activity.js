const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const recordActivity = async ({ type, message, entityType, entityId }) => {
  await Activity.create({ type, message, entityType, entityId });
};

const createNotification = async ({ title, message, type = 'info', entityType, entityId }) => {
  await Notification.create({ title, message, type, entityType, entityId });
};

module.exports = { createNotification, recordActivity };
