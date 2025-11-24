const express = require('express');
const router = express.Router();

// Minimal notification routes stub
router.get('/', (req, res) => {
  res.json({ success: true, message: 'notification routes placeholder' });
});

module.exports = router;
