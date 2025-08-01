const express = require('express');
const {
  getAllOperators,
  getOperatorById,
  addOperator
} = require('../controllers/operatorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllOperators);
router.get('/:id', getOperatorById);
router.post('/', protect, addOperator);

module.exports = router;