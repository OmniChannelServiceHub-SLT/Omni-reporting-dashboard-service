
module.exports = (req, res, next) => {
  const contentType = req.get('Content-Type') || '';
  const accept = req.get('Accept') || '';



  console.log('\n🔍 [Middleware] Headers:');
  console.log('  Content-Type:', contentType);
  console.log('  Accept:', accept);

  // For POST/PATCH: check Content-Type
  if (req.method === 'POST' || req.method === 'PATCH') {
    if (contentType.includes('application/json')) {
      req.clientType = 'tmf';
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      req.clientType = 'legacy';
    } else {
      // Default to TMF for CTK compatibility
      req.clientType = 'tmf';
    }
  }
  // For GET: check Accept header
  else if (req.method === 'GET') {
    if (accept.includes('application/json')) {
      req.clientType = 'tmf';
    } else if (accept.includes('application/x-www-form-urlencoded')) {
      req.clientType = 'legacy';
    } else {
      // Default to TMF
      req.clientType = 'tmf';
    }
  }
  // For other methods (DELETE, etc.), default to TMF
  else {
    req.clientType = 'tmf';
  }

  
  next();
};