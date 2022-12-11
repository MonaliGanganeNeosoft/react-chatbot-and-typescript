const express=require('express');
const { GET_CATEGORY } = require('../Controller/CategoryController');
const router=express.Router();

router.get('/getcategory',GET_CATEGORY)
module.exports=router