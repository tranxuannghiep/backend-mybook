const catchAsync = require("../middleware/async");
const CategorySchema = require("../models/Category");

exports.createCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const category = await CategorySchema.create({ name, description });
  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.getCategoryList = catchAsync(async (req, res) => {
  const categoryList = await CategorySchema.find({});
  res.status(200).json({
    success: true,
    data: categoryList,
  });
});
