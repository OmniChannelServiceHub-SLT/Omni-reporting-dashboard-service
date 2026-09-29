const express = require('express');
const router = express.Router();
const resolveClientType = require('../../../common/middleware/resolveClientType');
const controller = require('../controllers/controller');

// Path TBD — no CSV row exists. Placeholder uses the capability name;
// adjust to whatever the legacy client actually hits.
router.get(
  '/api/Dashboard/GetFTTHRequestCharts',
  resolveClientType,
  controller.getRequestCharts
);

module.exports = router;