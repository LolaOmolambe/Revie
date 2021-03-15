const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  };
  
  const errorResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
      status: "error",
      message,
      data,
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse,
  };