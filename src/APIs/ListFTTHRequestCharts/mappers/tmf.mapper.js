/**
 * ListFTTHRequestCharts Mapper – "tmf" dialect (bare JSON)
 *
 * 3010 is INTERNAL-BFF, not TMF-aligned. There is no TMF resource for
 * "FTTH request charts". The "tmf" name follows the project-wide
 * folder convention; this is a pass-through, not a TMF mapper.
 */

exports.toTmfResponse = (data) => {
  // Upstream payload returned as-is. If we need to reshape for the
  // "tmf" branch later, do it here.
  return data;
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});