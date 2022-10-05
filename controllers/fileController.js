const Mongo = require("../config/db");
const catchAsync = require("../middleware/async");
const ApiError = require("../utils/ApiError");

exports.getFile = catchAsync(async (req, res) => {
  const { filename } = req.params;
  Mongo.gridfs.find({ filename }).toArray((err, files, next) => {
    if (err || !files || !files.length) {
      return next(new ApiError(404, "File is not found"));
    }
    Mongo.gridfs.openDownloadStreamByName(filename).pipe(res);
  });
});

exports.uploadFile = catchAsync(async (req, res) => {
  // const result = req.files.map((val) => val.filename);
  // console.log(result);
  res.json({
    success: true,
    message: "Update image successfully!",
  });
});
