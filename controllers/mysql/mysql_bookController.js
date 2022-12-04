const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../middleware/async");
const mysql = require("../../config/mysql");
const ApiError = require("../../utils/ApiError");
// const UserSchema = require("../models/User");

exports.addBook = catchAsync(async (req, res, next) => {
  const { title, description, idUser } = req.body
  mysql.query('INSERT INTO books(title,description,idUser) VALUES(?,?,?)', [title, description, idUser],
    (error, results, fields) => {
      if (error) {
        return next(new ApiError(400, error.message))
      }
      res.json({
        success: true,
        data: results,
      })
      // console.log(JSON.stringify(results, null, 2))
    })
})

exports.getBooks = catchAsync(async (req, res, next) => {
  mysql.query('SELECT books.*,users.first_name FROM books LEFT JOIN users ON books.idUser = users.id',
    (error, results, fields) => {
      if (error) {
        return next(new ApiError(400, error.message))
      }
      res.json({
        success: true,
        data: results,
      })
      // console.log(JSON.stringify(results, null, 2))
    })
})