const Joi = require("joi");

const schemas = {
  loginModel: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  signUpModel: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().required(),
  }),
  // reviewModel: Joi.object().keys({
  //   review: Joi.object()
  //     .required()
  //     .keys({
  //       enviromentReview: Joi.string().min(5).required(),
  //       amenitiesReview: Joi.string().min(5).required(),
  //     }),
  //   apartment: Joi.object()
  //     .required()
  //     .keys({
  //       address: Joi.string().min(5).required(),
  //       country: Joi.string().required(),
  //       state: Joi.string().required(),
  //       location: Joi.array().required()
  //     }),
  // }),
  reviewModel: Joi.object().keys({
    address: Joi.string().min(5).required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    location: Joi.array().required(),
    enviromentReview: Joi.string().min(5).required(),
    amenitiesReview: Joi.string().min(5).required(),
  }),
};

module.exports = schemas;
