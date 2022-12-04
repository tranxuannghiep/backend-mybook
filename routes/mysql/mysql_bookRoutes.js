const express = require("express");
const { addBook, getBooks } = require("../../controllers/mysql/mysql_bookController");
// const { jwtAuth, jwtAuthAdmin } = require("../middleware/jwtAuth");
// const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

// router.get("/", getUsers);
// router.get("/:id", getUserById);
router.post("/", addBook);
router.get("/", getBooks);


module.exports = router;
