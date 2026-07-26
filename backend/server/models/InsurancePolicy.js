const mongoose = require('mongoose');

const insurancePolicySchema = new mongoose.Schema(
  {
    holder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyNumber: { type: String, required: true },
    provider: { type: String, required: true },
    coverageType: { type: String, required: true },
    premium: { type: Number },
    startDate: { type: Date, required: true },
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

module.exports = mongoose.model('InsurancePolicy', insurancePolicySchema);