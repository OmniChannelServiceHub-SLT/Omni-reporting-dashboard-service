const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// TMF637 canonical path (what CTK will hit)
router.get(
  '/tmf-api/productInventory/v4/product',
  controller.getProductDetail
);

// Legacy path (what the mobile app currently hits)
router.get(
  '/api/AccountOMNI/ProductDetailRequestV2',
  controller.getProductDetail
);

module.exports = router;