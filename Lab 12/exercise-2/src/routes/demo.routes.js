const express = require('express');
const { routeGuard } = require('../middleware/flow.middleware');

const router = express.Router();

router.get('/public', (req, res) => {
  res.json({
    message: 'Public route reached',
    flow: req.flow || []
  });
});

router.get('/secure', routeGuard, (req, res) => {
  res.json({
    message: 'Secure route reached after route middleware',
    flow: req.flow
  });
});

module.exports = router;
