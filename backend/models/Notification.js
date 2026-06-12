const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' },
    read: { type: Boolean, default: false },
    entityType: { type: String, trim: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

notificationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
