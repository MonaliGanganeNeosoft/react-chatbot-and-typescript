const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const jwtSecret = "monimonimoni";

const { ADD_USER } = require("../Controller/userController");

require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(404).json("Token not matched");
  } else {
    jwt.verify(token, jwtSecret, (err) => {
      if (err) {
        console.log(err);
        res.status(400).json("Token not matched");
      } else {
        console.log("Token matched");
        next();
      }
    });
  }
}
router.post("/adduser", ADD_USER);
module.exports = router;
