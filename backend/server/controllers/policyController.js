const InsurancePolicy = require('../models/InsurancePolicy');
const { syncExpiryStatuses, computeInitialStatus } = require('../utils/statusSync');

// GET /api/policies
const getPolicies = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'Employee') {
      filter.holder = req.user._id;
    }

    await syncExpiryStatuses(InsurancePolicy, filter);

    const policies = await InsurancePolicy.find(filter).populate('holder', 'name email role');
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/policies/:id
const getPolicyById = async (req, res) => {
  try {
    await syncExpiryStatuses(InsurancePolicy, { _id: req.params.id });
    const policy = await InsurancePolicy.findById(req.params.id).populate('holder', 'name email role');

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role === 'Employee' && policy.holder._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this policy' });
    }

    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/policies
const createPolicy = async (req, res) => {
  try {
    const { policyNumber, provider, coverageType, premium, startDate, expiryDate } = req.body;

    const policy = await InsurancePolicy.create({
      holder: req.user._id,
      policyNumber,
      provider,
      coverageType,
      premium,
      startDate,
      expiryDate,
      status: computeInitialStatus(expiryDate),
    });

    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/policies/:id
const updatePolicy = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role === 'Employee' && policy.holder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this policy' });
    }

    const updates = { ...req.body };
    if (updates.expiryDate && updates.status !== 'pending-verification') {
      updates.status = computeInitialStatus(updates.expiryDate);
    }

    const updated = await InsurancePolicy.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/policies/:id
const deletePolicy = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role === 'Employee' && policy.holder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this policy' });
    }

    await InsurancePolicy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
