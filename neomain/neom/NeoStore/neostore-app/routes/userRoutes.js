const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')
const userModel = require('../db/userSchema');
const jwt = require('jsonwebtoken')
const jwtSecret = 'sdsfdsfdsfdsf'
const nodemailer = require('nodemailer')
const path = require('path')
const bcrypt = require('bcrypt');
const { ADD_USER, LOGIN_USER, FORGOT_PASSWORD, GENRATE_OTP, CHNAGE_PASSWORD, DELETE_ADDRESS, EDIT_ADDRESS } = require('../Controller/userController');
require('dotenv').config()
const saltRounds = 10;


function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        res.status(404).json("Token not Found");
    } else {
        jwt.verify(token, jwtSecret, (err) => {
            if (err) {
                console.log(err);
                res.status(400).json("Token Not Matched");
            } else {
                console.log("Token Match ");
                next();
            }
        });
    }
}

router.post('/adduser', ADD_USER)
router.post('/loginuser', LOGIN_USER)
router.post('/forgettenpass', FORGOT_PASSWORD)
router.post('/genrateotp', GENRATE_OTP)
router.post('/ChangePassword', autenticateToken, CHNAGE_PASSWORD)
router.post('/deleteAddress', autenticateToken, DELETE_ADDRESS)
router.post('/editAddress', autenticateToken, EDIT_ADDRESS)
module.exports = router