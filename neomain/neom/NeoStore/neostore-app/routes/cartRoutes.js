const express = require('express');
const { ADD_TO_CART, CART_COUNT, CHANGE_UUID, GET_CART, INC_QUANTITY, DEC_QUANTITY, DELETE_ITEM, ORDER_DONE } = require('../Controller/CartController');
const router = express.Router();
router.post('/addtocart', ADD_TO_CART)
router.post('/cartcount', CART_COUNT)
router.post('/changeuuid', CHANGE_UUID)
router.post('/getCart', GET_CART)
router.post('/incquantity', INC_QUANTITY)
router.post('/decquantity', DEC_QUANTITY)
router.post('/deleteItem', DELETE_ITEM)
router.post('/orderDone', ORDER_DONE)
module.exports = router