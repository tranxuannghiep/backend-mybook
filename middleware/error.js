const catchError = (err, req, res, next) => {
  // xu li cac error

  //err validation mongoose
  if (err.name === "ValidationError") {
    const { errors } = err;
    const keys = Object.keys(errors);
    const errorObj = {};
    keys.forEach((key) => {
      errorObj[key] = errors[key].message;
      if (errors[key].kind === "enum") {
        errorObj[key] = "Invalid enum value";
      }
    });
    err.statusCode = 400;
    err.message = errorObj;
  }
  // bad objectId
  if (err.kind === "ObjectId") {
    err.statusCode = 400;
    err.message = "Invalid Id";
  }
  // dupplicate field
  if (err.code === 11000) {
    err.statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    err.message = `${field} is dupplicated`;
  }
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Error!",
  });
};

module.exports = catchError;
