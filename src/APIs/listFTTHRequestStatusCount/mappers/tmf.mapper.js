/**
 * GetFTTHRequestStatusCount Mapper – "tmf" dialect (bare JSON)
 *
 * 3010 is INTERNAL-BFF, not TMF-aligned. There is no TMF resource for
 * "FTTH request status count". The "tmf" side here means bare JSON with
 * no envelope — the file name follows the project-wide convention, but
 * this is NOT a TMF resource.
 *
 * If the team later decides 3010 should be TMF-shaped, this file becomes
 * the real mapper; right now it's a pass-through.
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