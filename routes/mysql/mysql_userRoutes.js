const express = require("express");
const {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById
} = require("../../controllers/mysql/mysql_userController");
// const { jwtAuth, jwtAuthAdmin } = require("../middleware/jwtAuth");
// const uploadMongo = require("../middleware/uploadMongo");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", addUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
