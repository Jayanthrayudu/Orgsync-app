const Joi = require('joi');

const validateOrganization = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    slug: Joi.string().min(3).max(100).required(),
    organizationSLUG: Joi.string().min(3).max(100).optional(),
    primaryAdminName: Joi.string().min(2).max(255).required(),
    primaryAdminEmail: Joi.string().email().required(),
    supportEmail: Joi.string().email().required(),
    phoneNo: Joi.string().max(20).allow(''),
    maxCoordinatorsAllowed: Joi.number().integer().min(1).max(50).default(5),
    alternatePhoneNo: Joi.string().max(20).allow(''),
    timezone: Joi.string().max(100).default('Asia/Kolkata'),
    language: Joi.string().valid('English', 'Hindi', 'Tamil').default('English'),
    officialWebsiteURL: Joi.string().uri().max(500).allow(''),
    logo: Joi.string().max(500).allow(''),
    status: Joi.string().valid('Active', 'Inactive', 'Blocked').default('Active'),
    pendingRequests: Joi.number().integer().default(0)
  });

  return schema.validate(data);
};

const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('Admin', 'Co-ordinator').required(),
    organizationId: Joi.number().integer().required(),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
  });

  return schema.validate(data);
};

module.exports = { validateOrganization, validateUser };
