const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: [true, 'Customer is required.'] },
    astrologerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Astrologer', required: [true, 'Astrologer is required.'] },
    consultationDate: { type: Date, required: [true, 'Consultation date is required.'] },
    consultationTime: { type: String, required: [true, 'Consultation time is required.'], match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM format.'] },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending', required: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

consultationSchema.index({ status: 1, consultationDate: 1, consultationTime: 1 });
consultationSchema.index({ customerId: 1, createdAt: -1 });
consultationSchema.index({ astrologerId: 1, createdAt: -1 });

consultationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.customer_id = ret.customerId?._id ? ret.customerId._id.toString() : ret.customerId?.toString();
    ret.astrologer_id = ret.astrologerId?._id ? ret.astrologerId._id.toString() : ret.astrologerId?.toString();
    ret.customer_name = ret.customerId?.name || null;
    ret.astrologer_name = ret.astrologerId?.name || null;
    ret.consultation_date = ret.consultationDate ? ret.consultationDate.toISOString().slice(0, 10) : ret.consultationDate;
    ret.consultation_time = ret.consultationTime;
    delete ret._id;
    delete ret.customerId;
    delete ret.astrologerId;
    delete ret.consultationDate;
    delete ret.consultationTime;
    return ret;
  },
});

module.exports = mongoose.model('Consultation', consultationSchema);
