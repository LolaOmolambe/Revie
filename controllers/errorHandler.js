const { errorResponse, successResponse } = require("../utility/response");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  new AppError("Your token has expired! Please log in again.", 401);
};

const sendErrorDev = (err, req, res) => {
    //console.log(err.message);
    //console.log(err.isOperational);
  return errorResponse(res, err.statusCode, err.message, err.stack);
 
};

const sendErrorProd = (err, req, res) => {
  // A) API
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return errorResponse(res, err.statusCode, message, null);
    // return res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    // });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return errorResponse(res, 500, "Oops, Something went wrong", null);
  //   return res.status(500).json({
  //     status: "error",
  //     message: "Something went very wrong!",
  //   });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  //err.status = err.status || "error";
  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
