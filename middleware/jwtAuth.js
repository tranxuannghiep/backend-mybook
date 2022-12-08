const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

exports.jwtAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token)
  if (!token) throw new ApiError(401, "Unauthorized");
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
};

exports.jwtAuthAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token)
  if (!token) throw new ApiError(401, "Unauthorized");
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") throw new ApiError(401, "Unauthorized");
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
};
