const express = require('express');
const router = express.Router();

// Minimal favorite routes stub
router.get('/', (req, res) => {
  res.json({ success: true, message: 'favorite routes placeholder' });
});

module.exports = router;
