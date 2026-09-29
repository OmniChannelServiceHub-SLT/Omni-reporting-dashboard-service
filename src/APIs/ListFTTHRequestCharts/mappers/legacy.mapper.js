/**
 * ListFTTHRequestCharts Mapper – Legacy Dialect
 * Standard {isSuccess, errorMessege, dataBundle, ...} envelope.
 * No CSV row exists for this endpoint — shape provisional.
 */

exports.toLegacyResponse = (data) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: data,
  errorShow: null,
  errorCode: null
});

exports.toLegacyError = (err) => ({
  isSuccess: false,
  errorMessege: err.message,
  exceptionDetail: null,
  dataBundle: null,
  errorShow: err.message,
  errorCode: err.code || 'ERROR'
});