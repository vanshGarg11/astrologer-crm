const mongoose = require('mongoose');

const astrologerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true },
    specialization: { type: String, required: [true, 'Specialization is required.'], trim: true },
    experience: { type: Number, required: [true, 'Experience is required.'], min: [1, 'Experience must be positive.'] },
    languages: { type: String, required: [true, 'Languages are required.'], trim: true },
    rating: { type: Number, required: [true, 'Rating is required.'], min: [1, 'Rating must be between 1 and 5.'], max: [5, 'Rating must be between 1 and 5.'] },
    phone: { type: String, required: [true, 'Phone is required.'], match: [/^\d{10}$/, 'Phone must be 10 digits.'] },
    email: { type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.'] },
    status: { type: String, enum: ['Active', 'Inactive'], required: [true, 'Status is required.'], trim: true, default: 'Active' },
    availableDays: {
      type: [String],
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    timeSlots: {
      type: [String],
      default: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      validate: {
        validator: (slots) => slots.every((slot) => /^([01]\d|2[0-3]):[0-5]\d$/.test(slot)),
        message: 'Time slots must use HH:MM format.',
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

astrologerSchema.index({ name: 1 });
astrologerSchema.index({ specialization: 1 });

astrologerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Astrologer', astrologerSchema);
