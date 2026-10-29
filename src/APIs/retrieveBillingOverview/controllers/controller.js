const service = require('../services/service');

/**
 * Maps a legacy bill payload to a TMF678 CustomerBill.
 * All CTK mandatory attributes are guaranteed present:
 *   id, href, state, amountDue, billDate, paymentDueDate, billNo
 *
 * Adjust the field-name candidates below once the real legacy response
 * shape is confirmed — the `pick()` calls make that a one-line change
 * per field.
 */
function mapLegacyBillToTmf(bill, accountNo) {
  const pick = (...keys) => {
    for (const k of keys) {
      if (bill[k] !== undefined && bill[k] !== null && bill[k] !== '') {
        return bill[k];
      }
    }
    return undefined;
  };

  // TMF678 state lifecycle: new | onHold | validated | sent | partiallyPaid | settled
  const legacyState = String(pick('state', 'billStatus', 'status') || '').toLowerCase();
  const stateMap = {
    new: 'new',
    active: 'sent',
    issued: 'sent',
    sent: 'sent',
    paid: 'settled',
    settled: 'settled',
    partial: 'partiallyPaid',
    'partially paid': 'partiallyPaid',
    onhold: 'onHold',
    'on hold': 'onHold',
    validated: 'validated'
  };
  const state = stateMap[legacyState.replace(/\s/g, '')] || 'sent';

  const amountValue = Number(
    pick('amountDue', 'billAmount', 'totalAmount', 'amount', 'outstandingAmount') ?? 0
  );

  const billId = String(
    pick('id', 'billNo', 'billNumber', 'invoiceNo') ?? `${accountNo || 'unknown'}-bill`
  );

  const billDate =
    pick('billDate', 'bill_date', 'invoiceDate') || new Date().toISOString();
  const paymentDueDate =
    pick('paymentDueDate', 'dueDate', 'due_date') || new Date().toISOString();

  return {
    id: billId,
    href: `/tmf-api/customerBillManagement/v4/customerBill/${encodeURIComponent(billId)}`,
    '@type': 'CustomerBill',
    '@baseType': 'CustomerBill',
    '@schemaLocation': null,

    // CTK-required fields
    state,
    amountDue: {
      unit: pick('currency', 'currencyCode') || 'LKR',
      value: amountValue
    },
    billDate,
    paymentDueDate,
    billNo: String(pick('billNo', 'billNumber', 'invoiceNo') ?? billId),

    // Optional but useful
    billingAccount: accountNo
      ? {
          id: String(accountNo),
          href: `/tmf-api/accountManagement/v4/billingAccount/${encodeURIComponent(accountNo)}`,
          '@referredType': 'BillingAccount'
        }
      : undefined
  };
}

exports.getBillDetail = async (req, res, next) => {
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

    const upstream = await service.getBillDetail({ telephoneNo, accountNo });

    // The upstream may return the bill directly or under a wrapper.
    const bill = upstream.dataBundle || upstream.data || upstream;

    // TMF path → bare CustomerBill resource
    // Legacy path → keep the legacy envelope, but still TMF-shaped inside
    const isTmf = req.path.startsWith('/tmf-api');

    const resource = mapLegacyBillToTmf(bill, accountNo);

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