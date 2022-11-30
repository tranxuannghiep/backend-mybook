const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

exports.jwtAuth = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) throw new ApiError(401, "Unauthorized");
  const token = headerToken.split(" ")[1];
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
  const headerToken = req.headers.authorization;
  if (!headerToken) throw new ApiError(401, "Unauthorized");
  const token = headerToken.split(" ")[1];
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
