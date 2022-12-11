const cartModel = require('../db/cartSchema')
const CartService = require('../services/cartService')
const ADD_TO_CART = async (req, res) => {
    try {
        const cart = await CartService.getCart({ customer_id: req.body.customer_id, product_id: req.body.product_id })
        console.log(cart);
        if (cart[0]) {
            cart[0].quantity = cart[0].quantity + 1;
            cart[0].total_Productcost = (cart[0].quantity * cart[0].product_cost)
            if (cart[0].quantity >= 1 && cart[0].quantity <= 10) {
                const data = await CartService.updatequery({ customer_id: req.body.customer_id, product_id: req.body.product_id }, { $set: { quantity: cart[0].quantity, total_Productcost: cart[0].total_Productcost } })
                return res.status(200).json({ err: 0, msg: ' product quantity added success fully' })
            }
            else {
                return res.status(200).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
            }
        }
        else {
            const user = await CartService.addtocart(req.body.customer_id, req.body.product_id, req.body.product_cost, req.body.product_cost)
            return res.status(200).json({ err: 0, msg: ' product added success fully' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.find({ customer_id: req.body.customer_id, product_id: req.body.product_id }, (err, data) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'Error Occured' })
    //     }
    //     else if (data[0]) {

    //         data[0].quantity = data[0].quantity + 1;
    //         data[0].total_Productcost = (data[0].quantity * data[0].product_cost)
    //         if (data[0].quantity >= 1 && data[0].quantity <= 10) {
    //             cartModel.updateMany({ customer_id: req.body.customer_id, product_id: req.body.product_id }, { $set: { quantity: data[0].quantity, total_Productcost: data[0].total_Productcost } }, (err) => {
    //                 if (err) {
    //                     console.log(err);
    //                     res.status(400).json({ err: 1, msg: 'unable to insert' })
    //                 }
    //                 else {
    //                     res.status(200).json({ err: 0, msg: ' product quantity added success fully' })
    //                 }
    //             })
    //         }
    //         else {
    //             res.status(400).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
    //         }
    //     }
    //     else {
    //         console.log(req.body.customer_id);
    //         let userData = new cartModel({ customer_id: req.body.customer_id, product_id: req.body.product_id, product_cost: req.body.product_cost, quantity: 1, total_Productcost: req.body.product_cost })
    //         userData.save((err) => {
    //             if (err) {
    //                 console.log(err);
    //                 res.status(400).json({ err: 1, msg: 'unable to insert' })
    //             }
    //             else {
    //                 res.status(200).json({ err: 0, msg: ' product added success fully' })
    //             }
    //         })
    //     }
    // })
}
const CART_COUNT = async (req, res) => {
    try {
        const cart = await CartService.getCart({ customer_id: req.body.id })
        const length = cart.length
        return res.status(200).json({ err: 0, count: length })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.find({ customer_id: req.body.id })
    //     .populate(["product_id"])
    //     .then(cart => {
    //         console.log(cart.length),
    //             res.status(200).json({ err: 1, count: cart.length })
    //     })
}
const CHANGE_UUID = async (req, res) => {
    try {
        const data = await CartService.updatequery({ customer_id: req.body.cartid }, { $set: { customer_id: req.body.id } })
        return res.status(200).json({ err: 0, msg: 'cart edited' })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.updateMany({ customer_id: req.body.cartid }, { $set: { customer_id: req.body.id } }, (err) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'unable to login' })
    //     }
    //     else {
    //         res.status(200).json({ err: 0, msg: 'cart edited' })
    //     }
    // })
}
const GET_CART = async (req, res) => {
    try {
        const cart = await CartService.getCart({ customer_id: req.body.id })
        return res.status(200).json({ err: 0, cartData: cart })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.find({ customer_id: req.body.id })
    //     .populate(["product_id"])
    //     .then(cart => {
    //         res.status(200).json({ err: 1, cartData: cart })
    //     })
}
const INC_QUANTITY = async (req, res) => {
    try {
        const cart = await CartService.getCart({ _id: req.body.id })
        cart[0].quantity = cart[0].quantity + 1;
        cart[0].total_Productcost = (cart[0].quantity * cart[0].product_cost)
        if (cart[0].quantity >= 1 && cart[0].quantity <= 10) {
            const data = await CartService.updatequery({ _id: req.body.id }, { $set: { quantity: cart[0].quantity, total_Productcost: cart[0].total_Productcost } })
            return res.status(200).json({ err: 0, msg: ' product quantity added success fully' })
        }
        else {
            return res.status(200).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.find({ _id: req.body.id }, (err, data) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'Error Occured' })
    //     }
    //     else {
    //         data[0].quantity = data[0].quantity + 1;
    //         data[0].total_Productcost = (data[0].quantity * data[0].product_cost)
    //         if (data[0].quantity >= 1 && data[0].quantity <= 10) {
    //             cartModel.updateMany({ _id: req.body.id }, { $set: { quantity: data[0].quantity, total_Productcost: data[0].total_Productcost } }, (err) => {
    //                 if (err) {
    //                     console.log(err);
    //                     res.status(400).json({ err: 1, msg: 'unable to insert' })
    //                 }
    //                 else {
    //                     res.status(200).json({ err: 0, msg: ' product quantity added success fully' })
    //                 }
    //             })
    //         }
    //         else {
    //             res.status(400).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
    //         }
    //     }
    // })
}
const DEC_QUANTITY = async (req, res) => {
    try {
        const cart = await CartService.getCart({ _id: req.body.id })
        cart[0].quantity = cart[0].quantity - 1;
        cart[0].total_Productcost = (cart[0].quantity * cart[0].product_cost)
        if (cart[0].quantity >= 1 && cart[0].quantity <= 10) {
            const data = await CartService.updatequery({ _id: req.body.id }, { $set: { quantity: cart[0].quantity, total_Productcost: cart[0].total_Productcost } })
            return res.status(200).json({ err: 0, msg: ' product quantity subtracted success fully' })
        }
        else {
            return res.status(200).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.find({ _id: req.body.id }, (err, data) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'Error Occured' })
    //     }
    //     else {
    //         data[0].quantity = data[0].quantity - 1;
    //         data[0].total_Productcost = (data[0].quantity * data[0].product_cost)
    //         if (data[0].quantity >= 1 && data[0].quantity <= 10) {
    //             cartModel.updateMany({ _id: req.body.id }, { $set: { quantity: data[0].quantity, total_Productcost: data[0].total_Productcost } }, (err) => {
    //                 if (err) {
    //                     console.log(err);
    //                     res.status(400).json({ err: 1, msg: 'unable to insert' })
    //                 }
    //                 else {
    //                     res.status(200).json({ err: 0, msg: ' product quantity subtracted success fully' })
    //                 }
    //             })
    //         }
    //         else {
    //             res.status(400).json({ err: 1, msg: 'You can only add 10 product quantity at a time' })
    //         }
    //     }
    // })
}
const DELETE_ITEM = async (req, res) => {
    try {
        const deletedata = await CartService.deletequery({ _id: req.body.id })
        res.status(200).json({ err: 0, msg: 'Item Delete successfully' })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.deleteOne({ _id: req.body.id }, (err) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'Unable to delete' })
    //     }
    //     else {
    //         res.status(200).json({ err: 0, msg: 'Item Delete successfully' })
    //     }
    // })
}
const ORDER_DONE = async (req, res) => {
    try {
        const deletedata = await CartService.deletequery({ customer_id: req.body.id })
        res.status(200).json({ err: 0, msg: 'Cart Delete successfully' })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await cartModel.deleteMany({ customer_id: req.body.id }, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(400).json({ err: 1, msg: 'Unable to delete' })
    //     }
    //     else {
    //         res.status(200).json({ err: 0, msg: 'Cart Delete successfully', itemdelete: data })
    //     }
    // })
}
module.exports = { ADD_TO_CART, CART_COUNT, CHANGE_UUID, GET_CART, INC_QUANTITY, DEC_QUANTITY, DELETE_ITEM, ORDER_DONE }