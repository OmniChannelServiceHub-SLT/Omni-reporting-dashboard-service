/**
 * Check if the request path is a TMF-compliant endpoint.
 * @param {string} path - Express req.path
 * @returns {boolean}
 */
exports.isTmfPath = (path) => {
  return path.startsWith('/tmf-api/');
};