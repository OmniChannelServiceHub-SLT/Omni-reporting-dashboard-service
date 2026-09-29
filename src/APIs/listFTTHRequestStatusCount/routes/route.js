const express = require('express');
const router = express.Router();
const resolveClientType = require('../../../common/middleware/resolveClientType');
const controller = require('../controllers/controller');


router.get(
  '/api/Dashboard/GetFTTHRequestStatusCount',
  resolveClientType,
  controller.getStatusCount
);

module.exports = router;