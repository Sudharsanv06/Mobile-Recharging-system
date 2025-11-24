const express = require('express');
const router = express.Router();

// Minimal payment routes stub
router.get('/', (req, res) => {
  res.json({ success: true, message: 'payment routes placeholder' });
});

module.exports = router;
