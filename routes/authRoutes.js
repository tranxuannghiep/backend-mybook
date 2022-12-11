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
  getUserById,
  updateUser,
  logout,
} = require("../controllers/authController");
const { jwtAuth, jwtAuthAdmin } = require("../middleware/jwtAuth");
const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.patch("/updatepassword", jwtAuth, updatePassword);
router.post("/delete", jwtAuthAdmin, deleteUser);
router.post("/", jwtAuthAdmin, getUserList);
router.get("/user/:userId", jwtAuth, getUserById);
router.patch("/user/:userId", jwtAuth, updateUser);
router.post("/upload", uploadMongo.single("avatar"), uploadAvatar);

module.exports = router;
