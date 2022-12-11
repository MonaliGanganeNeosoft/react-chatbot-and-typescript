const cartSchema = require('../db/cartSchema')
exports.getCart = async (query) => {
    try {
        const cart = await cartSchema.find(query).populate(["product_id"])
        // console.log(cart);
        // console.log([cart]);
        return cart
    }
    catch (e) {
        throw Error('Error while get cart ')
    }
}
exports.addtocart = async (customer_id,product_id,product_cost,total_Productcost) => {
    try {
        let userData =  new cartSchema({ customer_id: customer_id, product_id: product_id, product_cost: product_cost, quantity: 1, total_Productcost: total_Productcost })
        const user=await userData.save()
        return user
    }
    catch (e) {
        throw Error('Error while add to cart ')
    }
}
exports.updatequery = async (query,value) => {
    try {
        const cart=await cartSchema.updateMany(query,value)
        return cart
    }
    catch (e) {
        throw Error('Error while add to cart ')
    }
}
exports.deletequery= async (query) => {
    try {
        const cart=await cartSchema.deleteMany(query)
        return cart
    }
    catch (e) {
        throw Error('Error while add to cart ')
    }
}