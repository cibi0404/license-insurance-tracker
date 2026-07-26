const express = require('express');
const router = express.Router();
const {
  getLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
} = require('../controllers/licenseController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', protect, getLicenses);
router.get('/:id', protect, getLicenseById);
router.post('/', protect, createLicense);
router.put('/:id', protect, updateLicense);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteLicense);

module.exports = router;