//const Joi = require("joi");
const AppError = require("./appError");

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      next(new AppError(message, 400));
    }
  };
};
module.exports = middleware;
