const axios = require('axios');

/**
 * Proxies to the upstream that owns FTTH request status counts.
 *
 * TODO: confirm upstream host and path. Placeholder path assumes a GET
 * that returns counts (shape TBD). Adjust when real upstream is known.
 */
exports.getRequestStatusCount = async (filters = {}) => {
  const baseUrl = process.env.UPSTREAM_FTTH_BASE_URL;
  if (!baseUrl) {
    const err = new Error('UPSTREAM_FTTH_BASE_URL is not configured');
    err.statusCode = 502;
    err.code = 'UPSTREAM_NOT_CONFIGURED';
    throw err;
  }

  try {
    const response = await axios.get(`${baseUrl}/GetFTTHRequestStatusCount`, {
      params: filters,
      timeout: 10000
    });
    return response.data;
  } catch (err) {
    const upstreamErr = new Error(
      `Upstream FTTH status count failed: ${err.message}`
    );
    upstreamErr.statusCode = err.response?.status || 502;
    upstreamErr.code = 'UPSTREAM_ERROR';
    throw upstreamErr;
  }
};