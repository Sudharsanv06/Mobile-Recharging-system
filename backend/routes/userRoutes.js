const express = require('express');
const {
  getProfile,
  updateBalance,
  getRechargeHistory,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/balance', protect, updateBalance);
router.get('/recharges', protect, getRechargeHistory);
router.get('/stats', protect, getUserStats);

module.exports = router;