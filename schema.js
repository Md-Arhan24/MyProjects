const Joi = require("joi");

module.exports.listingValidate = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  category:Joi.string(),
  
});
module.exports.listingValidateWithId = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  _id : Joi.string().required(),
  
});

module.exports.reviewValidate = Joi.object({
    comment: Joi.string().required(),
  range: Joi.number().required().min(1).max(5),
});
