const express = require('express')
const router = express.Router();
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')
const jwtSecret = 'sdsfdsfdsfdsf'
const { USER_SOCIAL_LOGIN, PROFILE_UPDATE, UPDATE_PROFILE_PIC, ADD_ADDRESS } = require('../Controller/SocialController');
function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        res.json("Token not Found");
    } else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json("Token Not Matched");
            } else {
                console.log("Token Match ");
                next();
            }
        });
    }
}
router.post('/usersociallogin', USER_SOCIAL_LOGIN)
router.post('/profileupdate', PROFILE_UPDATE)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/Full stack/FinalProduct/finalproject/public/Image/')
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        console.log(filename);
        cb(null, filename)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
})
router.post('/UpdateProfilePic', autenticateToken, upload.single('file'), UPDATE_PROFILE_PIC)
router.post('/addAddress', autenticateToken, ADD_ADDRESS)
module.exports = router