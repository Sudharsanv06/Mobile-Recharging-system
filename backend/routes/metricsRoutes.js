const express = require('express');
const router = express.Router();

// Simple in-memory metrics middleware and router used for dev/testing.
function trackMetrics(req, res, next) {
  // attach a placeholder metrics object (no-op)
  req.metrics = req.metrics || {};
  next();
}

router.get('/metrics', (req, res) => {
  res.json({ success: true, message: 'metrics endpoint placeholder' });
});

module.exports = {
  trackMetrics,
  router,
};
