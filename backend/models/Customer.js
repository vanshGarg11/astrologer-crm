const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true },
    phone: { type: String, required: [true, 'Phone is required.'], match: [/^\d{10}$/, 'Phone must be 10 digits.'] },
    email: { type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.'] },
    dob: { type: Date, required: [true, 'Date of birth is required.'] },
    city: { type: String, required: [true, 'City is required.'], trim: true },
  },
  { timestamps: true },
);

customerSchema.index({ name: 1 });
customerSchema.index({ city: 1 });

customerSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.dob = ret.dob ? ret.dob.toISOString().slice(0, 10) : ret.dob;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Customer', customerSchema);
