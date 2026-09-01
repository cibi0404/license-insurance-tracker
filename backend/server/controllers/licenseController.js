const License = require('../models/License');
const { syncExpiryStatuses, computeInitialStatus } = require('../utils/statusSync');

// GET /api/licenses
const getLicenses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'Employee') {
      filter.holder = req.user._id;
    }

    await syncExpiryStatuses(License, filter);

    const licenses = await License.find(filter).populate('holder', 'name email role');
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/licenses/:id
const getLicenseById = async (req, res) => {
  try {
    await syncExpiryStatuses(License, { _id: req.params.id });
    const license = await License.findById(req.params.id).populate('holder', 'name email role');

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    if (req.user.role === 'Employee' && license.holder._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this license' });
    }

    res.json(license);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/licenses
const createLicense = async (req, res) => {
  try {
    const { licenseType, licenseNumber, issuingAuthority, issueDate, expiryDate } = req.body;

    const license = await License.create({
      holder: req.user._id,
      licenseType,
      licenseNumber,
      issuingAuthority,
      issueDate,
      expiryDate,
      status: computeInitialStatus(expiryDate),
    });

    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/licenses/:id
const updateLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    if (req.user.role === 'Employee' && license.holder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this license' });
    }

    const updated = await License.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/licenses/:id
const deleteLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    if (req.user.role === 'Employee' && license.holder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this license' });
    }

    await License.findByIdAndDelete(req.params.id);
    res.json({ message: 'License deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
};