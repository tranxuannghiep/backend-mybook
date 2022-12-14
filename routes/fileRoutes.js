const express = require("express");
const { getFile, uploadFile } = require("../controllers/fileController");
const { jwtAuth } = require("../middleware/jwtAuth");
const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

router.get("/:filename", getFile);
router.post("/", uploadMongo.array("image"), uploadFile);

module.exports = router;
