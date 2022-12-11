const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const catchAsync = require("../middleware/async");
const TokenSchema = require("../models/Token");
const UserSchema = require("../models/User");
const ApiError = require("../utils/ApiError");
const MailService = require("../utils/MailService");
const BookSchema = require("../models/Book");

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, repeatPassword, role, age, gender } = req.body;
  if (repeatPassword !== password) throw new ApiError(400, "Validate error")
  const user = await UserSchema.create({
    name,
    email,
    password,
    age,
    role,
    gender
  });
  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existedUser = await UserSchema.findOne({ email });
  if (!existedUser) throw new ApiError(400, "email or password is incorrect");
  const isMatch = bcrypt.compareSync(password, existedUser.password);
  if (!isMatch) throw new ApiError(400, "email or password is incorrect");

  const token = jwt.sign(
    {
      email: existedUser.email,
      name: existedUser.name,
      role: existedUser.role,
      id: existedUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false
  })
  return res.json({
    success: true,
    role: existedUser.role,
    id: existedUser._id
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) throw new ApiError(404, "Not Found!");
  const userId = user._id;
  // check trong collection token
  const token = await TokenSchema.findOne({ userId });
  if (!token) {
    // random token
    const newToken = randomstring.generate(32);
    await TokenSchema.create({ userId, token: newToken });
    MailService.sendMail(
      email,
      "Forgot Password",
      `The link is valid for 5 minutes http://localhost:3000/reset-password?token=${newToken}&id=${userId}`
    );
    return res.status(200).json({
      success: true,
      message: "Please check your email",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Please check your email",
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { userId, token, password, repeatPassword } = req.body;
  if (password !== repeatPassword) throw new ApiError(400, "Validate error")
  const userToken = await TokenSchema.findOne({ userId });
  if (!userToken) {
    throw new ApiError(400, "Invalid token");
  }

  if (!token || userToken.token !== token)
    throw new ApiError(400, "Invalid token");
  const user = await UserSchema.findOne({ _id: userId });
  user.password = password;

  const result = await user.save();
  if (result) await userToken.remove();
  res.status(200).json({
    success: true,
    message: "Your password updated",
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { oldPassword, newPassword } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) throw new ApiError(404, "Not Found!");
  const isValidOladPassword = bcrypt.compareSync(oldPassword, user.password);
  if (!isValidOladPassword) throw new ApiError(400, "Invalid password");
  user.password = newPassword;
  await user.save();
  res.json({
    success: true,
    message: "Update password successfully!",
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { params } = req.body;
  await BookSchema.deleteMany({ author: { $in: params } });
  await UserSchema.deleteMany({ _id: { $in: params } });
  res.status(200).json({
    success: true,
  });
});

exports.getUserList = catchAsync(async (req, res) => {
  // const userList = await UserSchema.find({}).populate("books", "title -author");
  const { name, email, role, limit = 10, page = 1, sortBy, orderBy } = req.body;
  const query = {};
  const sort = {};
  if (name) {
    query.name = { $regex: new RegExp(name), $options: "i" };
  }
  if (email) {
    query.email = { $regex: new RegExp(email), $options: "i" };
  }
  if (role) {
    query.role = { $regex: new RegExp(role), $options: "i" };
  }
  if (sortBy) {
    sort[sortBy] = orderBy || "asc";
  }
  const data = await UserSchema.paginate(query, {
    limit: Number(limit),
    page: Number(page),
    populate: [{ path: "books", select: "title -author" }],
    sort,
  });
  const { docs } = data;
  delete data.docs;
  res.status(200).json({
    success: true,
    data: docs,
    paginate: { ...data },
  });
});

exports.uploadAvatar = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { filename } = req.file;
  const user = await UserSchema.findByIdAndUpdate(
    id,
    {
      image: `${process.env.HOST}/api/v1/file/${filename}`,
    },
    { new: true }
  );
  res.json({
    success: true,
    data: user,
  });
});


exports.getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await UserSchema.findById(userId);
  if (!user) throw new ApiError(404, "Not Found");
  res.json({ success: true, data: user });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { age, email, gender, name, role } = req.body;
  const user = await UserSchema.findByIdAndUpdate(
    userId,
    { age, email, gender, name, role },
    { new: true }
  );

  res.json({
    success: true,
    data: user,
  });
});

exports.getSeller = catchAsync(async (req, res) => {
  const sellers = await UserSchema.find({ role: { $in: ["seller", "admin"] } });

  res.json({
    success: true,
    data: sellers,
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie('access_token', "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  res.status(200)
    .json({ success: true, message: 'User logged out successfully' })
});

exports.getCurrentUser = catchAsync(async (req, res) => {
  const { role, id } = req.user

  return res.json({
    success: true,
    role,
    id
  });
});