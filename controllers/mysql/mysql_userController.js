const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../middleware/async");
const mysql = require("../../config/mysql");
const ApiError = require("../../utils/ApiError");
// const UserSchema = require("../models/User");

exports.getUsers = catchAsync(async (req, res, next) => {
    mysql.query('SELECT * FROM users LIMIT 10', (error, results, fields) => {
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

exports.addUser = catchAsync(async (req, res, next) => {
    const { first_name, last_name, age, gender, country, email } = req.body
    mysql.query(
        'INSERT INTO users(first_name,last_name,age,gender,country,email) VALUES (?,?,?,?,?,?)', [first_name, last_name, age, gender, country, email],
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

exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const data = req.body
    mysql.query(
        'UPDATE users SET ? WHERE id=?', [data, id],
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

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    mysql.query(
        'DELETE FROM users  WHERE id=?', id,
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

exports.getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params
    mysql.query(
        'SELECT * FROM users  WHERE id=?', id,
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