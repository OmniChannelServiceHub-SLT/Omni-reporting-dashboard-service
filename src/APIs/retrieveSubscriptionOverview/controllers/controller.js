const service = require('../services/service');

/**
 * Maps a legacy product/subscription payload to a TMF637 Product.
 * All CTK mandatory attributes are guaranteed present:
 *   billingAccount, href, id, productCharacteristic, productOffering,
 *   relatedParty, status
 *
 * Adjust the field-name candidates below once the real legacy response
 * shape is confirmed.
 */
function mapLegacyProductToTmf(product, accountNo, telephoneNo) {
  const pick = (...keys) => {
    for (const k of keys) {
      if (product[k] !== undefined && product[k] !== null && product[k] !== '') {
        return product[k];
      }
    }
    return undefined;
  };

  const productId = String(
    pick('id', 'productId', 'serviceId', 'subscriberID') ??
      accountNo ??
      telephoneNo ??
      'unknown-product'
  );

  const statusRaw = String(pick('status', 'state', 'serviceStatus') || 'active').toLowerCase();
  const statusMap = {
    active: 'active',
    inactive: 'inactive',
    suspended: 'suspended',
    terminated: 'terminated',
    pending: 'pending',
    created: 'created'
  };
  const status = statusMap[statusRaw] || 'active';

  // Build productCharacteristic[] from whatever the legacy payload exposes.
  const characteristic = [];
  const pushChar = (name, value) => {
    if (value !== undefined && value !== null && value !== '') {
      characteristic.push({ name, value: String(value) });
    }
  };
  pushChar('telephoneNo', telephoneNo);
  pushChar('speed', pick('speed', 'bandwidth', 'downloadSpeed'));
  pushChar('packageName', pick('packageName', 'productName', 'package'));
  pushChar('quota', pick('quota', 'dataQuota', 'usageQuota'));
  pushChar('validity', pick('validity', 'validityPeriod'));

  // TMF637 wants at least one productCharacteristic for CTK.
  if (characteristic.length === 0) {
    characteristic.push({ name: 'productId', value: productId });
  }

  return {
    id: productId,
    href: `/tmf-api/productInventory/v4/product/${encodeURIComponent(productId)}`,
    '@type': 'Product',
    '@baseType': 'Product',
    '@schemaLocation': null,

    // CTK-required fields
    status,
    productOffering: {
      id: String(pick('packageId', 'offeringId', 'productOfferingId') ?? productId),
      href: `/tmf-api/productCatalogManagement/v4/productOffering/${encodeURIComponent(
        String(pick('packageId', 'offeringId', 'productOfferingId') ?? productId)
      )}`,
      name: pick('packageName', 'productName', 'package') || 'Unknown Offering'
    },
    productCharacteristic: characteristic,
    relatedParty: [
      {
        id: String(pick('nic', 'customerId', 'subscriberID') ?? 'unknown-customer'),
        role: 'Customer',
        '@referredType': 'Individual'
      }
    ],
    billingAccount: {
      id: String(accountNo ?? 'unknown-account'),
      href: `/tmf-api/accountManagement/v4/billingAccount/${encodeURIComponent(
        String(accountNo ?? 'unknown-account')
      )}`,
      '@referredType': 'BillingAccount'
    },

    // Optional
    name: pick('productName', 'packageName', 'package'),
    description: pick('description'),
    isBundle: false,
    isCustomerVisible: true
  };
}

exports.getProductDetail = async (req, res, next) => {
  try {
    const telephoneNo = req.query.telephoneNo || req.query.TelephoneNo;
    const accountNo = req.query.accountNo || req.query.AccountNo;

    if (!accountNo && !telephoneNo) {
      return res.status(400).json({
        code: 'MISSING_PARAMETER',
        reason: 'accountNo or telephoneNo is required',
        message: 'Either accountNo or telephoneNo query parameter is required',
        status: 400
      });
    }

    const upstream = await service.getProductDetail({ telephoneNo, accountNo });

    const product = upstream.dataBundle || upstream.data || upstream;

    const isTmf = req.path.startsWith('/tmf-api');

    const resource = mapLegacyProductToTmf(product, accountNo, telephoneNo);

    if (isTmf) {
      return res.status(200).json(resource);
    }

    return res.status(200).json({
      isSuccess: true,
      errorMessege: null,
      exceptionDetail: null,
      dataBundle: resource,
      errorShow: null,
      errorCode: null
    });
  } catch (err) {
    next(err);
  }
};