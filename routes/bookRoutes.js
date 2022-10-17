const express = require("express");
const {
  createBook,
  getBookList,
  getBookById,
  deleteBook,
  updateBook,
  uploadImage,
} = require("../controllers/bookController");
const { jwtAuth } = require("../middleware/jwtAuth");
const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

router.post("/", jwtAuth, createBook);
router.post("/all", getBookList);
router.get("/:id", getBookById);
router.post("/delete", deleteBook);
router.patch("/:id", updateBook);
router.post("/upload", uploadMongo.array("image"), uploadImage);

module.exports = router;
