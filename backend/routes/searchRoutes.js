const express = require('express');
const router = express.Router();

// Minimal search/plans routes stub
router.get('/', (req, res) => {
  res.json({ success: true, message: 'search/plans routes placeholder' });
});

module.exports = router;
