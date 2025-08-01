const express = require('express');
const {
  createRecharge,
  getRechargeHistory,
  getRechargeById
} = require('../controllers/rechargeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createRecharge);
router.get('/', protect, getRechargeHistory);
router.get('/:id', protect, getRechargeById);

module.exports = router;