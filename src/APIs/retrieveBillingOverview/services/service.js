const axios = require('axios');

/**
 * Fetches bill detail from the upstream legacy backend.
 * TMF678 mapping happens in the controller, not here.
 *
 * TODO: confirm UPSTREAM_ACCOUNT_BASE_URL and the real upstream path.
 */
exports.getBillDetail = async (params) => {
  const baseUrl = process.env.UPSTREAM_ACCOUNT_BASE_URL;
  if (!baseUrl) {
    const err = new Error('UPSTREAM_ACCOUNT_BASE_URL is not configured');
    err.statusCode = 502;
    err.code = 'UPSTREAM_NOT_CONFIGURED';
    throw err;
  }

  try {
    const response = await axios.get(`${baseUrl}/BillDetailRequest`, {
      params,
      timeout: 10000
    });
    return response.data;
  } catch (err) {
    const upstreamErr = new Error(
      `Upstream BillDetailRequest failed: ${err.message}`
    );
    upstreamErr.statusCode = err.response?.status || 502;
    upstreamErr.code = 'UPSTREAM_ERROR';
    throw upstreamErr;
  }
};