const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Customer Registered', 'Consultation Created', 'Consultation Updated', 'Astrologer Added', 'Customer Updated'],
      required: true,
    },
    message: { type: String, required: true, trim: true },
    entityType: { type: String, trim: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

activitySchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Activity', activitySchema);
