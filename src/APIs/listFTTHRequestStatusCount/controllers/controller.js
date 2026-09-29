const service = require('../services/service');
const mappers = require('../mappers');

exports.getStatusCount = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    // Pass through whatever filters the legacy client sent.
    const filters = { ...req.query };

    const data = await service.getRequestStatusCount(filters);

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(data)
        : mapper.toLegacyResponse(data);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};