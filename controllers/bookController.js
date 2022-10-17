const catchAsync = require("../middleware/async");
const BookSchema = require("../models/Book");

exports.createBook = catchAsync(async (req, res) => {
  const { title, description, category, price } = req.body;
  const userId = req.user.id;
  const book = await BookSchema.create({
    title,
    description,
    category,
    price,
    author: userId,
  });
  res.status(201).json({
    success: true,
    data: book,
  });
});

exports.getBookList = catchAsync(async (req, res) => {
  const {
    title,
    description,
    category,
    limit = 10,
    page = 1,
    sortBy,
    orderBy,
  } = req.body;
  const query = {};
  const sort = {};
  if (title) {
    query.title = { $regex: new RegExp(title), $options: "i" };
  }
  if (description) {
    query.description = { $regex: new RegExp(description), $options: "i" };
  }
  // if(category){
  //   query.category._id
  // }
  if (sortBy) {
    sort[sortBy] = orderBy || "asc";
  }
  const data = await BookSchema.paginate(query, {
    limit: Number(limit),
    page: Number(page),

    populate: [
      {
        path: "author",
        select: "name email",
      },
      {
        path: "category",
        select: "name description",
      },
    ],
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

exports.getBookById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const book = await BookSchema.findById(id)
    .populate("author", "name email")
    .populate("category", "name description");
  if (!book) {
    throw new ApiError(404, "Not Found!");
  }
  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = catchAsync(async (req, res) => {
  const { params } = req.body;
  await BookSchema.deleteMany({ _id: { $in: params } });

  res.status(200).json({
    success: true,
  });
});

exports.updateBook = catchAsync(async (req, res) => {
  const { title, description, category, price } = req.body;
  const { id } = req.params;
  const book = await BookSchema.findByIdAndUpdate(
    id,
    {
      title,
      description,
      category,
      price,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.uploadImage = catchAsync(async (req, res) => {
  const { id } = req.body;
  const book = await BookSchema.findByIdAndUpdate(
    id,
    {
      $push: {
        image: {
          $each: [
            ...req.files.map((val) => `${process.env.HOST}/${val.filename}`),
          ],
        },
      },
    },
    { new: true }
  );
  res.json({
    success: true,
    data: book,
  });
});
