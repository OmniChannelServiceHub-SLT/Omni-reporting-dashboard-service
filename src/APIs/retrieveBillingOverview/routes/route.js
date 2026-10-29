const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// TMF678 canonical path (what CTK will hit)
router.get(
  '/tmf-api/customerBillManagement/v4/customerBill',
  controller.getBillDetail
);

// Legacy path (what the mobile app currently hits)
router.get(
  '/api/AccountOMNI/BillDetailRequest',
  controller.getBillDetail
);

module.exports = router;