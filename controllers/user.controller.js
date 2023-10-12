const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../middleware/appError");
const joi = require("joi");

const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    const error = appError.create("Please provide all required fields", 400);
    return next(error);
  }

  const schema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const error = appError.create(result.error.message, 400);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign(
    { id: user._id, username, email },
    process.env.JWT_SECRET
  );

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(201)
    .send("user created");
});

const login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const error = appError.create("Please provide username and password", 400);
    return next(error);
  }

  const user = await User.findOne({ username });
  if (!user) {
    const error = appError.create("Invalid credentials", 400);
    return next(error);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = appError.create("Invalid credentials", 400);
    return next(error);
  }

  const token = jwt.sign(
    { id: user._id, username, email: user.email },
    process.env.JWT_SECRET
  );

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .send("user logged in");
});
const logout = asyncWrapper(async (req, res, next) => {
  res.clearCookie("accessToken").send("user logged out");
});

module.exports = {
  register,
  login,
  logout,
};
