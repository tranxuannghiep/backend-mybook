const multer = require("multer");
const randomstring = require("randomstring");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");

const fileFilter = (req, file, cb) => {
  const allowExtensions = [".jpg", ".png", ".gif", ".jpeg"];
  const fileExtension = path.extname(file.originalname);
  const regex = new RegExp(`(${allowExtensions.join("|")})$`, "i");
  if (regex.test(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("File extension is not allow"), false);
  }
};

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${file.fieldname}-${randomstring.generate(10)}${path.extname(
        file.originalname
      )}`,
      bucketName: process.env.BUCKET_NAME,
    };
  },
});

const uploadMongo = multer({ storage, fileFilter });

module.exports = uploadMongo;
