const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
  });


router.get('/admin-only', protect, authorize('Admin'), (req, res) => {
    res.json({ message: 'Welcome, Admin! You have special access.' });
  });
  
  
module.exports = router;