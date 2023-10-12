const appError = require("./appError");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const error = appError.create("Please login to access this resource", 401);
    return next(error);
  }

  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        const error = appError.create("Invalid access token", 401);
        return next(error);
      }
      return decoded;
    }
  );
  req.user = decoded;
  next();
};

module.exports = verifyToken;
