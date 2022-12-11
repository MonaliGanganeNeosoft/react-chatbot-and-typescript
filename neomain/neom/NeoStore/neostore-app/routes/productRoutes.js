const express=require('express')
const router=express.Router();
const productModel=require('../db/productSchema')
const categoryModel=require('../db/categorySchema')
const colorModel=require('../db/colorSchema')
const jwt=require('jsonwebtoken');
const {   GET_POPULAR_PRODUCT, GET_PRODUCT, FILTER_PRODUCT, SET_RATING } = require('../Controller/ProductController');
const jwtSecret='sdsfdsfdsfdsf'

router.get('/getProduct',GET_PRODUCT)
router.post('/FilterProduct',FILTER_PRODUCT)
router.get('/getpopularproduct',GET_POPULAR_PRODUCT)
router.post('/setrating',autenticateToken,SET_RATING)
function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      res.status(404).json("Token not Found");
    } else {
      jwt.verify(token, jwtSecret, (err, data) => {
        if (err) {
          res.status(400).json("Token Not Matched");
        } else {
          console.log("Token Match ");
          next();
        }
      });
    }
  }

module.exports=router