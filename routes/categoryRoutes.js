const express = require("express");
const {
  createCategory,
  getCategoryList,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategoryList);

module.exports = router;
