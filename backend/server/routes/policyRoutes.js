const express = require('express');
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} = require('../controllers/policyController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', protect, getPolicies);
router.get('/:id', protect, getPolicyById);
router.post('/', protect, createPolicy);
router.put('/:id', protect, updatePolicy);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deletePolicy);

module.exports = router;