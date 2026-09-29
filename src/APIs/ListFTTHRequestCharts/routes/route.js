const express = require('express');
const router = express.Router();
const resolveClientType = require('../../../common/middleware/resolveClientType');
const controller = require('../controllers/controller');


router.get(
  '/api/Dashboard/GetFTTHRequestCharts',
  resolveClientType,
  controller.getRequestCharts
);

module.exports = router;