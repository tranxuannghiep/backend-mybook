const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteUser,
  getUserList,
  uploadAvatar,
} = require("../controllers/authController");
const { jwtAuth } = require("../middleware/jwtAuth");
const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.patch("/updatepassword", jwtAuth, updatePassword);
router.post("/delete", deleteUser);
router.post("/", getUserList);
router.post("/upload", uploadMongo.single("avatar"), uploadAvatar);

module.exports = router;
