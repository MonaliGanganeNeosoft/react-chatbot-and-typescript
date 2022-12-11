const express=require('express');
const { GET_COLOR } = require('../Controller/ColorController');
const router=express.Router();

router.get('/getcolor',GET_COLOR)
module.exports=router