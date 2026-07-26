const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema(
  {
    holder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    licenseType: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    issuingAuthority: { type: String },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expiring-soon', 'expired', 'pending-verification'],
      default: 'active',
    },
    documentUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('License', licenseSchema);