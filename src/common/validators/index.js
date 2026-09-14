const Joi = require('joi');

exports.individualIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Individual ID is required',
    'string.empty': 'Individual ID cannot be empty',
  }),
});

// You can also add a schema for the legacy query
exports.viewUserInfoQuerySchema = Joi.object({
  userName: Joi.string().required(),
});