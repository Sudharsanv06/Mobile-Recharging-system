const express = require('express');
const router = express.Router();

// Minimal admin routes stub
router.get('/', (req, res) => {
  res.json({ success: true, message: 'admin routes placeholder' });
});

module.exports = router;
